import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { TOPICS } from "../data/topics";
import { useLearningStore } from "../store/useLearningStore";
import type { Exercise } from "../types";

// ─── PROPS ────────────────────────────────────────────────────────────────────
interface ExerciseScreenProps {
  topicId:     string;
  conceptId:   string;
  exerciseId?: string;
  onBack?:     () => void;
}

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

function getCaseMistake(code: string, solution: string): string | null {
  const n = (s: string) => s.replace(/\s+/g, " ").trim();
  if (n(code).toLowerCase() === n(solution).toLowerCase() && n(code) !== n(solution)) {
    const ct = tokenize(code), st = tokenize(solution);
    for (let i = 0; i < ct.length; i++) {
      if (ct[i] !== st[i] && ct[i]?.toLowerCase() === st[i]?.toLowerCase()) {
        return `Groß-/Kleinschreibung: "${ct[i]}" → "${st[i]}"`;
      }
    }
    return "Groß-/Kleinschreibung prüfen";
  }
  return null;
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
  const [visible, setVisible] = useState(false);
  useEffect(() => { _logSetter = setLines; return () => { _logSetter = null; }; }, []);
  return (
    <div style={{ position: "fixed", top: 0, right: 0, zIndex: 9999, width: visible ? 260 : 36, maxHeight: "50vh", background: "rgba(0,0,0,.92)", border: "1px solid #333", borderRadius: "0 0 0 8px", overflow: "hidden", fontSize: 9, fontFamily: "monospace" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "3px 6px", background: "#111", borderBottom: "1px solid #333", cursor: "pointer" }} onClick={() => setVisible(v => !v)}>
        <span style={{ color: "#f97316", fontWeight: 700 }}>🐛 {visible ? "LOG" : ""}</span>
        {visible && <button onClick={(e) => { e.stopPropagation(); _logLines = []; setLines([]); }} style={{ background: "none", border: "none", color: "#6b7280", fontSize: 9, cursor: "pointer" }}>CLR</button>}
      </div>
      {visible && (
        <div style={{ overflowY: "auto", maxHeight: "calc(50vh - 24px)", padding: "4px 6px" }}>
          {lines.length === 0 ? <div style={{ color: "#333" }}>– warte –</div> : lines.map((l, i) => (
            <div key={i} style={{ color: l.includes("BLUR") ? "#f87171" : l.includes("FOCUS") ? "#4ade80" : l.includes("LOCKED") ? "#22c55e" : "#9ca3af", borderBottom: "1px solid #111", padding: "1px 0", wordBreak: "break-all" }}>{l}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function HighlightTask({ text }: { text: string }) {
  const parts = text.split(/(".*?"|read-only)/g);
  return <>{parts.map((part, i) =>
    part.startsWith('"') || part === "read-only"
      ? <span key={i} style={{ color: "#c4b5fd", fontWeight: 700 }}>{part}</span>
      : part
  )}</>;
}

// ─── Chip Bar mit horizontalem Scroll + Fade ──────────────────────────────────
function ChipBar({ chips, solToks, pct }: { chips: any[]; solToks: number; pct: number }) {
  return (
    <div style={{ position: "relative", height: 36, flexShrink: 0, background: "#0a0a10", borderTop: "1px solid #1e1e2e" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 16, background: "linear-gradient(to right, #0a0a10, transparent)", zIndex: 2, pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: solToks > 0 && chips.length > 0 ? 68 : 0, top: 0, bottom: 0, width: 20, background: "linear-gradient(to left, #0a0a10, transparent)", zIndex: 2, pointerEvents: "none" }} />
      <div style={{ display: "flex", alignItems: "center", height: "100%", gap: 5, padding: "0 16px", overflowX: "auto", scrollbarWidth: "none" } as any}>
        {chips.length === 0
          ? <span style={{ fontSize: 10, fontFamily: "monospace", color: "#2a2a3e", whiteSpace: "nowrap" }}>• Syntax-Elemente erscheinen hier…</span>
          : chips.map((c, i) => {
              const st = CHIP[c.s] || CHIP.unknown;
              return <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 2, padding: "2px 9px", borderRadius: 6, fontSize: 12, fontFamily: "monospace", fontWeight: 600, background: st.bg, border: `1px solid ${st.border}`, color: st.color, flexShrink: 0, whiteSpace: "nowrap" }}>{c.tok}{st.mark && <span style={{ fontSize: 9, opacity: .8 }}>{st.mark}</span>}</span>;
            })
        }
      </div>
      {solToks > 0 && chips.length > 0 && (
        <div style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center", gap: 4, zIndex: 3, background: "#0a0a10", paddingLeft: 4 }}>
          <div style={{ width: 32, height: 3, background: "#1e1e2e", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "#22c55e" : "#7c3aed", borderRadius: 2, transition: "width .25s" }} />
          </div>
          <span style={{ fontSize: 9, fontFamily: "monospace", fontWeight: 700, color: pct === 100 ? "#4ade80" : "#6b7280", minWidth: 26 }}>{pct}%</span>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export function ExerciseScreen({ topicId, conceptId, exerciseId, onBack }: ExerciseScreenProps) {
  const { customTasks } = useLearningStore();

  // Build exercise list dynamically from props
  const EXERCISES: Exercise[] = useMemo(() => {
    if (topicId === "custom") {
      if (!customTasks.length) return [];
      const idx = customTasks.findIndex(t => t.id === exerciseId);
      return idx <= 0 ? customTasks : [...customTasks.slice(idx), ...customTasks.slice(0, idx)];
    }
    const topic = TOPICS.find(t => t.id === topicId);
    if (!topic) return [];
    return topic.concepts.flatMap(c => c.exercises);
  }, [topicId, customTasks, exerciseId]);

  // Starting index: jump to exerciseId or first exercise of conceptId
  const startIdx = useMemo(() => {
    if (exerciseId) { const i = EXERCISES.findIndex(e => e.id === exerciseId); return i >= 0 ? i : 0; }
    if (conceptId)  { const i = EXERCISES.findIndex(e => e.conceptId === conceptId); return i >= 0 ? i : 0; }
    return 0;
  }, [EXERCISES, exerciseId, conceptId]);

  const [exIdx, setExIdx]           = useState(startIdx);
  const ex                          = EXERCISES[exIdx] ?? EXERCISES[0];

  // Header title: for custom tasks use conceptId, for topic use topic title
  const headerTitle = useMemo(() => {
    if (topicId === "custom") return ex?.conceptId ?? "Eigene Aufgabe";
    const topic = TOPICS.find(t => t.id === topicId);
    const concept = topic?.concepts.find(c => c.id === ex?.conceptId);
    return concept?.title ?? topic?.title ?? ex?.conceptId ?? "";
  }, [topicId, ex]);

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
  const [kbOpen, setKbOpen]         = useState(false);
  const [kbPadding, setKbPadding]   = useState(0);
  const [isScrollingTokens, setIsScrollingTokens] = useState(false);

  // ★ Task-Overlay im Fullscreen (schwebend, transparent)
  const [taskOverlay, setTaskOverlay] = useState(true);

  // ★ Flash-Animation Token
  const [flashIdx, setFlashIdx]     = useState<number | null>(null);
  // ★ Case-Hinweis
  const [caseHint, setCaseHint]     = useState<string | null>(null);

  const taRef      = useRef<HTMLTextAreaElement>(null);
  const sheetDragY = useRef<number | null>(null);
  const sheetDragH = useRef<number | null>(null);
  // Auto-fade Timer
  const overlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── KEYBOARD LOCK ────────────────────────────────────────────────────────────
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) { dbg("NO VISUAL VIEWPORT"); return; }
    let isOpen = false, lockedH = 0, baseHeight = window.innerHeight;
    const onVvResize = () => {
      const rawKbH = Math.max(0, baseHeight - vv.height);
      if (!isOpen) {
        if (rawKbH > 100) { isOpen = true; lockedH = rawKbH; setKbOpen(true); setKbPadding(lockedH); dbg(`KB LOCKED @ ${Math.round(lockedH)}px`); }
      } else {
        if (rawKbH < 50) { isOpen = false; lockedH = 0; setKbOpen(false); setKbPadding(0); dbg("KB UNLOCKED"); }
      }
    };
    const onWinResize = () => {
      const nb = window.innerHeight;
      if (Math.abs(nb - baseHeight) > 50) { baseHeight = nb; isOpen = false; lockedH = 0; setKbPadding(0); onVvResize(); }
    };
    vv.addEventListener("resize", onVvResize);
    window.addEventListener("resize", onWinResize);
    return () => { vv.removeEventListener("resize", onVvResize); window.removeEventListener("resize", onWinResize); };
  }, []);

  // ── reset ──
  useEffect(() => {
    setCode(ex.initialCode || "");
    setHintLevel(0); setSolShown(false);
    setFb(null); setChips([]); setSolved(false);
    setTaskOpen(true); setSheetH(null); setFullscreen(false);
    setCaseHint(null); setTaskOverlay(true);
  }, [ex]);

  useEffect(() => { setChips(code.trim() ? analyze(code, ex.solution) : []); }, [code, ex.solution]);
  useEffect(() => { if (solShown) setCode(ex.solution); }, [solShown, ex.solution]);

  // ★ Auto-fade: Overlay blendet aus wenn User tippt
  const handleCodeChange = useCallback((val: string) => {
    setCode(val);
    setCaseHint(null);
    // Beim Tippen: Overlay nach 1.5s ausblenden
    if (overlayTimerRef.current) clearTimeout(overlayTimerRef.current);
    overlayTimerRef.current = setTimeout(() => setTaskOverlay(false), 1500);
  }, []);

  const normalize  = (s: string) => s.replace(/\s+/g, " ").trim();
  const isCorrect  = normalize(code) === normalize(ex.solution);
  const solToks    = tokenize(ex.solution).length;
  const pct        = solToks > 0 ? Math.round(chips.filter(c => c.s === "correct").length / solToks * 100) : 0;
  const hl         = typeof hintLevel === "number" ? hintLevel : 3;
  const allUsed    = hl >= 3;

  const check = useCallback(() => {
    if (isCorrect) {
      setFb("correct"); setSolved(true); setCaseHint(null);
      setTimeout(() => setFb(null), 2000);
    } else {
      const cm = getCaseMistake(code, ex.solution);
      if (cm) { setCaseHint(cm); setFb("case"); setTimeout(() => setFb(null), 2500); }
      else { setCaseHint(null); setFb("incorrect"); setTimeout(() => setFb(null), 600); }
    }
  }, [isCorrect, code, ex.solution]);

  const requestHint = useCallback(() => {
    if (solShown) return;
    if (!allUsed) setHintLevel(h => typeof h === "number" ? h + 1 : 3);
    else { setSolShown(true); setSheetH(180); }
  }, [solShown, allUsed]);

  const insert = useCallback((raw: string, tokenIdx?: number) => {
    const text = raw.replace("( )", "()").replace("{ }", "{}").replace("[ ]", "[]");
    const ta = taRef.current;
    if (ta) {
      const s = ta.selectionStart, e = ta.selectionEnd;
      setCode(code.slice(0, s) + text + code.slice(e));
      requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = s + text.length; ta.focus({ preventScroll: true }); });
    } else setCode(p => p + text);
    if (tokenIdx !== undefined) { setFlashIdx(tokenIdx); setTimeout(() => setFlashIdx(null), 350); }
  }, [code]);

  const openFullscreenAndFocus = useCallback(() => {
    setFullscreen(true);
    setTaskOverlay(true); // Beim Öffnen immer kurz anzeigen
    requestAnimationFrame(() => { requestAnimationFrame(() => { taRef.current?.focus({ preventScroll: true }); }); });
  }, []);

  const onSheetDragStart = (e: any) => { sheetDragY.current = "touches" in e ? e.touches[0].clientY : e.clientY; sheetDragH.current = sheetH || 200; };
  const onSheetDragMove  = (e: any) => { if (sheetDragY.current === null) return; const y = "touches" in e ? e.touches[0].clientY : e.clientY; setSheetH(Math.max(60, Math.min(420, (sheetDragH.current || 200) + (sheetDragY.current - y)))); };
  const onSheetDragEnd   = (e: any) => { const y = "changedTouches" in e ? e.changedTouches[0].clientY : e.clientY; if ((sheetDragY.current || 0) - y < -60) setSheetH(null); sheetDragY.current = null; sheetDragH.current = null; };

  const codeLines = code ? code.split("\n").length : 0;
  const initLines = ex.initialCode ? ex.initialCode.split("\n").length : 0;
  const ghostTop  = PAD_T + Math.max(codeLines, initLines) * LINE_H + Math.round(LINE_H * 0.5);
  // Normalize hints object → array for display
  const hintsArr = ex ? [ex.hints.level1, ex.hints.level2, ex.hints.level3] : [];
  const currentHintText = hl === 1 ? hintsArr[0] : hl === 2 ? hintsArr[1] : hl === 3 ? hintsArr[2] : null;
  const showGhost = !!currentHintText && !solShown;
  const smartToks = getSmartTokens(code).slice(0, 8);
  const TOKEN_H   = 48; // immer 1 Zeile, fest
  const SHEET_OPEN = sheetH !== null;

  const editorColor = fb === "correct" ? "#4ade80"
                    : fb === "incorrect" ? "#f87171"
                    : fb === "case" ? "#fbbf24"
                    : "#e2e8f0";

  // ★ Overlay-Transparenz: je mehr Code, desto transparenter
  const overlayOpacity = !taskOverlay ? 0
                       : code.length === 0 ? 0.97
                       : code.length < 5 ? 0.82
                       : 0.55;

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
          paddingBottom: kbPadding + TOKEN_H + (SHEET_OPEN ? (sheetH || 0) : 0),
        }}>

          {/* Header */}
          <div style={{ height: 46, flexShrink: 0, background: "#0d0d14", borderBottom: "1px solid #1e1e2e", display: "flex", alignItems: "center", padding: "0 10px", gap: 6 }}>
            <button onClick={() => { setFullscreen(false); taRef.current?.blur(); }} style={smallBtn()}>←</button>

            {/* Progress + Titel */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <div style={{ width: "80%", height: 2, background: "#1e1e2e", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: `${((exIdx + 1) / EXERCISES.length) * 100}%`, height: "100%", background: "#7c3aed", transition: "width 0.3s" }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: solved ? "#4ade80" : "#f1f0fb" }}>{headerTitle}{solved && " ✓"}</span>
            </div>

            {/* 📋 Toggle Task-Overlay */}
            <button
              onClick={() => setTaskOverlay(v => !v)}
              style={{
                ...toggleBtn(taskOverlay),
                fontSize: 14,
              }}
              title="Aufgabe anzeigen"
            >📋</button>
            <button onClick={() => setShowChips(p => !p)} style={toggleBtn(showChips)}>≡</button>
            <button onClick={() => setShowTokens(p => !p)} style={toggleBtn(showTokens)}>⌨</button>
          </div>

          {/* Chips */}
          {showChips && !kbOpen && <ChipBar chips={chips} solToks={solToks} pct={pct} />}

          {/* Editor – relativ, damit Overlay drüber liegen kann */}
          <div style={{
            flex: 1, minHeight: 0, position: "relative", background: "#0a0a10",
            animation: fb === "incorrect" ? "shake 0.4s cubic-bezier(.36,.07,.19,.97) both" : "none",
          }}>
            {/* Zeilennummer */}
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 28, background: "#0d0d14", borderRight: "1px solid #1a1a28", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: PAD_T, fontSize: 11, fontFamily: "monospace", color: "#3a3a5a", userSelect: "none", pointerEvents: "none" }}>1</div>

            {/* Ghost Hint */}
            {showGhost && (
              <div style={{ position: "absolute", left: 28, right: 0, top: ghostTop, padding: "0 12px", pointerEvents: "none", fontFamily: "'JetBrains Mono',monospace", fontSize: 14, lineHeight: `${LINE_H}px`, color: "rgba(120,80,220,.25)", whiteSpace: "pre-wrap", zIndex: 5 }}>
                {currentHintText}
              </div>
            )}

            {/* Textarea */}
            <textarea
              ref={taRef}
              value={code}
              onChange={e => handleCodeChange(e.target.value)}
              onFocus={() => dbg("FOCUS ← textarea")}
              onBlur={(e) => dbg(`BLUR → ${(e.relatedTarget as HTMLElement)?.tagName ?? "null"}`)}
              autoFocus
              inputMode="text"
              enterKeyHint="done"
              style={{
                position: "absolute", inset: 0, left: 28,
                background: "transparent", border: "none", outline: "none",
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 16, lineHeight: `${LINE_H}px`,
                color: editorColor,
                padding: `${PAD_T}px 12px 10px`,
                resize: "none", caretColor: "#7c3aed",
                spellCheck: false, autoCorrect: "off", autoCapitalize: "off",
                WebkitUserSelect: "text", userSelect: "text",
                touchAction: "manipulation",
                transition: "color 0.2s",
                zIndex: 1,
              }}
              placeholder={showGhost ? "" : "// Code hier eingeben…"}
            />

            {/* ★ FLOATING TASK OVERLAY – schwebt über dem Editor */}
            <div style={{
              position: "absolute", left: 28, right: 0, top: 0,
              zIndex: 10,
              opacity: overlayOpacity,
              transition: "opacity 0.6s ease",
              pointerEvents: overlayOpacity < 0.1 ? "none" : "auto",
            }}>
              <div style={{
                margin: "8px 8px 0",
                background: "rgba(8,8,16,0.78)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderRadius: 10,
                border: "1px solid rgba(124,58,237,0.2)",
                padding: "10px 12px",
                boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
              }}>
                {ex.initialCode && (
                  <div style={{ fontFamily: "monospace", fontSize: 11, color: "#6b7280", background: "rgba(255,255,255,0.04)", borderRadius: 6, padding: "3px 8px", marginBottom: 6, border: "1px solid rgba(255,255,255,0.06)" }}>
                    {ex.initialCode}
                  </div>
                )}
                <div style={{ fontSize: 13, lineHeight: 1.5, color: "#d1d5db" }}>
                  <HighlightTask text={ex.task} />
                </div>
                {/* Tap-to-dismiss Hinweis */}
                <div style={{ marginTop: 6, fontSize: 9, color: "rgba(107,114,128,0.6)", fontFamily: "monospace", textAlign: "right" }}>
                  tippt automatisch weg ↗
                </div>
              </div>
            </div>

            {/* ★ Case-Hinweis Banner */}
            {fb === "case" && caseHint && (
              <div style={{ position: "absolute", top: 0, left: 28, right: 0, zIndex: 15, background: "rgba(251,191,36,.12)", backdropFilter: "blur(8px)", borderBottom: "1px solid rgba(251,191,36,.3)", padding: "6px 14px", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 14 }}>⚠️</span>
                <span style={{ fontSize: 11, fontFamily: "monospace", color: "#fbbf24" }}>{caseHint}</span>
              </div>
            )}

            {/* Feedback Overlay */}
            {fb && fb !== "case" && (
              <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center", background: fb === "correct" ? "rgba(34,197,94,.07)" : "rgba(248,113,113,.05)", fontSize: 48 }}>
                {fb === "correct" ? "✅" : "❌"}
              </div>
            )}
          </div>

          {/* Toolbar im Flex-Flow */}
          <div style={{ flexShrink: 0, display: "flex", flexDirection: "column" }}>

            {/* Chips wenn KB offen */}
            {showChips && kbOpen && <ChipBar chips={chips} solToks={solToks} pct={pct} />}

            {showTokens ? (
              // ★ Token-Leiste: IMMER 1 Zeile, kein wrap
              <div
                style={{
                  height: TOKEN_H,
                  background: "#0d0d14", borderTop: "1px solid #1e1e2e",
                  display: "flex", alignItems: "center",
                  flexWrap: "nowrap", // ★ KRITISCH: niemals umbrechen
                  padding: "0 8px", gap: 5,
                  overflowX: "auto", scrollbarWidth: "none", flexShrink: 0,
                }}
                onTouchStart={() => setIsScrollingTokens(false)}
                onTouchMove={() => setIsScrollingTokens(true)}
                onTouchEnd={() => setTimeout(() => setIsScrollingTokens(false), 50)}
              >
                {/* Hint Button */}
                <button onTouchEnd={(e) => { e.preventDefault(); requestHint(); }} onClick={requestHint} disabled={solShown}
                  style={{ height: 34, padding: "0 8px", borderRadius: 8, flexShrink: 0, background: hl > 0 ? "rgba(249,115,22,.15)" : "#16162a", border: `1px solid ${hl > 0 ? "rgba(249,115,22,.4)" : "#252540"}`, color: solShown ? "#374151" : hl > 0 ? "#f97316" : "#6b7280", cursor: solShown ? "default" : "pointer", display: "flex", alignItems: "center", gap: 5, outline: "none" }}>
                  <span style={{ fontSize: 14 }}>💡</span>
                  <div style={{ display: "flex", gap: 3 }}>{[0,1,2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: i < hl ? HCOL[i] : "#252540" }} />)}</div>
                  <span onTouchEnd={e => { e.preventDefault(); e.stopPropagation(); setSheetH(s => s === null ? 200 : null); }} onClick={e => { e.stopPropagation(); setSheetH(s => s === null ? 200 : null); }} style={{ fontSize: 10, color: "#4b5563", marginLeft: 2, padding: "4px", cursor: "pointer", lineHeight: 1 }}>{SHEET_OPEN ? "▾" : "▴"}</span>
                </button>

                <div style={{ width: 1, height: 22, background: "#1e1e2e", flexShrink: 0 }} />

                {/* Check Button */}
                <button onTouchEnd={(e) => { e.preventDefault(); check(); }} onClick={check}
                  style={{ width: 80, height: 34, borderRadius: 8, flexShrink: 0, background: isCorrect ? "rgba(34,197,94,.2)" : "#16162a", border: `1.5px solid ${isCorrect ? "#22c55e" : "#252540"}`, color: isCorrect ? "#4ade80" : "#6b7280", cursor: "pointer", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, outline: "none", transition: "all .2s" }}>
                  {isCorrect ? "✓ OK" : "▶ CHECK"}
                </button>

                <div style={{ width: 1, height: 22, background: "#1e1e2e", flexShrink: 0 }} />

                {/* Token Buttons mit Flash */}
                {smartToks.map((s, i) => {
                  const isFlashing = flashIdx === i;
                  return (
                    <button key={i}
                      onTouchEnd={(e) => { e.preventDefault(); if (isScrollingTokens) return; insert(s, i); }}
                      onClick={() => { if (isScrollingTokens) return; insert(s, i); }}
                      style={{
                        padding: "5px 10px", height: 34, flexShrink: 0,
                        background: isFlashing ? "rgba(124,58,237,.4)" : "#16162a",
                        border: `1px solid ${isFlashing ? "#7c3aed" : "#252540"}`,
                        borderRadius: 7, color: isFlashing ? "#e9d5ff" : "#c4b5fd",
                        fontFamily: "monospace", fontSize: 12, fontWeight: 600,
                        cursor: "pointer", whiteSpace: "nowrap", outline: "none",
                        transform: isFlashing ? "scale(1.08)" : "scale(1)",
                        transition: "background 0.2s, border 0.2s, transform 0.15s, color 0.2s",
                        boxShadow: isFlashing ? "0 0 10px rgba(124,58,237,.4)" : "none",
                      }}
                    >{s}</button>
                  );
                })}
              </div>
            ) : (
              <div style={{ height: 44, background: "#0d0d14", borderTop: "1px solid #1e1e2e", display: "flex", alignItems: "center", padding: "0 16px", flexShrink: 0 }}>
                <button onTouchEnd={(e) => { e.preventDefault(); requestHint(); }} onClick={requestHint} disabled={solShown}
                  style={{ height: 36, padding: "0 14px", borderRadius: 10, background: hl > 0 ? "rgba(249,115,22,.12)" : "rgba(255,255,255,.04)", border: `1.5px solid ${hl > 0 ? "rgba(249,115,22,.35)" : "rgba(255,255,255,.08)"}`, color: solShown ? "#374151" : hl > 0 ? "#f97316" : "#6b7280", cursor: solShown ? "default" : "pointer", display: "flex", alignItems: "center", gap: 7, fontSize: 12, fontFamily: "monospace", fontWeight: 700, outline: "none" }}>
                  <span style={{ fontSize: 15 }}>💡</span>
                  <div style={{ display: "flex", gap: 3 }}>{[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: i < hl ? HCOL[i] : "rgba(255,255,255,.1)" }} />)}</div>
                </button>
                <div style={{ flex: 1 }} />
                <button onTouchEnd={(e) => { e.preventDefault(); check(); }} onClick={check}
                  style={{ height: 36, padding: "0 20px", borderRadius: 10, background: isCorrect ? "linear-gradient(135deg,#16a34a,#22c55e)" : "linear-gradient(135deg,#5b21b6,#7c3aed)", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", outline: "none", boxShadow: isCorrect ? "0 2px 12px rgba(34,197,94,.25)" : "0 2px 12px rgba(124,58,237,.22)", display: "flex", alignItems: "center", gap: 7 }}>
                  {isCorrect ? "✓ OK" : "▶ CHECK CODE"}
                </button>
              </div>
            )}

            {/* Hint Sheet */}
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
                    : hintsArr.slice(0, hl).map((h, i) => (
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
        <div style={{ height: 52, flexShrink: 0, background: "#0d0d14", borderBottom: "1px solid #1e1e2e", display: "flex", alignItems: "center", padding: "0 10px 0 14px", gap: 8 }}>
          <button style={smallBtn()} onClick={onBack}>←</button>
          <div style={{ flex: 1, textAlign: "center", lineHeight: 1.3 }}>
            <div style={{ fontSize: 9, fontFamily: "monospace", color: "#6b7280", textTransform: "uppercase", letterSpacing: ".1em" }}>ÜBUNG {exIdx + 1}/{EXERCISES.length}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: solved ? "#4ade80" : "#f1f0fb" }}>{headerTitle}{solved && " ✓"}</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button style={smallBtn(28)} onClick={() => setExIdx(p => Math.max(0, p - 1))}>‹</button>
            <button style={smallBtn(28)} onClick={() => setExIdx(p => Math.min(EXERCISES.length - 1, p + 1))}>›</button>
          </div>
        </div>

        <div style={{ background: "#0d0d14", borderBottom: "1px solid #1e1e2e", flexShrink: 0 }}>
          <button onClick={() => setTaskOpen(p => !p)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 14px", background: "none", border: "none", cursor: "pointer", color: "#f1f0fb", outline: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}><span>📋</span><span style={{ fontSize: 10, fontFamily: "monospace", color: "#6b7280", textTransform: "uppercase", letterSpacing: ".08em" }}>Aufgabe</span></div>
            <span style={{ color: "#4b5563", fontSize: 12 }}>{taskOpen ? "▴" : "▾"}</span>
          </button>
          {taskOpen && (
            <div style={{ padding: "0 14px 12px", fontSize: 14, lineHeight: 1.6, color: "#d1d5db" }}>
              {ex.initialCode && <div style={{ fontFamily: "monospace", fontSize: 12, color: "#6b7280", background: "#111118", borderRadius: 6, padding: "5px 10px", marginBottom: 8, border: "1px solid #1e1e2e" }}>{ex.initialCode}</div>}
              <HighlightTask text={ex.task} />
            </div>
          )}
        </div>

        <ChipBar chips={chips} solToks={solToks} pct={pct} />

        <div style={{ flex: 1, minHeight: 0, position: "relative", background: "#0a0a10", cursor: "pointer" }} onClick={openFullscreenAndFocus}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 28, background: "#0d0d14", borderRight: "1px solid #1a1a28", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: PAD_T, fontSize: 11, fontFamily: "monospace", color: "#3a3a5a", userSelect: "none", pointerEvents: "none" }}>1</div>
          <textarea ref={taRef} value={code} onChange={e => setCode(e.target.value)} readOnly
            style={{ position: "absolute", inset: 0, left: 28, background: "transparent", border: "none", outline: "none", fontFamily: "'JetBrains Mono',monospace", fontSize: 16, lineHeight: `${LINE_H}px`, color: "#e2e8f0", padding: `${PAD_T}px 12px 10px`, resize: "none", pointerEvents: "none" }}
            placeholder="// Code hier eingeben…" />
        </div>

        <div style={{ textAlign: "center", padding: "5px 0", flexShrink: 0, background: "#0a0a10", borderBottom: "1px solid #1e1e2e" }}>
          <span style={{ fontSize: 10, color: "#2a2a3e", fontFamily: "monospace" }}>Tippe auf den Editor zum Starten →</span>
        </div>
      </div>

      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, zIndex: 200 }}>
        <div style={{ height: 44, background: "#0d0d14", borderTop: "1px solid #1e1e2e", display: "flex", alignItems: "center", padding: "0 16px" }}>
          <button onClick={requestHint} disabled={solShown}
            style={{ height: 36, padding: "0 14px", borderRadius: 10, background: hl > 0 ? "rgba(249,115,22,.12)" : "rgba(255,255,255,.04)", border: `1.5px solid ${hl > 0 ? "rgba(249,115,22,.35)" : "rgba(255,255,255,.08)"}`, color: solShown ? "#374151" : hl > 0 ? "#f97316" : "#6b7280", cursor: solShown ? "default" : "pointer", display: "flex", alignItems: "center", gap: 7, fontSize: 12, fontFamily: "monospace", fontWeight: 700, outline: "none" }}>
            <span style={{ fontSize: 15 }}>💡</span>
            <div style={{ display: "flex", gap: 3 }}>{[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: i < hl ? HCOL[i] : "rgba(255,255,255,.1)" }} />)}</div>
          </button>
          <div style={{ flex: 1 }} />
          <button onClick={check}
            style={{ height: 36, padding: "0 20px", borderRadius: 10, background: isCorrect ? "linear-gradient(135deg,#16a34a,#22c55e)" : "linear-gradient(135deg,#5b21b6,#7c3aed)", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", outline: "none", boxShadow: isCorrect ? "0 2px 12px rgba(34,197,94,.25)" : "0 2px 12px rgba(124,58,237,.22)", display: "flex", alignItems: "center", gap: 7 }}>
            {isCorrect ? "✓ OK" : "▶ CHECK CODE"}
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
  html, body {
    background:#060609;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
  }
  textarea {
    -webkit-user-select:text!important;
    user-select:text!important;
    font-size:16px!important;
    -webkit-text-size-adjust:100%;
    overscroll-behavior: contain;
  }
  input,textarea,button{-webkit-appearance:none;-webkit-tap-highlight-color:transparent;}
  html{width:100%;height:100%;overflow:hidden;position:relative;}
  body{width:100%;height:100%;overflow:hidden;margin:0;}

  @keyframes shake {
    10%, 90% { transform: translate3d(-1px, 0, 0); }
    20%, 80% { transform: translate3d(2px, 0, 0); }
    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
    40%, 60% { transform: translate3d(4px, 0, 0); }
  }
`;
