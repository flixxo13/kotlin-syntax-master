import { useState, useEffect, useRef, useCallback } from "react";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const EXERCISES = [
  {
    id: "ex1", conceptId: "val vs. var",
    task: 'Deklariere eine read-only Variable "version" mit dem Wert 2.0.',
    initialCode: "", solution: "val version = 2.0",
    hints: ["... version = 2.0", "val version = ...", "val version = 2.0"],
  },
  {
    id: "ex2", conceptId: "Funktionen",
    task: 'Schreibe die main-Funktion, die "Hello" ausgibt.',
    initialCode: "", solution: 'fun main() { println("Hello") }',
    hints: ['... ...() { ...("...") }', 'fun main() { println("...") }', 'fun main() { println("Hello") }'],
  },
  {
    id: "ex3", conceptId: "Null-Safety",
    task: "Weise result den Wert von input zu, oder 0 falls input null ist.",
    initialCode: "val input: Int? = null", solution: "val result = input ?: 0",
    hints: ["... ... = ... ... ...", "val result = input ... 0", "val result = input ?: 0"],
  },
  {
    id: "ex4", conceptId: "Listen",
    task: "Greife auf Index 2 der Liste data zu und weise es x zu.",
    initialCode: "val data = listOf(10, 20, 30)", solution: "val x = data[2]",
    hints: ["... ... = ... ...", "val x = data[...]", "val x = data[2]"],
  },
];

// ─── TOKENIZER & FEEDBACK ─────────────────────────────────────────────────────
const KW = new Set(["val","var","fun","if","else","when","for","while","return",
  "class","in","is","as","null","true","false","Int","String","Boolean","Double","Long",
  "listOf","mutableListOf","println","print","downTo","until"]);
const ST = new Set(["(",")","{","}","[","]","=",":",".","->","?:","?.","!!",
  "+","-","*","/","%","<",">","==","!=","&&","||","!",","]);

function tokenize(code: string) {
  if (!code.trim()) return [];
  const re = /\?:|\.\.\.|\?\.|!!|->|<=|>=|==|!=|&&|\|\||[+\-*/%<>!]|[(){}[\]=:.,]|"[^"]*"|\d+\.?\d*|\b\w+\.?\w*\b|\S/g;
  const out: string[] = []; let m: RegExpExecArray | null;
  while ((m = re.exec(code)) !== null) out.push(m[0]);
  return out;
}

function analyze(code: string, solution: string) {
  const ct = tokenize(code), st = tokenize(solution);
  return ct.map((tok, i) => ({
    tok,
    s: st[i] === tok ? "correct"
     : st.includes(tok) ? "present"
     : (KW.has(tok) || ST.has(tok) || /^\d+\.?\d*$/.test(tok)) ? "syntax"
     : "unknown",
  }));
}

const CHIP: Record<string, { bg: string; border: string; color: string; mark: string | null }> = {
  correct: { bg:"rgba(34,197,94,.2)",   border:"rgba(34,197,94,.6)",   color:"#4ade80", mark:"✓" },
  present: { bg:"rgba(59,130,246,.2)",  border:"rgba(59,130,246,.6)",  color:"#60a5fa", mark:"~" },
  syntax:  { bg:"rgba(100,116,139,.1)", border:"rgba(100,116,139,.2)", color:"#52606e", mark:null },
  unknown: { bg:"rgba(71,85,105,.08)",  border:"rgba(71,85,105,.15)",  color:"#3d4654", mark:null },
};

const HCOL = ["#f97316","#fb923c","#fca5a5"];

function getSmartTokens(code: string) {
  const t = code.trimEnd();
  if (!t)                        return ["val","var","fun","if","when","for","return"];
  if (/=\s*$/.test(t))           return ["2.0","0","true","false",'"text"',"null","input","n","1","listOf("];
  if (/\b(val|var)\s+$/.test(t)) return ["version","result","count","name","x","data","i"];
  if (/\bfun\s+$/.test(t))       return ["main()","inc(","greet(","add("];
  if (/\?:\s*$/.test(t))         return ["0","false",'"default"',"null"];
  if (/:\s*$/.test(t))           return ["Int","String","Boolean","Double","Long","Unit"];
  if (/\w\s*$/.test(t))          return ["=",":",".","(","[","?:","?.","!!","+","-","->"];
  return ["val","var","fun","=",":","->","?:","?.","( )","{ }","[ ]","+","-",","];
}

const LINE_H = 24;
const PAD_T  = 10;

