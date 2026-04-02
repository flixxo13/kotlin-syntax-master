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
  const out = []; let m;
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

const CHIP: any = {
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
  const kbOpen                      = kbH > 80;

  const taRef       = useRef<HTMLTextAreaElement>(null);
  const sheetDragY  = useRef<number | null>(null);
  const sheetDragH  = useRef<number | null>(null);

  // ── Keyboard / Visual Viewport Fix ──
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const upd = () => {
      const newH = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      // Nur bei signifikanter Änderung updaten um Re-render Loops zu vermeiden
      setKbH(prev => Math.abs(prev - newH) > 15 ? newH : prev);
    };
    vv.addEventListener("resize", upd);
    vv.addEventListener("scroll", upd);
    return () => { vv.removeEventListener("resize", upd); vv.removeEventListener("scroll", upd); };
  }, []);
  // ── Reset Logic ──
  useEffect(() => {
    setCode(ex.initialCode || "");
    setHintLevel(0); setSolShown(false);
    setFb(null); setChips([]); setSolved(false);
    setTaskOpen(true); setSheetH(null); setFullscreen(false);
  }, [ex]);

  // ── Live Feedback ──
  useEffect(() => {
    setChips(code.trim() ? analyze(code, ex.solution) : []);
  }, [code, ex.solution]);

  useEffect(() => {
    if (solShown) setCode(ex.solution);
  }, [solShown, ex.solution]);

  const normalize = (s: string) => s.replace(/\s+/g, " ").trim();
  const isCorrect = normalize(code) === normalize(ex.solution);
  const solToks   = tokenize(ex.solution).length;
  const pct       = solToks > 0 ? Math.round(chips.filter(c => c.s === "correct").length / solToks * 100) : 0;
  const hl        = typeof hintLevel === "number" ? hintLevel : 3;
  const allUsed   = hl >= 3;

  const check = useCallback(() => {
    setFb(isCorrect ? "correct" : "incorrect");
    if (isCorrect) { 
      setSolved(true); 
      setTimeout(() => setFb(null), 2000); 
    } else { 
      setTimeout(() => setFb(null), 800); 
    }
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
      // Timeout für den Fokus-Erhalt nach State-Update
      setTimeout(() => { 
        ta.selectionStart = ta.selectionEnd = s + text.length; 
        ta.focus(); 
      }, 10);
    } else { setCode(p => p + text); }
  }, [code]);

  const openFullscreenAndFocus = useCallback(() => {
    setFullscreen(true);
    setTimeout(() => {
      if (taRef.current) {
        taRef.current.focus();
        window.scrollTo(0,0);
      }
    }, 150);
  }, []);

  const onSheetDragStart = (e: any) => {
    sheetDragY.current = "touches" in e ? e.touches[0].clientY : e.clientY;
    sheetDragH.current = sheetH || 200;
  };
  const onSheetDragMove = (e: any) => {
    if (sheetDragY.current === null) return;
    const y   = "touches" in e ? e.touches[0].clientY : e.clientY;
    const dy  = (sheetDragY.current || 0) - y;
    const newH = Math.max(60, Math.min(420, (sheetDragH.current || 200) + dy));
    setSheetH(newH);
  };
  const onSheetDragEnd = (e: any) => {
    const y   = "changedTouches" in e ? e.changedTouches[0].clientY : e.clientY;
    const dy  = (sheetDragY.current || 0) - y;
    if (dy < -60) setSheetH(null);
    sheetDragY.current = null;
    sheetDragH.current = null;
  };

  const codeLines = code ? code.split("\n").length : 0;
  const initLines = ex.initialCode ? ex.initialCode.split("\n").length : 0;
  const ghostTop  = PAD_T + Math.max(codeLines, initLines) * LINE_H + Math.round(LINE_H * 0.5);
  const currentHintText = hl === 1 ? ex.hints[0] : hl === 2 ? ex.hints[1] : hl === 3 ? ex.hints[2] : null;
  const showGhost = !!currentHintText && !solShown;
  const smartToks = getSmartTokens(code);
  const SHEET_OPEN = sheetH !== null;

  // ── Sub-Komponenten ──

  const ChipsRow = () => (
    <div style={{
      minHeight: 32, flexShrink: 0, background: "#0a0a10", borderTop: "1px solid #1e1e2e",
      display: "flex", alignItems: "center", flexWrap: "wrap", gap: 4, padding: "4px 12px",
    }}>
      {chips.length === 0 ? (
        <span style={{ fontSize: 10, fontFamily: "monospace", color: "#2a2a3e", letterSpacing: ".08em" }}>• Syntax-Elemente erscheinen hier…</span>
      ) : (
        <>
          {chips.map((c, i) => {
            const st = CHIP[c.s] || CHIP.unknown;
            return (
              <span key={i} style={{
                display: "inline-flex", alignItems: "center", gap: 2, padding: "2px 7px", borderRadius: 6,
                fontSize: 12, fontFamily: "monospace", fontWeight: 600, background: st.bg, border: `1px solid ${st.border}`, color: st.color,
              }}>
                {c.tok}{st.mark && <span style={{ fontSize: 9, opacity: .8 }}>{st.mark}</span>}
              </span>
            );
          })}
          {solToks > 0 && (
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
              <div style={{ width: 40, height: 3, background: "#1e1e2e", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "#22c55e" : "#7c3aed", borderRadius: 2, transition: "width .25s" }} />
              </div>
              <span style={{ fontSize: 9, fontFamily: "monospace", fontWeight: 700, color: pct === 100 ? "#4ade80" : "#6b7280", minWidth: 24 }}>{pct}%</span>
            </div>
          )}
        </>
      )}
    </div>
  );
  const TokenBar = () => (
    <div style={{
      height: 48, background: "#0d0d14", borderTop: "1px solid #1e1e2e",
      display: "flex", alignItems: "center", padding: "0 8px", gap: 5, overflowX: "auto", scrollbarWidth: "none", flexShrink: 0,
    }}>
      <button onClick={requestHint} disabled={solShown} style={hintBtnStyle(hl, solShown)}>
        <span style={{ fontSize: 14 }}>💡</span>
        <div style={{ display: "flex", gap: 3 }}>
          {[0, 1, 2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: i < hl ? HCOL[i] : "#252540" }} />)}
        </div>
        <span onClick={e => { e.stopPropagation(); setSheetH(s => s === null ? 200 : null); }} style={{ fontSize: 10, color: "#4b5563", marginLeft: 2, padding: "4px", cursor: "pointer" }}>{SHEET_OPEN ? "▾" : "▴"}</span>
      </button>
      <div style={{ width: 1, height: 22, background: "#1e1e2e", flexShrink: 0 }} />
      <button onClick={check} style={checkBtnStyle(isCorrect)}>{isCorrect ? "✓" : "▶"}</button>
      <div style={{ width: 1, height: 22, background: "#1e1e2e", flexShrink: 0 }} />
      {smartToks.map((s, i) => <button key={i} onClick={() => insert(s)} style={tokenBtnStyle}>{s}</button>)}
    </div>
  );

  const FallbackBar = () => (
    <div style={{ height: 44, background: "#0d0d14", borderTop: "1px solid #1e1e2e", display: "flex", alignItems: "center", padding: "0 16px", flexShrink: 0 }}>
      <button onClick={requestHint} style={hintBtnStyle(hl, solShown, true)}>
        <span style={{ fontSize: 15 }}>💡</span>
        <div style={{ display: "flex", gap: 3 }}>
          {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: i < hl ? HCOL[i] : "rgba(255,255,255,.1)" }} />)}
        </div>
      </button>
      <div style={{ flex: 1 }} />
      <button onClick={check} style={largeCheckBtnStyle(isCorrect)}>{isCorrect ? "✓" : "▶"} CHECK</button>
    </div>
  );

  const HintSheet = () => SHEET_OPEN ? (
    <div style={{
      height: sheetH || 200, background: "#111118", borderTop: "1px solid #2a2a42", display: "flex", flexDirection: "column",
      overflow: "hidden", borderRadius: "12px 12px 0 0", boxShadow: "0 -6px 28px rgba(0,0,0,.5)", transition: "height .18s ease-out",
    }}>
      <div onPointerDown={onSheetDragStart} onPointerMove={onSheetDragMove} onPointerUp={onSheetDragEnd} onPointerCancel={onSheetDragEnd} style={dragHandleStyle}>
        <div style={{ width: 32, height: 4, borderRadius: 2, background: "#2a2a42" }} />
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
        {[ex.hints[0], ex.hints[1], ex.hints[2]].slice(0, hl).map((h, i) => (
          <div key={i} style={{ padding: "9px 12px", borderRadius: 10, background: "#0d0d14", border: `1px solid ${HCOL[i]}22`, borderLeft: `3px solid ${HCOL[i]}` }}>
            <div style={{ fontSize: 10, fontFamily: "monospace", color: HCOL[i], marginBottom: 4 }}>HINT {i + 1}</div>
            <div style={{ fontFamily: "monospace", fontSize: 13, color: "#d1d5db", lineHeight: 1.6 }}>{h}</div>
          </div>
        ))}
        {solShown && (
          <div style={{ padding: "9px 12px", borderRadius: 10, background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.25)", borderLeft: "3px solid #ef4444" }}>
            <div style={{ fontSize: 10, fontFamily: "monospace", color: "#ef4444", marginBottom: 4 }}>LÖSUNG</div>
            <div style={{ fontFamily: "monospace", fontSize: 13, color: "#4ade80", lineHeight: 1.6 }}>{ex.solution}</div>
          </div>
        )}
      </div>
    </div>
  ) : null;

  // ── RENDER ──

  if (fullscreen) {
    return (
      <>
        <style>{STYLES}</style>
        <div style={{ display: "flex", flexDirection: "column", height: "100dvh", maxWidth: 430, margin: "0 auto", background: "#060609", color: "#f1f0fb", overflow: "hidden" }}>
          <div style={headerStyle}>
            <button onClick={() => { setFullscreen(false); taRef.current?.blur(); }} style={smallBtn()}>←</button>
            <div style={{ flex: 1, textAlign: "center" }}><div style={{ fontSize: 13, fontWeight: 700 }}>{ex.conceptId}</div></div>
            <button onClick={() => setShowChips(p => !p)} style={toggleBtn(showChips)}>≡</button>
            <button onClick={() => setShowTokens(p => !p)} style={toggleBtn(showTokens)}>⌨</button>
          </div>
          {showChips && !kbOpen && <ChipsRow />}
          <div style={{ flex: 1, position: "relative", background: "#0a0a10" }}>
            <div style={lineNrStyle}>1</div>
            {showGhost && <div style={{ ...ghostStyle, top: ghostTop }}>{currentHintText}</div>}
            <textarea
              ref={taRef} value={code} onChange={e => setCode(e.target.value)}
              inputMode="text"
              style={{ ...textareaStyle, color: fb === "correct" ? "#4ade80" : fb === "incorrect" ? "#f87171" : "#e2e8f0" }}
              placeholder={showGhost ? "" : "// Code hier…"}
            />
            {fb && <div style={fbOverlayStyle(fb)}>{fb === "correct" ? "✅" : "❌"}</div>}
          </div>
          {/* Die Tastatur-Leiste bleibt fixed über der KB */}
          <div style={{ position: "fixed", bottom: kbH, left: 0, right: 0, zIndex: 100, display: "flex", flexDirection: "column" }}>
             {showTokens ? <TokenBar /> : <FallbackBar />}
             <HintSheet />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{STYLES}</style>
      <div style={{ display: "flex", flexDirection: "column", height: "100dvh", maxWidth: 430, margin: "0 auto", background: "#060609", color: "#f1f0fb", overflow: "hidden", paddingBottom: 44 }}>
        <div style={{ ...headerStyle, height: 52 }}>
          <button style={smallBtn()}>←</button>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 9, color: "#6b7280" }}>ÜBUNG {exIdx + 1}/{EXERCISES.length}</div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{ex.conceptId}</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button style={smallBtn(28)} onClick={() => setExIdx(p => Math.max(0, p - 1))}>‹</button>
            <button style={smallBtn(28)} onClick={() => setExIdx(p => Math.min(EXERCISES.length - 1, p + 1))}>›</button>
          </div>
        </div>
        <div style={{ padding: "12px 14px", background: "#0d0d14", borderBottom: "1px solid #1e1e2e" }}>
           <div style={{ fontSize: 14, color: "#d1d5db", lineHeight: 1.5 }}>{ex.task}</div>
        </div>
        <ChipsRow />
        <div style={{ flex: 1, position: "relative", background: "#0a0a10", cursor: "pointer" }} onClick={openFullscreenAndFocus}>
           <div style={lineNrStyle}>1</div>
           <textarea readOnly value={code} style={textareaStyle} placeholder="// Tippe zum Starten..." />
        </div>
        <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, zIndex: 100 }}>
           <FallbackBar />
           <HintSheet />
        </div>
      </div>
    </>
  );
}

