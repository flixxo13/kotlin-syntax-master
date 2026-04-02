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
