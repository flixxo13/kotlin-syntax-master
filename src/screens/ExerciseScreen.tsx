import React from "react";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { TOPICS } from "../data/topics";
import { useLearningStore } from "../store/useLearningStore";
import type { Exercise, ExerciseDifficulty } from "../types";
import { DifficultyModal } from "../components/exercise/DifficultyModal";

interface ExerciseScreenProps {
  topicId:            string;
  conceptId:          string;
  exerciseId?:        string;
  onBack?:            () => void;
  onStartCustomTask?: (id: string) => void;
}

// ─── TOKENIZER ────────────────────────────────────────────────────────────────
const KW = new Set(["val","var","fun","if","else","when","for","while","return",
  "class","in","is","as","null","true","false","Int","String","Boolean","Double","Long",
  "listOf","mutableListOf","println","print","downTo","until","try","catch","throw",
  "finally","Exception","override","data","sealed","companion","object","interface"]);
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
      if (ct[i] !== st[i] && ct[i]?.toLowerCase() === st[i]?.toLowerCase())
        return `Groß-/Kleinschreibung: "${ct[i]}" → "${st[i]}"`;
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
const ONBOARDING_KEY = "km_onboarding_done";

const smallBtn = (size = 34) => ({
  width: size, height: size, borderRadius: 8, background: "transparent", border: "none",
  color: "#9ca3af", cursor: "pointer", fontSize: size > 30 ? 18 : 15,
  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, outline: "none",
});
const toggleBtn = (active: boolean) => ({
  width: 32, height: 32, borderRadius: 8,
  background: active ? "rgba(124,58,237,.3)" : "rgba(255,255,255,.05)",
  border: active ? "1px solid rgba(124,58,237,.5)" : "1px solid rgba(255,255,255,.07)",
  color: active ? "#c4b5fd" : "#6b7280", cursor: "pointer", fontSize: 13,
  display: "flex", alignItems: "center", justifyContent: "center", outline: "none", transition: "all .15s",
});

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
const ONBOARDING_STEPS = [
  { emoji:"✍️",      title:"Editor",                    body:"Tippe hier deinen Kotlin-Code. Der Editor ist dein Lernbereich." },
  { emoji:"▶ CHECK", title:"Code prüfen",                body:"Drücke CHECK wenn du fertig bist. Grün = richtig, Rot + Shake = noch nicht ganz." },
  { emoji:"💡",      title:"Hints – kontrolliert",       body:"3 gestufte Hinweise stehen bereit. Beim ersten Drücken erscheint eine Bestätigung – so passiert es nicht aus Versehen. Jeder Hint kostet XP." },
  { emoji:"◼◻◻",    title:"Syntax-Feedback",             body:"Die Chip-Leiste zeigt Token-für-Token ob dein Code stimmt. Du kannst sie vor dem Start deaktivieren – dann wird's schwerer!" },
  { emoji:"🔲",      title:"Vollbild-Modus",              body:"Tippe auf den Editor-Bereich um in den Vollbild-Modus zu wechseln. Dort stehen dir Shortcut-Buttons zur Verfügung." },
  { emoji:"🔁",      title:"Für später",                 body:"Du entscheidest selbst wann du eine Aufgabe erneut übst. Dein Fortschritt und XP bleiben gespeichert." },
];