// ─── STYLES & HELPERS ──────────────────────────────────────────────────────────

const smallBtn = (size = 34) => ({
  width: size, height: size, borderRadius: 8, background: "transparent", border: "none",
  color: "#9ca3af", cursor: "pointer", fontSize: size > 30 ? 18 : 15,
  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, outline: "none",
});

const toggleBtn = (active: boolean) => ({
  width: 32, height: 32, borderRadius: 8,
  background: active ? "rgba(124,58,237,.3)" : "rgba(255,255,255,.05)",
  border: active ? "1px solid rgba(124,58,237,.5)" : "1px solid rgba(255,255,255,.07)",
  color: active ? "#c4b5fd" : "#6b7280", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", outline: "none",
});

const hintBtnStyle = (hl: number, solShown: boolean, isLarge = false) => ({
  height: isLarge ? 36 : 34, padding: isLarge ? "0 14px" : "0 8px", borderRadius: 8, flexShrink: 0,
  background: hl > 0 ? "rgba(249,115,22,.15)" : "#16162a",
  border: `1px solid ${hl > 0 ? "rgba(249,115,22,.4)" : "#252540"}`,
  color: solShown ? "#374151" : hl > 0 ? "#f97316" : "#6b7280",
  display: "flex", alignItems: "center", gap: 5, outline: "none", cursor: "pointer",
});