const smallBtn = (size = 34) => ({
  width: size, height: size, borderRadius: 8,
  background: "transparent", border: "none",
  color: "#9ca3af", cursor: "pointer", fontSize: size > 30 ? 18 : 15,
  display: "flex", alignItems: "center", justifyContent: "center",
  flexShrink: 0, outline: "none",
});

const toggleBtn = (active: boolean) => ({
  width: 32, height: 32, borderRadius: 8,
  background: active ? "rgba(124,58,237,.3)" : "rgba(255,255,255,.05)",
  border: active ? "1px solid rgba(124,58,237,.5)" : "1px solid rgba(255,255,255,.07)",
  color: active ? "#c4b5fd" : "#6b7280",
  cursor: "pointer", fontSize: 13,
  display: "flex", alignItems: "center", justifyContent: "center",
  outline: "none", transition: "all .15s",
});

// ─── DEBUG LOG ────────────────────────────────────────────────────────────────
let _logLines: string[] = [];
let _logSetter: ((l: string[]) => void) | null = null;

function dbg(msg: string) {
  const ts = new Date().toISOString().slice(11, 23);
  _logLines = [`${ts} ${msg}`, ..._logLines].slice(0, 40);
  if (_logSetter) _logSetter([..._logLines]);
}

function DebugOverlay() {
  const [lines, setLines] = useState<string[]>([]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    _logSetter = setLines;
    return () => { _logSetter = null; };
  }, []);

  return (
    <div style={{
      position: "fixed", top: 0, right: 0, zIndex: 9999,
      width: visible ? 240 : 36, maxHeight: "50vh",
      background: "rgba(0,0,0,.92)", border: "1px solid #333",
      borderRadius: "0 0 0 8px", overflow: "hidden",
      fontSize: 9, fontFamily: "monospace",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "3px 6px", background: "#111", borderBottom: "1px solid #333", cursor: "pointer" }}
        onClick={() => setVisible(v => !v)}>
        <span style={{ color: "#f97316", fontWeight: 700 }}>🐛 {visible ? "LOG" : ""}</span>
        {visible && <button onClick={(e) => { e.stopPropagation(); _logLines = []; setLines([]); }} style={{ background: "none", border: "none", color: "#6b7280", fontSize: 9, cursor: "pointer" }}>CLR</button>}
      </div>
      {visible && (
        <div style={{ overflowY: "auto", maxHeight: "calc(50vh - 24px)", padding: "4px 6px" }}>
          {lines.length === 0
            ? <div style={{ color: "#333" }}>– warte auf Events –</div>
            : lines.map((l, i) => (
                <div key={i} style={{
                  color: l.includes("BLUR") ? "#f87171" : l.includes("FOCUS") ? "#4ade80" : l.includes("IGNORED") ? "#6b7280" : l.includes("OPEN ✓") ? "#22c55e" : l.includes("CLOSED ✓") ? "#f59e0b" : "#9ca3af",
                  borderBottom: "1px solid #111", padding: "1px 0", wordBreak: "break-all",
                }}>{l}</div>
              ))
          }
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export function ExerciseScreen() {
  const [exIdx, setExIdx]           = useState(0);
  const ex                          = EXERCISES[exIdx];

  const [code, setCode]             = useState(ex.initialCode || "");
  const [hintLevel, setHintLevel]   = useState(0);
  const [solShown, setSolShown]     = useState(false);
  const [fb, setFb]                 = useState<string | null>(null);
  const [chips, setChips]           = useState<any[]>([]);
  const [solved, setSolved]         = useState(false);
  const [taskOpen, setTaskOpen]     = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [showTokens, setShowTokens] = useState(true);
  const [showChips,  setShowChips]  = useState(true);
  const [sheetH, setSheetH]         = useState<number | null>(null);
  const [kbH, setKbH]               = useState(0);

  const kbOpen = kbH > 80;
  const taRef = useRef<HTMLTextAreaElement>(null);
  const sheetDragY = useRef<number | null>(null);
  const sheetDragH = useRef<number | null>(null);

  // ── ★ NEU: ROBUSTE Keyboard-Erkennung mit Zustandsmaschine ──────────────────
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) { dbg("NO VISUAL VIEWPORT"); return; }

    // Fixe Basis-Höhe: Wird NUR EINMAL beim Mount bestimmt
    const BASE_H = window.innerHeight;

    type KbState = "closed" | "opening" | "open" | "closing";
    let kbState: KbState = "closed";
    let stableKbH = 0;
    let stateTimer: number;
    let lastVvH = BASE_H;

    const onResize = () => {
      const curVvH = vv.height;
      const rawKbH = Math.max(0, BASE_H - curVvH);

      // Kleine Schwankungen (< 15px) komplett ignorieren
      if (Math.abs(curVvH - lastVvH) < 15) return;
      lastVvH = curVvH;

      switch (kbState) {
        case "closed":
          if (rawKbH > 100) {
            kbState = "opening";
            clearTimeout(stateTimer);
            stateTimer = window.setTimeout(() => {
              if (kbState === "opening") {
                kbState = "open";
                stableKbH = rawKbH;
                setKbH(stableKbH);
                dbg(`KB OPEN ✓ → ${Math.round(stableKbH)}px`);
              }
            }, 150);
            dbg(`KB detecting open... rawKbH=${Math.round(rawKbH)}`);
          }
          break;

        case "opening":
          // Warte auf Stabilisierung
          break;

        case "open":
          if (rawKbH < 50) {
            kbState = "closing";
            clearTimeout(stateTimer);
            stateTimer = window.setTimeout(() => {
              if (kbState === "closing") {
                kbState = "closed";
                stableKbH = 0;
                setKbH(0);
                dbg(`KB CLOSED ✓`);
              }
            }, 100);
            dbg(`KB detecting close...`);
          } else if (Math.abs(rawKbH - stableKbH) < 150) {
            // ★ KEY FIX: Schwankungen während offen → IGNORIEREN
            dbg(`KB SWING IGNORED ✓ (diff=${Math.abs(Math.round(rawKbH - stableKbH))}px)`);
          } else {
            clearTimeout(stateTimer);
            stateTimer = window.setTimeout(() => {
              stableKbH = rawKbH;
              setKbH(stableKbH);
              dbg(`KB MAJOR ADJUST → ${Math.round(stableKbH)}px`);
            }, 300);
          }
          break;

        case "closing":
          // Warte auf Stabilisierung
          break;
      }
    };

    vv.addEventListener("resize", onResize);
    dbg(`VV INIT: baseH=${BASE_H}px (fixiert)`);

    return () => {
      vv.removeEventListener("resize", onResize);
      clearTimeout(stateTimer);
    };
  }, []);

  // ── reset ──
  useEffect(() => {
    setCode(ex.initialCode || "");
    setHintLevel(0); setSolShown(false);
    setFb(null); setChips([]); setSolved(false);
    setTaskOpen(true); setSheetH(null); setFullscreen(false);
  }, [ex]);

  useEffect(() => {
    setChips(code.trim() ? analyze(code, ex.solution) : []);
  }, [code, ex.solution]);

  useEffect(() => {
    if (solShown) setCode(ex.solution);
  }, [solShown, ex.solution]);

  const normalize = (s: string) => s.replace(/\s+/g, " ").trim();
  const isCorrect = normalize(code) === normalize(ex.solution);
  const solToks = tokenize(ex.solution).length;
  const pct = solToks > 0 ? Math.round(chips.filter(c => c.s === "correct").length / solToks * 100) : 0;
  const hl = typeof hintLevel === "number" ? hintLevel : 3;
  const allUsed = hl >= 3;

  const check = useCallback(() => {
    setFb(isCorrect ? "correct" : "incorrect");
    if (isCorrect) { setSolved(true); setTimeout(() => setFb(null), 2000); }
    else { setTimeout(() => setFb(null), 800); }
  }, [isCorrect]);

  const requestHint = useCallback(() => {
    if (solShown) return;
    if (!allUsed) {
      setHintLevel(h => typeof h === "number" ? h + 1 : 3);
    } else {
      setSolShown(true);
      setSheetH(180);
    }
  }, [solShown, allUsed]);

  const insert = useCallback((raw: string) => {
    const text = raw.replace("( )", "()").replace("{ }", "{}").replace("[ ]", "[]");
    const ta = taRef.current;
    if (ta) {
      const s = ta.selectionStart, e = ta.selectionEnd;
      const newCode = code.slice(0, s) + text + code.slice(e);
      setCode(newCode);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = s + text.length;
        ta.focus({ preventScroll: true });
        dbg(`insert "${text}" ok`);
      });
    } else {
      setCode(p => p + text);
    }
  }, [code]);

  const openFullscreenAndFocus = useCallback(() => {
    dbg("openFullscreen");
    setFullscreen(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const ta = taRef.current;
        if (ta) { ta.focus({ preventScroll: true }); dbg("focus() called"); }
        else { dbg("ERR: ta ref null"); }
      });
    });
  }, []);

  const onSheetDragStart = (e: any) => {
    sheetDragY.current = "touches" in e ? e.touches[0].clientY : e.clientY;
    sheetDragH.current = sheetH || 200;
  };
  const onSheetDragMove = (e: any) => {
    if (sheetDragY.current === null) return;
    const y = "touches" in e ? e.touches[0].clientY : e.clientY;
    setSheetH(Math.max(60, Math.min(420, (sheetDragH.current || 200) + (sheetDragY.current - y))));
  };
  const onSheetDragEnd = (e: any) => {
    const y = "changedTouches" in e ? e.changedTouches[0].clientY : e.clientY;
    if ((sheetDragY.current || 0) - y < -60) setSheetH(null);
    sheetDragY.current = null; sheetDragH.current = null;
  };

  const codeLines = code ? code.split("\n").length : 0;
  const initLines = ex.initialCode ? ex.initialCode.split("\n").length : 0;
  const ghostTop = PAD_T + Math.max(codeLines, initLines) * LINE_H + Math.round(LINE_H * 0.5);
  const currentHintText = hl === 1 ? ex.hints[0] : hl === 2 ? ex.hints[1] : hl === 3 ? ex.hints[2] : null;
  const showGhost = !!currentHintText && !solShown;
  const smartToks = getSmartTokens(code);
  const TOKEN_H = showTokens ? 48 : 44;
  const SHEET_OPEN = sheetH !== null;

  // ══════════════════════════════════════════════════════════════════════
  // FULLSCREEN
  // ══════════════════════════════════════════════════════════════════════
  if (fullscreen) {
    return (
      <>
        <style>{STYLES}</style>
        <DebugOverlay />
        <div style={{
          display: "flex", flexDirection: "column",
          height: "100dvh", maxWidth: 430, margin: "0 auto",
          background: "#060609", color: "#f1f0fb",
          fontFamily: "'Inter',system-ui,sans-serif", overflow: "hidden",
          paddingBottom: kbH + TOKEN_H + (SHEET_OPEN ? (sheetH || 0) : 0),
          transition: "padding-bottom 0.2s ease-out",
        }}>
          {/* Header */}
          <div style={{ height: 46, flexShrink: 0, background: "#0d0d14", borderBottom: "1px solid #1e1e2e", display: "flex", alignItems: "center", padding: "0 10px", gap: 6 }}>
            <button onClick={() => { dbg("← back"); setFullscreen(false); taRef.current?.blur(); }} style={smallBtn()}>←</button>
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: 9, fontFamily: "monospace", color: "#6b7280", textTransform: "uppercase", letterSpacing: ".1em" }}>ÜBUNG</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: solved ? "#4ade80" : "#f1f0fb" }}>{ex.conceptId}{solved && " ✓"}</div>
            </div>
            <button onClick={() => setShowChips(p => !p)} style={toggleBtn(showChips)}>≡</button>
            <button onClick={() => setShowTokens(p => !p)} style={toggleBtn(showTokens)}>⌨</button>
          </div>

          {/* Live Status Bar */}
          <div style={{ height: 20, flexShrink: 0, background: "#080810", display: "flex", alignItems: "center", padding: "0 10px", gap: 8, borderBottom: "1px solid #1a1a28" }}>
            <span style={{ fontSize: 9, fontFamily: "monospace", color: kbOpen ? "#4ade80" : "#6b7280" }}>
              KB:{kbOpen ? "OPEN" : "CLOSED"} {kbH}px
            </span>
            <span style={{ fontSize: 9, fontFamily: "monospace", color: "#4b5563" }}>
              | base:{typeof window !== "undefined" ? window.innerHeight : "?"} vv:{Math.round(typeof window !== "undefined" && window.visualViewport?.height ? window.visualViewport.height : 0)}
            </span>
          </div>

          {/* Chips nur wenn Tastatur ZU */}
          {showChips && !kbOpen && (
            <div style={{ minHeight: 32, flexShrink: 0, background: "#0a0a10", borderTop: "1px solid #1e1e2e", display: "flex", alignItems: "center", flexWrap: "wrap", gap: 4, padding: "4px 12px" }}>
              {chips.length === 0
                ? <span style={{ fontSize: 10, fontFamily: "monospace", color: "#2a2a3e" }}>• Syntax-Elemente erscheinen hier…</span>
                : <>
                    {chips.map((c, i) => { const st = CHIP[c.s] || CHIP.unknown; return <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 2, padding: "2px 7px", borderRadius: 6, fontSize: 12, fontFamily: "monospace", fontWeight: 600, background: st.bg, border: `1px solid ${st.border}`, color: st.color }}>{c.tok}{st.mark && <span style={{ fontSize: 9, opacity: .8 }}>{st.mark}</span>}</span>; })}
                    {solToks > 0 && (
                      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
                        <div style={{ width: 40, height: 3, background: "#1e1e2e", borderRadius: 2, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "#22c55e" : "#7c3aed", borderRadius: 2, transition: "width .25s" }} />
                        </div>
                        <span style={{ fontSize: 9, fontFamily: "monospace", fontWeight: 700, color: pct === 100 ? "#4ade80" : "#6b7280", minWidth: 24 }}>{pct}%</span>
                      </div>
                    )}
                  </>
              }
            </div>
          )}

          {/* Editor */}
          <div style={{ flex: 1, minHeight: 0, position: "relative", background: "#0a0a10" }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 28, background: "#0d0d14", borderRight: "1px solid #1a1a28", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: PAD_T, fontSize: 11, fontFamily: "monospace", color: "#3a3a5a", userSelect: "none", pointerEvents: "none" }}>1</div>
            {showGhost && (
              <div style={{ position: "absolute", left: 28, right: 0, top: ghostTop, padding: "0 12px", pointerEvents: "none", fontFamily: "'JetBrains Mono',monospace", fontSize: 14, lineHeight: `${LINE_H}px`, color: "rgba(120,80,220,.25)", whiteSpace: "pre-wrap", zIndex: 5 }}>
                {currentHintText}
              </div>
            )}
            <textarea
              ref={taRef}
              value={code}
              onChange={e => setCode(e.target.value)}
              onFocus={() => dbg("FOCUS ← textarea")}
              onBlur={(e) => dbg(`BLUR → relatedTarget:${(e.relatedTarget as HTMLElement)?.tagName ?? "null"}`)}
              autoFocus
              inputMode="text"
              enterKeyHint="done"
              style={{
                position: "absolute", inset: 0, left: 28,
                background: "transparent", border: "none", outline: "none",
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 16, lineHeight: `${LINE_H}px`,
                color: fb === "correct" ? "#4ade80" : fb === "incorrect" ? "#f87171" : "#e2e8f0",
                padding: `${PAD_T}px 12px 10px`,
                resize: "none", caretColor: "#7c3aed",
                spellCheck: false, autoCorrect: "off", autoCapitalize: "off",
                WebkitUserSelect: "text", userSelect: "text",
                touchAction: "manipulation",
              }}
              placeholder={showGhost ? "" : "// Code hier…"}
            />
            {fb && (
              <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center", background: fb === "correct" ? "rgba(34,197,94,.07)" : "rgba(248,113,113,.07)", fontSize: 48 }}>
                {fb === "correct" ? "✅" : "❌"}
              </div>
            )}
          </div>
        </div>

        {/* ★ FIX: Fixed Accessory mit CSS Transition */}
        <div style={{
          position: "fixed",
          bottom: kbH,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 430,
          zIndex: 200,
          display: "flex",
          flexDirection: "column",
          transition: "bottom 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          willChange: "bottom",
        }}>
          {/* Chips über Tastatur */}
          {showChips && kbOpen && (
            <div style={{ minHeight: 32, flexShrink: 0, background: "#0a0a10", borderTop: "1px solid #1e1e2e", display: "flex", alignItems: "center", flexWrap: "wrap", gap: 4, padding: "4px 12px" }}>
              {chips.map((c, i) => { const st = CHIP[c.s] || CHIP.unknown; return <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 2, padding: "2px 7px", borderRadius: 6, fontSize: 12, fontFamily: "monospace", fontWeight: 600, background: st.bg, border: `1px solid ${st.border}`, color: st.color }}>{c.tok}{st.mark && <span style={{ fontSize: 9, opacity: .8 }}>{st.mark}</span>}</span>; })}
            </div>
          )}

          {/* Token-Leiste Modus 1: Kompakt mit Token-Buttons */}
          {showTokens ? (
            <div style={{ height: 48, background: "#0d0d14", borderTop: "1px solid #1e1e2e", display: "flex", alignItems: "center", padding: "0 8px", gap: 5, overflowX: "auto", scrollbarWidth: "none", flexShrink: 0 }}>
              <button onTouchEnd={(e) => { e.preventDefault(); requestHint(); }} onClick={requestHint} disabled={solShown}
                style={{ height: 34, padding: "0 8px", borderRadius: 8, flexShrink: 0, background: hl > 0 ? "rgba(249,115,22,.15)" : "#16162a", border: `1px solid ${hl > 0 ? "rgba(249,115,22,.4)" : "#252540"}`, color: solShown ? "#374151" : hl > 0 ? "#f97316" : "#6b7280", cursor: solShown ? "default" : "pointer", display: "flex", alignItems: "center", gap: 5, outline: "none" }}>
                <span style={{ fontSize: 14 }}>💡</span>
                <div style={{ display: "flex", gap: 3 }}>{[0,1,2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: i < hl ? HCOL[i] : "#252540" }} />)}</div>
                <span onTouchEnd={e => { e.preventDefault(); e.stopPropagation(); setSheetH(s => s === null ? 200 : null); }} onClick={e => { e.stopPropagation(); setSheetH(s => s === null ? 200 : null); }} style={{ fontSize: 10, color: "#4b5563", marginLeft: 2, padding: "4px", cursor: "pointer", lineHeight: 1 }}>{SHEET_OPEN ? "▾" : "▴"}</span>
              </button>
              <div style={{ width: 1, height: 22, background: "#1e1e2e", flexShrink: 0 }} />
              <button onTouchEnd={(e) => { e.preventDefault(); check(); }} onClick={check}
                style={{ width: 34, height: 34, borderRadius: 8, flexShrink: 0, background: isCorrect ? "rgba(34,197,94,.2)" : "#16162a", border: `1.5px solid ${isCorrect ? "#22c55e" : "#252540"}`, color: isCorrect ? "#4ade80" : "#6b7280", cursor: "pointer", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", outline: "none" }}>
                {isCorrect ? "✓" : "▶"}
              </button>
              <div style={{ width: 1, height: 22, background: "#1e1e2e", flexShrink: 0 }} />
              {smartToks.map((s, i) => (
                <button key={i} onTouchEnd={(e) => { e.preventDefault(); insert(s); }} onClick={() => insert(s)}
                  style={{ padding: "5px 10px", height: 34, flexShrink: 0, background: "#16162a", border: "1px solid #252540", borderRadius: 7, color: "#c4b5fd", fontFamily: "monospace", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", outline: "none" }}>{s}</button>
              ))}
            </div>
          ) : (
            /* Token-Leiste Modus 2: Breit mit Check-Button */
            <div style={{ height: 44, background: "#0d0d14", borderTop: "1px solid #1e1e2e", display: "flex", alignItems: "center", padding: "0 16px", flexShrink: 0 }}>
              <button onTouchEnd={(e) => { e.preventDefault(); requestHint(); }} onClick={requestHint} disabled={solShown}
                style={{ height: 36, padding: "0 14px", borderRadius: 10, background: hl > 0 ? "rgba(249,115,22,.12)" : "rgba(255,255,255,.04)", border: `1.5px solid ${hl > 0 ? "rgba(249,115,22,.35)" : "rgba(255,255,255,.08)"}`, color: solShown ? "#374151" : hl > 0 ? "#f97316" : "#6b7280", cursor: solShown ? "default" : "pointer", display: "flex", alignItems: "center", gap: 7, fontSize: 12, fontFamily: "monospace", fontWeight: 700, outline: "none" }}>
                <span style={{ fontSize: 15 }}>💡</span>
                <div style={{ display: "flex", gap: 3 }}>{[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: i < hl ? HCOL[i] : "rgba(255,255,255,.1)" }} />)}</div>
                <span onTouchEnd={e => { e.preventDefault(); e.stopPropagation(); setSheetH(s => s === null ? 200 : null); }} onClick={e => { e.stopPropagation(); setSheetH(s => s === null ? 200 : null); }} style={{ fontSize: 11, color: "#4b5563", marginLeft: 2, padding: "4px", cursor: "pointer" }}>{SHEET_OPEN ? "▾" : "▴"}</span>
              </button>
              <div style={{ flex: 1 }} />
              <button onTouchEnd={(e) => { e.preventDefault(); check(); }} onClick={check}
                style={{ height: 36, padding: "0 20px", borderRadius: 10, background: isCorrect ? "linear-gradient(135deg,#16a34a,#22c55e)" : "linear-gradient(135deg,#5b21b6,#7c3aed)", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", outline: "none", boxShadow: isCorrect ? "0 2px 12px rgba(34,197,94,.25)" : "0 2px 12px rgba(124,58,237,.22)", display: "flex", alignItems: "center", gap: 7 }}>
                {isCorrect ? "✓" : "▶"} CHECK
              </button>
            </div>
          )}

          {/* Hint-Sheet (aufklappbar) */}
          {SHEET_OPEN && (
            <div style={{ height: sheetH!, background: "#111118", borderTop: "1px solid #2a2a42", display: "flex", flexDirection: "column", overflow: "hidden", borderRadius: "12px 12px 0 0", boxShadow: "0 -6px 28px rgba(0,0,0,.5)" }}>
              <div onPointerDown={onSheetDragStart} onPointerMove={onSheetDragMove} onPointerUp={onSheetDragEnd} onPointerCancel={onSheetDragEnd}
                onTouchStart={onSheetDragStart} onTouchMove={onSheetDragMove} onTouchEnd={onSheetDragEnd}
                style={{ flexShrink: 0, height: 20, cursor: "ns-resize", display: "flex", alignItems: "center", justifyContent: "center", userSelect: "none", touchAction: "none" }}>
                <div style={{ width: 32, height: 4, borderRadius: 2, background: "#2a2a42" }} />
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: "0 12px 14px", display: "flex", flexDirection: "column", gap: 8, scrollbarWidth: "none" }}>
                {hl === 0 && !solShown
                  ? <div style={{ textAlign: "center", padding: "10px 0", fontSize: 12, color: "#4b5563" }}>Drücke 💡 für einen Hinweis</div>
                  : [ex.hints[0], ex.hints[1], ex.hints[2]].slice(0, hl).map((h, i) => (
                      <div key={i} style={{ padding: "9px 12px", borderRadius: 10, background: "#0d0d14", border: `1px solid ${HCOL[i]}22`, borderLeft: `3px solid ${HCOL[i]}` }}>
                        <div style={{ fontSize: 10, fontFamily: "monospace", color: HCOL[i], marginBottom: 4, letterSpacing: ".06em" }}>HINT {i + 1}</div>
                        <div style={{ fontFamily: "monospace", fontSize: 13, color: "#d1d5db", lineHeight: 1.6 }}>{h}</div>
                      </div>
                    ))
                }
                {solShown && (
                  <div style={{ padding: "9px 12px", borderRadius: 10, background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.25)", borderLeft: "3px solid #ef4444" }}>
                    <div style={{ fontSize: 10, fontFamily: "monospace", color: "#ef4444", marginBottom: 4, letterSpacing: ".06em" }}>LÖSUNG</div>
                    <div style={{ fontFamily: "monospace", fontSize: 13, color: "#4ade80", lineHeight: 1.6 }}>{ex.solution}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  // ══════════════════════════════════════════════════════════════════════
  // NORMAL VIEW
  // ══════════════════════════════════════════════════════════════════════
  return (
    <>
      <style>{STYLES}</style>
      <DebugOverlay />
      <div style={{ display: "flex", flexDirection: "column", height: "100dvh", maxWidth: 430, margin: "0 auto", background: "#060609", color: "#f1f0fb", fontFamily: "'Inter',system-ui,sans-serif", overflow: "hidden", paddingBottom: 44 }}>
        {/* Top-Bar */}
        <div style={{ height: 52, flexShrink: 0, background: "#0d0d14", borderBottom: "1px solid #1e1e2e", display: "flex", alignItems: "center", padding: "0 10px 0 14px", gap: 8 }}>
          <button style={smallBtn()}>←</button>
          <div style={{ flex: 1, textAlign: "center", lineHeight: 1.3 }}>
            <div style={{ fontSize: 9, fontFamily: "monospace", color: "#6b7280", textTransform: "uppercase", letterSpacing: ".1em" }}>ÜBUNG {exIdx + 1}/{EXERCISES.length}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: solved ? "#4ade80" : "#f1f0fb" }}>{ex.conceptId}{solved && " ✓"}</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button style={smallBtn(28)} onClick={() => setExIdx(p => Math.max(0, p - 1))}>‹</button>
            <button style={smallBtn(28)} onClick={() => setExIdx(p => Math.min(EXERCISES.length - 1, p + 1))}>›</button>
          </div>
        </div>

        {/* Aufgaben-Panel (aufklappbar) */}
        <div style={{ background: "#0d0d14", borderBottom: "1px solid #1e1e2e", flexShrink: 0 }}>
          <button onClick={() => setTaskOpen(p => !p)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 14px", background: "none", border: "none", cursor: "pointer", color: "#f1f0fb", outline: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}><span>📋</span><span style={{ fontSize: 10, fontFamily: "monospace", color: "#6b7280", textTransform: "uppercase", letterSpacing: ".08em" }}>Aufgabe</span></div>
            <span style={{ color: "#4b5563", fontSize: 12 }}>{taskOpen ? "▴" : "▾"}</span>
          </button>
          {taskOpen && (
            <div style={{ padding: "0 14px 12px", fontSize: 14, lineHeight: 1.6, color: "#d1d5db" }}>
              {ex.initialCode && <div style={{ fontFamily: "monospace", fontSize: 12, color: "#6b7280", background: "#111118", borderRadius: 6, padding: "5px 10px", marginBottom: 8, border: "1px solid #1e1e2e" }}>{ex.initialCode}</div>}
              {ex.task}
            </div>
          )}
        </div>

        {/* Chips-Leiste */}
        <div style={{ minHeight: 32, flexShrink: 0, background: "#0a0a10", borderTop: "1px solid #1e1e2e", display: "flex", alignItems: "center", flexWrap: "wrap", gap: 4, padding: "4px 12px" }}>
          {chips.length === 0
            ? <span style={{ fontSize: 10, fontFamily: "monospace", color: "#2a2a3e", letterSpacing: ".08em" }}>• Syntax-Elemente erscheinen hier…</span>
            : chips.map((c, i) => { const st = CHIP[c.s] || CHIP.unknown; return <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 2, padding: "2px 7px", borderRadius: 6, fontSize: 12, fontFamily: "monospace", fontWeight: 600, background: st.bg, border: `1px solid ${st.border}`, color: st.color }}>{c.tok}{st.mark && <span style={{ fontSize: 9, opacity: .8 }}>{st.mark}</span>}</span>; })
          }
        </div>

        {/* Editor-Vorschau (Read-Only, Klick → Fullscreen) */}
        <div style={{ flex: 1, minHeight: 0, position: "relative", background: "#0a0a10", cursor: "pointer" }} onClick={openFullscreenAndFocus}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 28, background: "#0d0d14", borderRight: "1px solid #1a1a28", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: PAD_T, fontSize: 11, fontFamily: "monospace", color: "#3a3a5a", userSelect: "none", pointerEvents: "none" }}>1</div>
          <textarea ref={taRef} value={code} onChange={e => setCode(e.target.value)} readOnly
            style={{ position: "absolute", inset: 0, left: 28, background: "transparent", border: "none", outline: "none", fontFamily: "'JetBrains Mono',monospace", fontSize: 16, lineHeight: `${LINE_H}px`, color: "#e2e8f0", padding: `${PAD_T}px 12px 10px`, resize: "none", pointerEvents: "none" }}
            placeholder="// Code hier…" />
        </div>

        {/* Hinweis zum Starten */}
        <div style={{ textAlign: "center", padding: "5px 0", flexShrink: 0, background: "#0a0a10", borderBottom: "1px solid #1e1e2e" }}>
          <span style={{ fontSize: 10, color: "#2a2a3e", fontFamily: "monospace" }}>Tippe auf den Editor zum Starten →</span>
        </div>
      </div>

      {/* Fixierter Bottom-Bar für Normal View */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, zIndex: 200 }}>
        <div style={{ height: 44, background: "#0d0d14", borderTop: "1px solid #1e1e2e", display: "flex", alignItems: "center", padding: "0 16px", flexShrink: 0 }}>
          <button onClick={requestHint} disabled={solShown}
            style={{ height: 36, padding: "0 14px", borderRadius: 10, background: hl > 0 ? "rgba(249,115,22,.12)" : "rgba(255,255,255,.04)", border: `1.5px solid ${hl > 0 ? "rgba(249,115,22,.35)" : "rgba(255,255,255,.08)"}`, color: solShown ? "#374151" : hl > 0 ? "#f97316" : "#6b7280", cursor: solShown ? "default" : "pointer", display: "flex", alignItems: "center", gap: 7, fontSize: 12, fontFamily: "monospace", fontWeight: 700, outline: "none" }}>
            <span style={{ fontSize: 15 }}>💡</span>
            <div style={{ display: "flex", gap: 3 }}>{[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: i < hl ? HCOL[i] : "rgba(255,255,255,.1)" }} />)}</div>
          </button>
          <div style={{ flex: 1 }} />
          <button onClick={check}
            style={{ height: 36, padding: "0 20px", borderRadius: 10, background: isCorrect ? "linear-gradient(135deg,#16a34a,#22c55e)" : "linear-gradient(135deg,#5b21b6,#7c3aed)", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", outline: "none", boxShadow: isCorrect ? "0 2px 12px rgba(34,197,94,.25)" : "0 2px 12px rgba(124,58,237,.22)", display: "flex", alignItems: "center", gap: 7 }}>
            {isCorrect ? "✓" : "▶"} CHECK
          </button>
        </div>
      </div>
    </>
  );
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  ::-webkit-scrollbar{display:none;}
  body{background:#060609;overscroll-behavior:none;-webkit-overflow-scrolling:touch;}
  textarea{-webkit-user-select:text!important;user-select:text!important;font-size:16px!important;-webkit-text-size-adjust:100%;}
  input,textarea,button{-webkit-appearance:none;-webkit-tap-highlight-color:transparent;}
  html{position:fixed;width:100%;height:100%;}
  body{position:fixed;width:100%;height:100%;overflow:hidden;}
`;