function OnboardingModal({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const s = ONBOARDING_STEPS[step];
  const isLast = step === ONBOARDING_STEPS.length - 1;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:1000, background:"rgba(0,0,0,.75)", backdropFilter:"blur(6px)", display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div style={{ width:"100%", maxWidth:430, background:"#111118", borderRadius:"20px 20px 0 0", border:"1px solid #2a2a42", borderBottom:"none", padding:"24px 24px 40px", boxShadow:"0 -8px 40px rgba(0,0,0,.6)" }}>
        <div style={{ display:"flex", gap:5, justifyContent:"center", marginBottom:22 }}>
          {ONBOARDING_STEPS.map((_,i) => <div key={i} style={{ width:i===step?20:6, height:6, borderRadius:3, background:i===step?"#7c3aed":i<step?"#4b3f6b":"#252540", transition:"all .25s" }} />)}
        </div>
        <div style={{ fontFamily:"monospace", fontSize:22, fontWeight:700, color:"#7c3aed", marginBottom:10 }}>{s.emoji}</div>
        <div style={{ fontSize:18, fontWeight:700, color:"#f1f0fb", marginBottom:10 }}>{s.title}</div>
        <div style={{ fontSize:14, lineHeight:1.65, color:"#9ca3af", marginBottom:28 }}>{s.body}</div>
        <div style={{ display:"flex", gap:10 }}>
          {step > 0 && <button onClick={() => setStep(s => s-1)} style={{ flex:1, height:48, borderRadius:12, background:"#1e1e2e", border:"1px solid #2a2a42", color:"#6b7280", fontSize:14, fontWeight:700, cursor:"pointer", outline:"none" }}>← Zurück</button>}
          <button onClick={() => { if(isLast){ localStorage.setItem(ONBOARDING_KEY,"1"); onDone(); } else setStep(s => s+1); }}
            style={{ flex:2, height:48, borderRadius:12, background:isLast?"linear-gradient(135deg,#5b21b6,#7c3aed)":"#1e1e2e", border:isLast?"none":"1px solid #2a2a42", color:isLast?"#fff":"#c4b5fd", fontSize:14, fontWeight:700, cursor:"pointer", outline:"none", boxShadow:isLast?"0 2px 16px rgba(124,58,237,.3)":"none" }}>
            {isLast ? "Los geht's 🚀" : "Weiter →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CHIP MODE SHEET ──────────────────────────────────────────────────────────
function ChipModeSheet({ onChoice }: { onChoice: (enabled: boolean) => void }) {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:900, background:"rgba(0,0,0,.6)", backdropFilter:"blur(4px)", display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div style={{ width:"100%", maxWidth:430, background:"#111118", borderRadius:"20px 20px 0 0", border:"1px solid #2a2a42", borderBottom:"none", padding:"20px 20px 36px", boxShadow:"0 -8px 32px rgba(0,0,0,.5)" }}>
        <div style={{ width:36, height:4, borderRadius:2, background:"#2a2a42", margin:"0 auto 18px" }} />
        <div style={{ fontSize:15, fontWeight:700, color:"#f1f0fb", marginBottom:6 }}>Syntax-Feedback aktivieren?</div>
        <div style={{ fontSize:13, color:"#6b7280", lineHeight:1.6, marginBottom:20 }}>Die Chip-Leiste gibt Token-für-Token-Rückmeldung. Deaktiviere sie für eine größere Herausforderung.</div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={() => onChoice(false)} style={{ flex:1, height:48, borderRadius:12, background:"#1e1e2e", border:"1px solid #2a2a42", color:"#6b7280", fontSize:13, fontWeight:700, cursor:"pointer", outline:"none" }}>◻ Ohne Feedback</button>
          <button onClick={() => onChoice(true)}  style={{ flex:1, height:48, borderRadius:12, background:"rgba(124,58,237,.2)", border:"1px solid rgba(124,58,237,.4)", color:"#c4b5fd", fontSize:13, fontWeight:700, cursor:"pointer", outline:"none" }}>◼ Mit Feedback</button>
        </div>
      </div>
    </div>
  );
}

// ─── CHIP BAR ─────────────────────────────────────────────────────────────────
function ChipBar({ chips, solToks, pct, visible }: { chips: any[]; solToks: number; pct: number; visible: boolean }) {
  if (!visible) return null;
  // Show ">75%" when high but not done – avoids spoiling exact count
  const pctLabel = pct === 100 ? "100%" : pct >= 75 ? ">75%" : `${pct}%`;
  const pctColor = pct === 100 ? "#4ade80" : pct >= 75 ? "#a78bfa" : "#6b7280";
  const barColor = pct === 100 ? "#22c55e" : "#7c3aed";
  const hasProgress = solToks > 0 && chips.length > 0;
  return (
    <div style={{ position:"relative", flexShrink:0, background:"#0a0a10", borderBottom:"1px solid #1e1e2e" }}>
      {/* Chips row – scroll to end so last chip always visible */}
      <div
        ref={(el) => { if (el) el.scrollLeft = el.scrollWidth; }}
        style={{ display:"flex", alignItems:"center", height:34, gap:5, padding:"0 8px", paddingRight:hasProgress?72:8, overflowX:"auto", scrollbarWidth:"none", WebkitOverflowScrolling:"touch" } as any}
      >
        {/* Fade left edge */}
        <div style={{ position:"sticky", left:0, width:12, height:"100%", background:"linear-gradient(to right,#0a0a10,transparent)", flexShrink:0, pointerEvents:"none", marginRight:-12, zIndex:2 }} />
        {chips.length === 0
          ? <span style={{ fontSize:10, fontFamily:"monospace", color:"#2a2a3e", whiteSpace:"nowrap", paddingLeft:8 }}>• Syntax-Elemente erscheinen hier…</span>
          : chips.map((c,i) => { const st=CHIP[c.s]||CHIP.unknown; return <span key={i} style={{ display:"inline-flex", alignItems:"center", gap:2, padding:"2px 8px", borderRadius:6, fontSize:12, fontFamily:"monospace", fontWeight:600, background:st.bg, border:`1px solid ${st.border}`, color:st.color, flexShrink:0, whiteSpace:"nowrap" }}>{c.tok}{st.mark&&<span style={{ fontSize:9, opacity:.8 }}>{st.mark}</span>}</span>; })
        }
      </div>
      {/* Progress: always right, overlaid */}
      {hasProgress && (
        <div style={{ position:"absolute", right:6, top:"50%", transform:"translateY(-50%)", display:"flex", alignItems:"center", gap:4, zIndex:3, background:"#0a0a10", paddingLeft:6, height:34 }}>
          <div style={{ width:28, height:3, background:"#1e1e2e", borderRadius:2, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${pct}%`, background:barColor, borderRadius:2, transition:"width .3s" }} />
          </div>
          <span style={{ fontSize:9, fontFamily:"monospace", fontWeight:700, color:pctColor, minWidth:28 }}>{pctLabel}</span>
        </div>
      )}
    </div>
  );
}

function HighlightTask({ text }: { text: string }) {
  const parts = text.split(/(".*?"|'.*?'|read-only)/g);
  return <>{parts.map((part,i) => part.startsWith('"')||part.startsWith("'")||part==="read-only" ? <span key={i} style={{ color:"#c4b5fd", fontWeight:700 }}>{part}</span> : part)}</>;
}

// ═══════════════════════════════════════════════════════════════════════════════
export function ExerciseScreen({ topicId, conceptId, exerciseId, onBack, onStartCustomTask }: ExerciseScreenProps) {
  const { customTasks, rateDifficulty, completeExercise, getRandomCustomTask } = useLearningStore();

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

  const startIdx = useMemo(() => {
    if (exerciseId) { const i = EXERCISES.findIndex(e => e.id === exerciseId); return i >= 0 ? i : 0; }
    if (conceptId)  { const i = EXERCISES.findIndex(e => e.conceptId === conceptId); return i >= 0 ? i : 0; }
    return 0;
  }, [EXERCISES, exerciseId, conceptId]);

  const [exIdx, setExIdx] = useState(startIdx);
  const ex = EXERCISES[exIdx] ?? EXERCISES[0];

  const headerTitle = useMemo(() => {
    if (topicId === "custom") return ex?.conceptId ?? "Eigene Aufgabe";
    const topic = TOPICS.find(t => t.id === topicId);
    const concept = topic?.concepts.find(c => c.id === ex?.conceptId);
    return concept?.title ?? topic?.title ?? ex?.conceptId ?? "";
  }, [topicId, ex]);

  // ── Core state ───────────────────────────────────────────────────────────────
  const [code, setCode]             = useState(ex?.initialCode || "");
  const [hintLevel, setHintLevel]   = useState(0);
  const [solShown, setSolShown]     = useState(false);
  const [fb, setFb]                 = useState<string | null>(null);
  const [chips, setChips]           = useState<any[]>([]);
  const [solved, setSolved]         = useState(false);
  const [postSolve, setPostSolve]       = useState(false);   // after difficulty rated/skipped
  const [showPostSolveSheet, setShowPostSolveSheet] = useState(false); // nav sheet after solve
  const [showHintSheet, setShowHintSheet]           = useState(false); // hint confirm sheet
  const [showDifficulty, setShowDifficulty] = useState(false);
  const [taskOpen, setTaskOpen]     = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [showTokens, setShowTokens] = useState(true);
  const [showChips, setShowChips]   = useState(false);   // OFF by default
  const [sheetH, setSheetH]         = useState<number | null>(null);
  const [kbOpen, setKbOpen]         = useState(false);
  const [isScrollingTokens, setIsScrollingTokens] = useState(false);
  const [taskOverlay, setTaskOverlay] = useState(false);
  const [hintToast, setHintToast]   = useState<string | null>(null);
  const [hintConfirmPending, setHintConfirmPending] = useState(false);
  const [flashIdx, setFlashIdx]     = useState<number | null>(null);
  const [caseHint, setCaseHint]     = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showChipSheet, setShowChipSheet]   = useState(false);
  const [vpH, setVpH] = useState(() => window.visualViewport?.height ?? window.innerHeight);

  // Ghost hint drag
  const [ghostHintPos, setGhostHintPos]     = useState({ x: 0, y: 0 });
  const [isDraggingGhost, setIsDraggingGhost] = useState(false);
  const ghostDragRef = useRef<{ startX: number; startY: number; ox: number; oy: number } | null>(null);

  // Overlay drag
  const [overlayPos, setOverlayPos]             = useState({ x: 0, y: 0 });
  const [isDraggingOverlay, setIsDraggingOverlay] = useState(false);
  const overlayDragRef = useRef<{ startX: number; startY: number; ox: number; oy: number } | null>(null);

  const taRef           = useRef<HTMLTextAreaElement>(null);
  const sheetDragY      = useRef<number | null>(null);
  const sheetDragH      = useRef<number | null>(null);
  const hintToastTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hintConfirmTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Onboarding ───────────────────────────────────────────────────────────────
  useEffect(() => { if (!localStorage.getItem(ONBOARDING_KEY)) setShowOnboarding(true); }, []);

  // ── Viewport height ───────────────────────────────────────────────────────────
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    let base = window.innerHeight;
    let kbIsOpen = false;
    const onResize = () => {
      const h = vv.height;
      setVpH(h);
      const kbH = Math.max(0, base - h);
      if (!kbIsOpen && kbH > 100) {
        kbIsOpen = true; setKbOpen(true);
        setSheetH(null); // close sheet when keyboard opens
      }
      if (kbIsOpen && kbH < 50) { kbIsOpen = false; setKbOpen(false); }
    };
    const onWinResize = () => {
      const nb = window.innerHeight;
      if (Math.abs(nb - base) > 50) { base = nb; kbIsOpen = false; setKbOpen(false); onResize(); }
    };
    setVpH(vv.height);
    vv.addEventListener("resize", onResize);
    window.addEventListener("resize", onWinResize);
    return () => { vv.removeEventListener("resize", onResize); window.removeEventListener("resize", onWinResize); };
  }, []);

  // ── Reset on exercise change ──────────────────────────────────────────────────
  useEffect(() => {
    setCode(ex?.initialCode || "");
    setHintLevel(0); setSolShown(false); setFb(null); setChips([]); setSolved(false);
    setPostSolve(false); setShowPostSolveSheet(false); setShowHintSheet(false);
    setTaskOpen(true); setSheetH(null); setFullscreen(false);
    setCaseHint(null); setTaskOverlay(false); setOverlayPos({ x:0, y:0 });
    setGhostHintPos({ x:0, y:0 }); setHintConfirmPending(false);
  }, [ex?.id]);

  useEffect(() => { setChips(code.trim() ? analyze(code, ex?.solution ?? "") : []); }, [code, ex?.solution]);
  useEffect(() => { if (solShown && ex) setCode(ex.solution); }, [solShown, ex?.solution]);

  // handleCodeChange: NO auto-fade of overlay
  const handleCodeChange = useCallback((val: string) => {
    setCode(val);
    setCaseHint(null);
  }, []);

  // ── Computed ──────────────────────────────────────────────────────────────────
  const normalize  = (s: string) => s.replace(/\s+/g, " ").trim();
  const isCorrect  = ex ? normalize(code) === normalize(ex.solution) : false;
  const solToks    = ex ? tokenize(ex.solution).length : 0;
  const pct        = solToks > 0 ? Math.round(chips.filter(c => c.s === "correct").length / solToks * 100) : 0;
  const hl         = typeof hintLevel === "number" ? hintLevel : 3;
  const allUsed    = hl >= 3;
  const hintsArr   = ex ? [ex.hints.level1, ex.hints.level2, ex.hints.level3] : [];
  const currentHintText = hl >= 1 ? hintsArr[hl - 1] : null;
  const showGhost  = !!currentHintText && !solShown;
  const smartToks  = getSmartTokens(code).slice(0, 8);
  const TOKEN_H    = 48;
  const SHEET_OPEN = sheetH !== null;
  const hasStarted = code.length > 0;
  const editorColor = fb === "correct" ? "#4ade80" : fb === "incorrect" ? "#f87171" : fb === "case" ? "#fbbf24" : "#e2e8f0";
  const overlayOpacity = !taskOverlay ? 0 : 0.92;
  const codeLines  = code ? code.split("\n").length : 0;
  const initLines  = ex?.initialCode ? ex.initialCode.split("\n").length : 0;
  const ghostTop   = PAD_T + Math.max(codeLines, initLines) * LINE_H + Math.round(LINE_H * 0.5);

  // ── Handlers ──────────────────────────────────────────────────────────────────
  const handleDifficultyRate = useCallback((level: ExerciseDifficulty) => {
    rateDifficulty(ex.id, level);
    setShowDifficulty(false);
    setPostSolve(true);
    setShowPostSolveSheet(true);
  }, [ex?.id, rateDifficulty]);

  const handleDifficultySkip = useCallback(() => {
    setShowDifficulty(false);
    setPostSolve(true);
    setShowPostSolveSheet(true);
  }, []);

  const handleNext = useCallback(() => {
    if (exIdx < EXERCISES.length - 1) {
      setExIdx(p => p + 1);
    } else {
      // Last exercise
      setSheetH(null);
      setTimeout(() => onBack?.(), 100);
    }
  }, [exIdx, EXERCISES.length, onBack]);

  const handleRandom = useCallback(() => {
    const task = getRandomCustomTask();
    if (!task) return;
    if (topicId === "custom") {
      const idx = EXERCISES.findIndex(e => e.id === task.id);
      if (idx >= 0) setExIdx(idx);
    } else {
      onStartCustomTask?.(task.id);
    }
  }, [getRandomCustomTask, topicId, EXERCISES, onStartCustomTask]);

  const check = useCallback(() => {
    if (isCorrect) {
      setFb("correct"); setSolved(true); setCaseHint(null);
      completeExercise(ex.id, ex.conceptId, hl as any);
      if (topicId === "custom") {
        setTimeout(() => setShowDifficulty(true), 700);
      } else {
        setTimeout(() => { setPostSolve(true); setShowPostSolveSheet(true); }, 800);
      }
      setTimeout(() => setFb(null), 2000);
    } else {
      const cm = getCaseMistake(code, ex?.solution ?? "");
      if (cm) { setCaseHint(cm); setFb("case"); setTimeout(() => setFb(null), 2500); }
      else    { setCaseHint(null); setFb("incorrect"); setTimeout(() => setFb(null), 600); }
    }
  }, [isCorrect, code, ex, hl, topicId, completeExercise]);

  // Tap 1: open mini sheet to confirm. Tap confirm: reveal hint.
  const requestHint = useCallback(() => {
    if (solShown) return;
    setShowHintSheet(true);
  }, [solShown]);

  const confirmHint = useCallback(() => {
    setShowHintSheet(false);
    let nextLevel: number;
    if (!allUsed) {
      nextLevel = (typeof hintLevel === "number" ? hintLevel : 3) + 1;
      setHintLevel(nextLevel);
    } else {
      setSolShown(true);
      nextLevel = 99;
    }
    if (hintToastTimer.current) clearTimeout(hintToastTimer.current);
    setHintToast(nextLevel === 99 ? "Lösung eingeblendet" : `Hint ${nextLevel} aktiv 💡`);
    hintToastTimer.current = setTimeout(() => setHintToast(null), 1800);
  }, [solShown, allUsed, hintLevel]);

  const insert = useCallback((raw: string, tokenIdx?: number) => {
    const text = raw.replace("( )","()").replace("{ }","{}").replace("[ ]","[]");
    const ta = taRef.current;
    if (ta) {
      const s = ta.selectionStart, e = ta.selectionEnd;
      setCode(code.slice(0,s) + text + code.slice(e));
      requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = s + text.length; ta.focus({ preventScroll: true }); });
    } else setCode(p => p + text);
    if (tokenIdx !== undefined) { setFlashIdx(tokenIdx); setTimeout(() => setFlashIdx(null), 350); }
  }, [code]);

  const openFullscreenAndFocus = useCallback(() => { setShowChipSheet(true); }, []);

  const enterFullscreen = useCallback((withChips: boolean) => {
    setShowChipSheet(false);
    setShowChips(withChips);
    setFullscreen(true);
    setTaskOverlay(false);
    requestAnimationFrame(() => requestAnimationFrame(() => taRef.current?.focus({ preventScroll: true })));
  }, []);

  const exitFullscreen = useCallback(() => {
    setFullscreen(false);
    setTaskOpen(true);  // always open task card on return
    taRef.current?.blur();
  }, []);

  // Sheet drag
  const onSheetDragStart = (e: any) => { sheetDragY.current = "touches" in e ? e.touches[0].clientY : e.clientY; sheetDragH.current = sheetH || 200; };
  const onSheetDragMove  = (e: any) => { if (sheetDragY.current === null) return; const y = "touches" in e ? e.touches[0].clientY : e.clientY; setSheetH(Math.max(80, Math.min(480, (sheetDragH.current||200)+(sheetDragY.current-y)))); };
  const onSheetDragEnd   = (e: any) => { const y = "changedTouches" in e ? e.changedTouches[0].clientY : e.clientY; if ((sheetDragY.current||0)-y < -60) setSheetH(null); sheetDragY.current=null; sheetDragH.current=null; };

  // Overlay drag (from anywhere)
  const onOverlayPointerDown = useCallback((e: PointerEvent) => {
    e.stopPropagation();
    overlayDragRef.current = { startX: e.clientX, startY: e.clientY, ox: overlayPos.x, oy: overlayPos.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setIsDraggingOverlay(true);
  }, [overlayPos]);
  const onOverlayPointerMove = useCallback((e: PointerEvent) => {
    if (!overlayDragRef.current) return;
    setOverlayPos({ x: overlayDragRef.current.ox + e.clientX - overlayDragRef.current.startX, y: overlayDragRef.current.oy + e.clientY - overlayDragRef.current.startY });
  }, []);
  const onOverlayPointerUp = useCallback(() => { overlayDragRef.current = null; setIsDraggingOverlay(false); }, []);

  // Ghost hint drag handle
  const onGhostDragStart = useCallback((e: PointerEvent) => {
    e.stopPropagation();
    ghostDragRef.current = { startX: e.clientX, startY: e.clientY, ox: ghostHintPos.x, oy: ghostHintPos.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setIsDraggingGhost(true);
  }, [ghostHintPos]);
  const onGhostDragMove = useCallback((e: PointerEvent) => {
    if (!ghostDragRef.current) return;
    setGhostHintPos({ x: ghostDragRef.current.ox + e.clientX - ghostDragRef.current.startX, y: ghostDragRef.current.oy + e.clientY - ghostDragRef.current.startY });
  }, []);
  const onGhostDragUp = useCallback(() => { ghostDragRef.current = null; setIsDraggingGhost(false); }, []);

  if (!ex) return <div style={{ color:"#6b7280", padding:24, fontFamily:"monospace" }}>Keine Übungen gefunden.</div>;

  // ── Shared sheet content ──────────────────────────────────────────────────────
  const SheetContent = () => (
    <div style={{ flex:1, overflowY:"auto", padding:"0 12px 14px", display:"flex", flexDirection:"column", gap:8, scrollbarWidth:"none" }}>
      {postSolve ? (
        <>
          <div style={{ textAlign:"center", padding:"8px 0 4px", fontSize:13, fontWeight:700, color:"#4ade80" }}>✅ Aufgabe gelöst!</div>
          {hintsArr.slice(0, hl).map((h,i) => (
            <div key={i} style={{ padding:"8px 10px", borderRadius:10, background:"#0d0d14", border:`1px solid ${HCOL[i]}22`, borderLeft:`3px solid ${HCOL[i]}` }}>
              <div style={{ fontSize:10, fontFamily:"monospace", color:HCOL[i], marginBottom:3, letterSpacing:".06em" }}>HINT {i+1}</div>
              <div style={{ fontFamily:"monospace", fontSize:13, color:"#d1d5db", lineHeight:1.6 }}>{h}</div>
            </div>
          ))}
          <div style={{ display:"flex", gap:8, marginTop:4 }}>
            <button onClick={handleNext}
              style={{ flex:2, height:46, borderRadius:12, background:exIdx < EXERCISES.length-1 ? "linear-gradient(135deg,#5b21b6,#7c3aed)" : "linear-gradient(135deg,#16a34a,#22c55e)", border:"none", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", outline:"none", boxShadow:"0 2px 12px rgba(124,58,237,.25)" }}>
              {exIdx < EXERCISES.length-1 ? "Weiter →" : "🏆 Alle gelöst!"}
            </button>
            {customTasks.length > 0 && (
              <button onClick={handleRandom}
                style={{ flex:1, height:46, borderRadius:12, background:"rgba(124,58,237,.15)", border:"1px solid rgba(124,58,237,.35)", color:"#c4b5fd", fontSize:13, fontWeight:700, cursor:"pointer", outline:"none" }}>
                🎲
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          {hl === 0 && !solShown
            ? <div style={{ textAlign:"center", padding:"10px 0", fontSize:12, color:"#4b5563" }}>Drücke 💡 für einen Hinweis</div>
            : hintsArr.slice(0, hl).map((h,i) => (
                <div key={i} style={{ padding:"9px 12px", borderRadius:10, background:"#0d0d14", border:`1px solid ${HCOL[i]}22`, borderLeft:`3px solid ${HCOL[i]}` }}>
                  <div style={{ fontSize:10, fontFamily:"monospace", color:HCOL[i], marginBottom:4, letterSpacing:".06em" }}>HINT {i+1}</div>
                  <div style={{ fontFamily:"monospace", fontSize:13, color:"#d1d5db", lineHeight:1.6 }}>{h}</div>
                </div>
              ))
          }
          {solShown && (
            <div style={{ padding:"9px 12px", borderRadius:10, background:"rgba(239,68,68,.08)", border:"1px solid rgba(239,68,68,.25)", borderLeft:"3px solid #ef4444" }}>
              <div style={{ fontSize:10, fontFamily:"monospace", color:"#ef4444", marginBottom:4, letterSpacing:".06em" }}>LÖSUNG</div>
              <div style={{ fontFamily:"monospace", fontSize:13, color:"#4ade80", lineHeight:1.6 }}>{ex.solution}</div>
            </div>
          )}
        </>
      )}
    </div>
  );

  // ── Hint button with confirmation ─────────────────────────────────────────────
  const canOpenSheet = hl > 0 || solShown || postSolve;

  // ── Floating Action Stack ──────────────────────────────────────────────────
  // bottom adjusts: toolbar(48) + optional extra padding
  const fasBottom = showTokens ? TOKEN_H + 14 : 14;

  const FloatingActionStack = () => (
    <div style={{
      position: "absolute",
      bottom: SHEET_OPEN ? (sheetH ?? 0) + 14 : fasBottom,
      right: 12,
      zIndex: 60,
      display: "flex",
      flexDirection: "column-reverse",
      alignItems: "center",
      gap: 10,
      transition: "bottom 0.25s cubic-bezier(.4,0,.2,1)",
      pointerEvents: "none", // children handle events
    }}>
      {/* CHECK — primary, 56px circle */}
      <button
        onTouchEnd={e => { e.preventDefault(); check(); }}
        onClick={check}
        style={{
          width: 56, height: 56, borderRadius: "50%", flexShrink: 0,
          background: isCorrect
            ? "linear-gradient(135deg,#16a34a,#22c55e)"
            : "linear-gradient(135deg,#5b21b6,#7f52ff)",
          border: "none",
          boxShadow: isCorrect
            ? "0 4px 20px rgba(34,197,94,.45), 0 0 0 3px rgba(34,197,94,.15)"
            : "0 4px 20px rgba(124,58,237,.5), 0 0 0 3px rgba(124,58,237,.15)",
          color: "#fff",
          fontSize: 22,
          cursor: "pointer",
          outline: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all .2s",
          pointerEvents: "auto",
        }}
        aria-label={isCorrect ? "Richtig!" : "Code prüfen"}
      >
        {isCorrect ? "✓" : "▶"}
      </button>

      {/* HINT — glassmorphism, 44px circle */}
      <button
        onTouchEnd={e => { e.preventDefault(); requestHint(); }}
        onClick={requestHint}
        disabled={solShown}
        style={{
          width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
          background: hl > 0
            ? "rgba(249,115,22,.22)"
            : "rgba(15,10,30,0.7)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: `1.5px solid ${hl > 0 ? "rgba(249,115,22,.55)" : "rgba(255,255,255,.1)"}`,
          boxShadow: hl > 0
            ? "0 3px 14px rgba(249,115,22,.3)"
            : "0 3px 14px rgba(0,0,0,.4)",
          color: solShown ? "#2a2a2a" : hl > 0 ? "#f97316" : "#9ca3af",
          fontSize: 18,
          cursor: solShown ? "not-allowed" : "pointer",
          outline: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative",
          transition: "all .2s",
          pointerEvents: "auto",
        }}
        aria-label="Hint anzeigen"
      >
        💡
        {/* Hint level dots */}
        {hl > 0 && (
          <div style={{ position:"absolute", top:-2, right:-2, background:"#f97316", borderRadius:"50%", width:16, height:16, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, color:"#fff", border:"2px solid #060609" }}>
            {hl}
          </div>
        )}
      </button>

      {/* SHEET TOGGLE — small pill, only when hints unlocked */}
      {canOpenSheet && (
        <button
          onTouchEnd={e => { e.preventDefault(); setSheetH(s => s===null ? 220 : null); }}
          onClick={() => setSheetH(s => s===null ? 220 : null)}
          style={{
            height: 28, padding: "0 10px", borderRadius: 14, flexShrink: 0,
            background: SHEET_OPEN ? "rgba(124,58,237,.3)" : "rgba(15,10,30,0.7)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: `1px solid ${SHEET_OPEN ? "rgba(124,58,237,.6)" : "rgba(255,255,255,.1)"}`,
            color: SHEET_OPEN ? "#c4b5fd" : "#6b7280",
            fontSize: 11, fontWeight: 600,
            cursor: "pointer", outline: "none",
            display: "flex", alignItems: "center", gap: 4,
            transition: "all .2s",
            pointerEvents: "auto",
          }}
          aria-label={SHEET_OPEN ? "Sheet schließen" : "Hinweise öffnen"}
        >
          {SHEET_OPEN ? "▾ Schließen" : "▴ Hinweise"}
        </button>
      )}
    </div>
  );

  // ── Hint Confirm Mini-Sheet (portal-style, fixed) ──────────────────────────
  const HintConfirmSheet = () => (
    showHintSheet ? (
      <>
        {/* Backdrop */}
        <div
          onClick={() => setShowHintSheet(false)}
          style={{ position:"fixed", inset:0, zIndex:900, background:"rgba(0,0,0,.4)", backdropFilter:"blur(2px)" }}
        />
        {/* Sheet */}
        <div style={{
          position:"fixed", bottom: showTokens ? TOKEN_H + 8 : 8,
          left:"50%", transform:"translateX(-50%)",
          width:"min(340px, calc(100vw - 32px))",
          zIndex:901,
          background:"#111118",
          borderRadius:20,
          border:"1px solid rgba(249,115,22,.3)",
          padding:"16px 16px 14px",
          boxShadow:"0 -4px 32px rgba(0,0,0,.7), 0 0 0 1px rgba(249,115,22,.08)",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
            <div style={{ width:36, height:36, borderRadius:"50%", background:"rgba(249,115,22,.15)", border:"1px solid rgba(249,115,22,.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>💡</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#f1f0fb" }}>
                {allUsed ? "Lösung anzeigen?" : `Hint ${hl+1} freischalten?`}
              </div>
              <div style={{ fontSize:11, color:"#6b7280", marginTop:2 }}>
                {allUsed ? "XP: 0 – du siehst die komplette Lösung" : `Kostet ${hl===0?3:hl===1?6:8} XP · Noch ${3-hl} Hint${3-hl!==1?"s":""} verfügbar`}
              </div>
            </div>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button
              onTouchEnd={e => { e.preventDefault(); setShowHintSheet(false); }}
              onClick={() => setShowHintSheet(false)}
              style={{ flex:1, height:42, borderRadius:12, background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.08)", color:"#9ca3af", fontSize:14, fontWeight:600, cursor:"pointer", outline:"none" }}
            >
              Abbrechen
            </button>
            <button
              onTouchEnd={e => { e.preventDefault(); confirmHint(); }}
              onClick={confirmHint}
              style={{ flex:1.6, height:42, borderRadius:12, background:"linear-gradient(135deg,rgba(249,115,22,.25),rgba(251,146,60,.2))", border:"1px solid rgba(249,115,22,.5)", color:"#fb923c", fontSize:14, fontWeight:700, cursor:"pointer", outline:"none", boxShadow:"0 2px 12px rgba(249,115,22,.2)" }}
            >
              ✓ Ja, zeigen
            </button>
          </div>
        </div>
      </>
    ) : null
  );

  // ── Post-Solve Sheet (fixed bottom, after difficulty) ──────────────────────
  const PostSolveSheet = () => (
    showPostSolveSheet ? (
      <>
        <div
          onClick={() => setShowPostSolveSheet(false)}
          style={{ position:"fixed", inset:0, zIndex:900, background:"rgba(0,0,0,.45)", backdropFilter:"blur(3px)" }}
        />
        <div style={{
          position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
          width:"100%", maxWidth:430,
          zIndex:901,
          background:"#0f0f1a",
          borderRadius:"20px 20px 0 0",
          border:"1px solid rgba(124,58,237,.25)",
          borderBottom:"none",
          padding:"20px 20px 40px",
          boxShadow:"0 -8px 40px rgba(0,0,0,.7)",
        }}>
          {/* Handle */}
          <div style={{ width:36, height:4, borderRadius:2, background:"rgba(124,58,237,.3)", margin:"0 auto 18px" }} />

          {/* Success badge */}
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
            <div style={{ fontSize:32 }}>🎉</div>
            <div>
              <div style={{ fontSize:16, fontWeight:700, color:"#4ade80" }}>Aufgabe gelöst!</div>
              <div style={{ fontSize:12, color:"#6b7280", marginTop:2 }}>
                {exIdx < EXERCISES.length-1 ? "Bereit für die nächste Herausforderung?" : "Du hast alle Aufgaben abgeschlossen!"}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display:"flex", gap:10 }}>
            {exIdx < EXERCISES.length-1 ? (
              <button
                onTouchEnd={e => { e.preventDefault(); setShowPostSolveSheet(false); handleNext(); }}
                onClick={() => { setShowPostSolveSheet(false); handleNext(); }}
                style={{ flex:2, height:50, borderRadius:14, background:"linear-gradient(135deg,#5b21b6,#7f52ff)", border:"none", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", outline:"none", boxShadow:"0 3px 16px rgba(124,58,237,.4)", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}
              >
                Weiter → <span style={{ fontSize:11, opacity:.7 }}>Übung {exIdx+2}</span>
              </button>
            ) : (
              <button
                onTouchEnd={e => { e.preventDefault(); setShowPostSolveSheet(false); onBack?.(); }}
                onClick={() => { setShowPostSolveSheet(false); onBack?.(); }}
                style={{ flex:2, height:50, borderRadius:14, background:"linear-gradient(135deg,#16a34a,#22c55e)", border:"none", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", outline:"none", boxShadow:"0 3px 16px rgba(34,197,94,.35)" }}
              >
                🏆 Alle gelöst!
              </button>
            )}
            {customTasks.length > 0 && (
              <button
                onTouchEnd={e => { e.preventDefault(); setShowPostSolveSheet(false); handleRandom(); }}
                onClick={() => { setShowPostSolveSheet(false); handleRandom(); }}
                style={{ flex:1, height:50, borderRadius:14, background:"rgba(124,58,237,.15)", border:"1px solid rgba(124,58,237,.35)", color:"#c4b5fd", fontSize:20, cursor:"pointer", outline:"none" }}
                title="Zufällige Aufgabe"
              >
                🎲
              </button>
            )}
          </div>

          {/* Stay on exercise */}
          <button
            onTouchEnd={e => { e.preventDefault(); setShowPostSolveSheet(false); }}
            onClick={() => setShowPostSolveSheet(false)}
            style={{ width:"100%", marginTop:12, padding:"8px 0", background:"none", border:"none", color:"#374151", fontSize:12, cursor:"pointer", fontFamily:"Inter,sans-serif" }}
          >
            Bei dieser Aufgabe bleiben
          </button>
        </div>
      </>
    ) : null
  );

  // ═════════════════════════════════════════════════════════════════════════════
  // FULLSCREEN
  // ═════════════════════════════════════════════════════════════════════════════
  if (fullscreen) {
    return (
      <>
        <style>{STYLES}</style>
        <DifficultyModal isOpen={showDifficulty} onRate={handleDifficultyRate} onSkip={handleDifficultySkip} />
        {showOnboarding && <OnboardingModal onDone={() => setShowOnboarding(false)} />}
        <HintConfirmSheet />
        <PostSolveSheet />

        {hintToast && (
          <div style={{ position:"fixed", top:56, left:"50%", transform:"translateX(-50%)", zIndex:500, background:"rgba(249,115,22,.15)", border:"1px solid rgba(249,115,22,.4)", borderRadius:10, padding:"7px 16px", fontSize:12, fontFamily:"monospace", fontWeight:700, color:"#f97316", whiteSpace:"nowrap", backdropFilter:"blur(8px)", pointerEvents:"none" }}>
            {hintToast}
          </div>
        )}

        <div style={{ display:"flex", flexDirection:"column", height:vpH, maxWidth:430, margin:"0 auto", background:"#060609", color:"#f1f0fb", fontFamily:"'Inter',system-ui,sans-serif", overflow:"hidden" }}>

          {/* Header */}
          <div style={{ height:46, flexShrink:0, background:"#0d0d14", borderBottom:"1px solid #1e1e2e", display:"flex", alignItems:"center", padding:"0 10px", gap:6 }}>
            <button onClick={exitFullscreen} style={smallBtn()}>←</button>
            <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
              <div style={{ width:"80%", height:2, background:"#1e1e2e", borderRadius:2, overflow:"hidden" }}>
                <div style={{ width:`${((exIdx+1)/EXERCISES.length)*100}%`, height:"100%", background:"#7c3aed", transition:"width 0.3s" }} />
              </div>
              <span style={{ fontSize:11, fontWeight:600, color:solved?"#4ade80":"#f1f0fb" }}>{headerTitle}{solved&&" ✓"}</span>
            </div>
            <button onClick={() => setTaskOverlay(v => !v)} style={{ ...toggleBtn(taskOverlay), fontSize:14 }} title="Aufgabe anzeigen">📋</button>
            <button onClick={() => setShowChips(p => !p)} style={toggleBtn(showChips)}>≡</button>
            <button onClick={() => setShowTokens(p => !p)} style={toggleBtn(showTokens)}>⌨</button>
          </div>

          {/* Chip bar – ALWAYS at top, right below header */}
          <ChipBar chips={chips} solToks={solToks} pct={pct} visible={showChips} />

          {/* Editor */}
          <div style={{ flex:1, minHeight:0, position:"relative", background:"#0a0a10", animation:fb==="incorrect"?"shake 0.4s cubic-bezier(.36,.07,.19,.97) both":"none" }}>
            <div style={{ position:"absolute", left:0, top:0, bottom:0, width:28, background:"#0d0d14", borderRight:"1px solid #1a1a28", display:"flex", alignItems:"flex-start", justifyContent:"center", paddingTop:PAD_T, fontSize:11, fontFamily:"monospace", color:"#3a3a5a", userSelect:"none", pointerEvents:"none" }}>1</div>

            {/* Ghost Hint with drag handle */}
            {showGhost && (
              <div style={{ position:"absolute", left:28, right:0, top:ghostTop + ghostHintPos.y, transform:`translateX(${ghostHintPos.x}px)`, zIndex:5, display:"flex", alignItems:"flex-start", pointerEvents:"none" }}>
                {/* Drag handle */}
                <div
                  onPointerDown={onGhostDragStart} onPointerMove={onGhostDragMove}
                  onPointerUp={onGhostDragUp} onPointerCancel={onGhostDragUp}
                  style={{ width:16, flexShrink:0, paddingTop:2, display:"flex", alignItems:"flex-start", justifyContent:"center", cursor:isDraggingGhost?"grabbing":"grab", touchAction:"none", pointerEvents:"auto", opacity:0.45 }}>
                  <span style={{ fontSize:10, color:"rgba(124,58,237,.8)" }}>⠿</span>
                </div>
                {/* Full hint text – not line-height-clamped */}
                <div style={{ flex:1, paddingRight:12, fontFamily:"'JetBrains Mono',monospace", fontSize:13, lineHeight:1.6, color:isDraggingGhost?"rgba(120,80,220,.5)":"rgba(124,58,237,.28)", whiteSpace:"pre-wrap", wordBreak:"break-word" }}>
                  {currentHintText}
                </div>
              </div>
            )}

            {/* Textarea */}
            <textarea ref={taRef} value={code} onChange={e => handleCodeChange(e.target.value)}
              onFocus={() => setSheetH(null)} // close sheet when keyboard opens via tap
              autoFocus inputMode="text" enterKeyHint="done"
              style={{ position:"absolute", inset:0, left:28, background:"transparent", border:"none", outline:"none", fontFamily:"'JetBrains Mono',monospace", fontSize:16, lineHeight:`${LINE_H}px`, color:editorColor, padding:`${PAD_T}px 12px 10px`, resize:"none", caretColor:"#7c3aed", spellCheck:false, autoCorrect:"off", autoCapitalize:"off", WebkitUserSelect:"text", userSelect:"text", touchAction:"manipulation", transition:"color 0.2s", zIndex:1 }}
              placeholder={showGhost ? "" : "// Code hier eingeben…"}
            />

            {/* Task Overlay – draggable from anywhere, no auto-fade */}
            <div style={{ position:"absolute", left:28, right:0, top:0, zIndex:10, opacity:overlayOpacity, transition:isDraggingOverlay?"none":"opacity 0.3s ease", pointerEvents:overlayOpacity < 0.05?"none":"auto", transform:`translate(${overlayPos.x}px,${overlayPos.y}px)`, willChange:"transform" }}>
              <div
                onPointerDown={onOverlayPointerDown} onPointerMove={onOverlayPointerMove}
                onPointerUp={onOverlayPointerUp} onPointerCancel={onOverlayPointerUp}
                style={{ margin:"8px 8px 0", background:"rgba(8,8,16,0.88)", backdropFilter:"blur(14px)", WebkitBackdropFilter:"blur(14px)", borderRadius:10, border:"1px solid rgba(124,58,237,0.25)", overflow:"hidden", boxShadow:"0 4px 28px rgba(0,0,0,0.55)", cursor:isDraggingOverlay?"grabbing":"grab", touchAction:"none" }}>
                {/* Header row */}
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"7px 12px 6px", borderBottom:"1px solid rgba(124,58,237,0.12)", background:"rgba(124,58,237,0.06)", userSelect:"none" }}>
                  <span style={{ fontSize:9, fontFamily:"monospace", color:"rgba(124,58,237,0.6)", letterSpacing:".08em", textTransform:"uppercase" }}>Aufgabe</span>
                  <div style={{ display:"flex", gap:2, opacity:0.4 }}>
                    {[0,1,2,3,4,5].map(i => <div key={i} style={{ width:3, height:3, borderRadius:"50%", background:"#7c3aed" }} />)}
                  </div>
                </div>
                <div style={{ padding:"8px 12px 10px" }}>
                  {ex.initialCode && <div style={{ fontFamily:"monospace", fontSize:11, color:"#6b7280", background:"rgba(255,255,255,0.04)", borderRadius:6, padding:"3px 8px", marginBottom:6, border:"1px solid rgba(255,255,255,0.06)" }}>{ex.initialCode}</div>}
                  <div style={{ fontSize:13, lineHeight:1.5, color:"#d1d5db", pointerEvents:"none" }}><HighlightTask text={ex.task} /></div>
                </div>
              </div>
            </div>

            {/* Case hint */}
            {fb==="case" && caseHint && (
              <div style={{ position:"absolute", top:0, left:28, right:0, zIndex:15, background:"rgba(251,191,36,.12)", backdropFilter:"blur(8px)", borderBottom:"1px solid rgba(251,191,36,.3)", padding:"6px 14px", display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ fontSize:14 }}>⚠️</span>
                <span style={{ fontSize:11, fontFamily:"monospace", color:"#fbbf24" }}>{caseHint}</span>
              </div>
            )}

            {/* Feedback overlay */}
            {fb && fb !== "case" && (
              <div style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:20, display:"flex", alignItems:"center", justifyContent:"center", background:fb==="correct"?"rgba(34,197,94,.07)":"rgba(248,113,113,.05)", fontSize:48 }}>
                {fb === "correct" ? "✅" : "❌"}
              </div>
            )}

            {/* FAS — always in editor layer, above all editor content */}
            <FloatingActionStack />
          </div>

          {/* Syntax Tokens Toolbar — ONLY tokens, no action buttons */}
          {showTokens && (
            <div
              style={{ height:TOKEN_H, background:code.split("\n").length > 5 ? "rgba(13,13,20,0.8)" : "#0d0d14", backdropFilter:code.split("\n").length > 5 ? "blur(10px)" : "none", WebkitBackdropFilter:code.split("\n").length > 5 ? "blur(10px)" : "none", borderTop:"1px solid rgba(30,30,46,0.7)", display:"flex", alignItems:"center", flexWrap:"nowrap", padding:"0 10px", gap:6, overflowX:"auto", scrollbarWidth:"none", flexShrink:0, transition:"background 0.35s" }}
              onTouchStart={() => setIsScrollingTokens(false)}
              onTouchMove={() => setIsScrollingTokens(true)}
              onTouchEnd={() => setTimeout(() => setIsScrollingTokens(false), 50)}
            >
              {smartToks.map((s,i) => {
                const isFlashing = flashIdx === i;
                return (
                  <button key={i}
                    onTouchEnd={e => { e.preventDefault(); if(isScrollingTokens) return; insert(s,i); }}
                    onClick={() => { if(isScrollingTokens) return; insert(s,i); }}
                    style={{ padding:"5px 12px", height:34, flexShrink:0, background:isFlashing?"rgba(124,58,237,.4)":"rgba(255,255,255,.05)", border:`1px solid ${isFlashing?"#7c3aed":"rgba(255,255,255,.08)"}`, borderRadius:8, color:isFlashing?"#e9d5ff":"#c4b5fd", fontFamily:"monospace", fontSize:12, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap", outline:"none", transform:isFlashing?"scale(1.06)":"scale(1)", transition:"all 0.15s", boxShadow:isFlashing?"0 0 10px rgba(124,58,237,.35)":"none" }}>
                    {s}
                  </button>
                );
              })}
            </div>
          )}

          {/* Hint Bottom Sheet — z-index above FAS, manual open only */}
          {SHEET_OPEN && (
            <div style={{ height:sheetH!, background:"#0f0f1a", borderTop:"1px solid rgba(124,58,237,.2)", display:"flex", flexDirection:"column", overflow:"hidden", borderRadius:"18px 18px 0 0", boxShadow:"0 -10px 40px rgba(0,0,0,.7)", flexShrink:0, zIndex:70 }}>
              {/* Grabber only */}
              <div
                onPointerDown={onSheetDragStart} onPointerMove={onSheetDragMove}
                onPointerUp={onSheetDragEnd} onPointerCancel={onSheetDragEnd}
                onTouchStart={onSheetDragStart} onTouchMove={onSheetDragMove} onTouchEnd={onSheetDragEnd}
                style={{ flexShrink:0, height:28, cursor:"ns-resize", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 14px", userSelect:"none", touchAction:"none" }}>
                <div style={{ width:36, height:4, borderRadius:2, background:"rgba(124,58,237,.3)", margin:"0 auto" }} />
                <button
                  onTouchEnd={e => { e.preventDefault(); e.stopPropagation(); setSheetH(null); }}
                  onClick={e => { e.stopPropagation(); setSheetH(null); }}
                  style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", width:22, height:22, borderRadius:6, background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.06)", color:"#4b5563", cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", justifyContent:"center", outline:"none" }}>
                  ×
                </button>
              </div>
              <SheetContent />
            </div>
          )}
        </div>
      </>
    );
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // NORMAL VIEW
  // ═════════════════════════════════════════════════════════════════════════════
  const editorH = hasStarted ? 160 : 120;

  return (
    <>
      <style>{STYLES}</style>
      <DifficultyModal isOpen={showDifficulty} onRate={handleDifficultyRate} onSkip={handleDifficultySkip} />
      {showOnboarding && <OnboardingModal onDone={() => setShowOnboarding(false)} />}
      {showChipSheet  && <ChipModeSheet onChoice={enterFullscreen} />}
      <HintConfirmSheet />
      <PostSolveSheet />

      <div style={{ display:"flex", flexDirection:"column", height:"100dvh", maxWidth:430, margin:"0 auto", background:"#060609", color:"#f1f0fb", fontFamily:"'Inter',system-ui,sans-serif", overflow:"hidden", paddingBottom:56 }}>

        {/* Header */}
        <div style={{ height:52, flexShrink:0, background:"#0d0d14", borderBottom:"1px solid #1e1e2e", display:"flex", alignItems:"center", padding:"0 10px 0 14px", gap:8 }}>
          <button style={smallBtn()} onClick={onBack}>←</button>
          <div style={{ flex:1, textAlign:"center", lineHeight:1.3 }}>
            <div style={{ fontSize:9, fontFamily:"monospace", color:"#6b7280", textTransform:"uppercase", letterSpacing:".1em" }}>ÜBUNG {exIdx+1}/{EXERCISES.length}</div>
            <div style={{ fontSize:13, fontWeight:700, color:solved?"#4ade80":"#f1f0fb" }}>{headerTitle}{solved&&" ✓"}</div>
          </div>
          <div style={{ display:"flex", gap:6 }}>
            <button style={smallBtn(28)} onClick={() => setExIdx(p => Math.max(0,p-1))}>‹</button>
            <button style={smallBtn(28)} onClick={() => setExIdx(p => Math.min(EXERCISES.length-1,p+1))}>›</button>
          </div>
        </div>

        {/* Task Card */}
        <div style={{ background:"#0d0d14", borderBottom:"1px solid #1e1e2e", flexShrink:0 }}>
          <button onClick={() => setTaskOpen(p => !p)} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"9px 14px", background:"none", border:"none", cursor:"pointer", color:"#f1f0fb", outline:"none" }}>
            <div style={{ display:"flex", alignItems:"center", gap:7 }}><span>📋</span><span style={{ fontSize:10, fontFamily:"monospace", color:"#6b7280", textTransform:"uppercase", letterSpacing:".08em" }}>Aufgabe</span></div>
            <span style={{ color:"#4b5563", fontSize:12 }}>{taskOpen?"▴":"▾"}</span>
          </button>
          {taskOpen && (
            <div style={{ padding:"0 14px 12px", fontSize:14, lineHeight:1.6, color:"#d1d5db" }}>
              {ex.initialCode && <div style={{ fontFamily:"monospace", fontSize:12, color:"#6b7280", background:"#111118", borderRadius:6, padding:"5px 10px", marginBottom:8, border:"1px solid #1e1e2e" }}>{ex.initialCode}</div>}
              <HighlightTask text={ex.task} />
            </div>
          )}
        </div>

        {/* Chip bar always below task card */}
        <ChipBar chips={chips} solToks={solToks} pct={pct} visible={showChips} />

        {/* Editor Preview – scrollable when content exists */}
        <div style={{ height:editorH, flexShrink:0, position:"relative", background:"#0a0a10", cursor:"pointer", borderBottom:"1px solid #1a1a28", overflow:"hidden" }}
          onClick={openFullscreenAndFocus}>
          <div style={{ position:"absolute", left:0, top:0, bottom:0, width:28, background:"#0d0d14", borderRight:"1px solid #1a1a28", display:"flex", alignItems:"flex-start", justifyContent:"center", paddingTop:PAD_T, fontSize:11, fontFamily:"monospace", color:"#3a3a5a", userSelect:"none", pointerEvents:"none" }}>1</div>
          <div style={{ position:"absolute", inset:0, left:28, fontFamily:"'JetBrains Mono',monospace", fontSize:16, lineHeight:`${LINE_H}px`, color:code?"#e2e8f0":"#2a2a3e", padding:`${PAD_T}px 12px 10px`, whiteSpace:"pre-wrap", pointerEvents:"none", overflowY:"auto" }}>
            {code || "// Code hier eingeben…"}
          </div>
        </div>

        {/* Tap zone – smaller + different text when started */}
        <div style={{ flex:1, background:"#0a0a10", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }} onClick={openFullscreenAndFocus}>
          <span style={{ fontSize:10, color:"#252540", fontFamily:"monospace", letterSpacing:".06em" }}>
            {hasStarted ? "↑ Drücken für Vollbild" : "↑ Tippe zum Starten"}
          </span>
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, zIndex:200 }}>
        <div style={{ background:"#0d0d14", borderTop:"1px solid #1e1e2e", padding:"6px 16px 8px", display:"flex", alignItems:"flex-end", gap:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, flex:1, justifyContent:"center" }}>
            <span style={{ fontSize:11, color:"#4b5563", fontFamily:"monospace" }}>↑ Im Vollbild tippen & prüfen</span>
          </div>
        </div>
      </div>
    </>
  );
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  ::-webkit-scrollbar{display:none;}
  html,body{background:#060609;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;width:100%;height:100%;overflow:hidden;margin:0;position:relative;}
  textarea{-webkit-user-select:text!important;user-select:text!important;font-size:16px!important;-webkit-text-size-adjust:100%;overscroll-behavior:contain;}
  input,textarea,button{-webkit-appearance:none;-webkit-tap-highlight-color:transparent;}
  @keyframes shake{10%,90%{transform:translate3d(-1px,0,0)}20%,80%{transform:translate3d(2px,0,0)}30%,50%,70%{transform:translate3d(-4px,0,0)}40%,60%{transform:translate3d(4px,0,0)}}
`;