const checkBtnStyle = (isCorrect: boolean) => ({
  width: 34, height: 34, borderRadius: 8, flexShrink: 0, background: isCorrect ? "rgba(34,197,94,.2)" : "#16162a", border: `1.5px solid ${isCorrect ? "#22c55e" : "#252540"}`, color: isCorrect ? "#4ade80" : "#6b7280", cursor: "pointer", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", outline: "none",
});

const largeCheckBtnStyle = (isCorrect: boolean) => ({
  height: 36, padding: "0 20px", borderRadius: 10, background: isCorrect ? "linear-gradient(135deg,#16a34a,#22c55e)" : "linear-gradient(135deg,#5b21b6,#7c3aed)", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", outline: "none",
});

const tokenBtnStyle = {
  padding: "5px 10px", height: 34, flexShrink: 0, background: "#16162a", border: "1px solid #252540", borderRadius: 7, color: "#c4b5fd", fontFamily: "monospace", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", outline: "none",
};

const headerStyle: any = { height: 46, flexShrink: 0, background: "#0d0d14", borderBottom: "1px solid #1e1e2e", display: "flex", alignItems: "center", padding: "0 10px", gap: 6 };
const lineNrStyle: any = { position: "absolute", left: 0, top: 0, bottom: 0, width: 28, background: "#0d0d14", borderRight: "1px solid #1a1a28", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 10, fontSize: 11, fontFamily: "monospace", color: "#3a3a5a", userSelect: "none", pointerEvents: "none" };
const textareaStyle: any = { position: "absolute", inset: 0, left: 28, background: "transparent", border: "none", outline: "none", fontFamily: "'JetBrains Mono',monospace", fontSize: "16px", lineHeight: "24px", padding: "10px 12px", resize: "none", caretColor: "#7c3aed" };
const ghostStyle: any = { position: "absolute", left: 28, right: 0, padding: "0 12px", pointerEvents: "none", fontFamily: "'JetBrains Mono',monospace", fontSize: "16px", lineHeight: "24px", color: "rgba(120,80,220,.25)", whiteSpace: "pre-wrap", zIndex: 5 };
const dragHandleStyle: any = { flexShrink: 0, height: 20, cursor: "ns-resize", display: "flex", alignItems: "center", justifyContent: "center", userSelect: "none", touchAction: "none" };
const fbOverlayStyle = (fb: string): any => ({ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center", background: fb === "correct" ? "rgba(34,197,94,.07)" : "rgba(248,113,113,.07)", fontSize: 48 });

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=JetBrains+Mono&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  ::-webkit-scrollbar{display:none;}
  body{background:#060609;overscroll-behavior:none;position:fixed;width:100%;height:100%;overflow:hidden;}
  textarea{font-size:16px!important;-webkit-text-size-adjust:100%;}
`;

