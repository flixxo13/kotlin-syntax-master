import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLearningStore } from '../store/useLearningStore';
import { TOPICS } from '../data/topics';
import { Exercise, HintLevel } from '../types';
import { analyzeKotlinSyntax, getSmartTokens, FeedbackElement } from '../services/syntaxAnalyzer';
import { NoteModal } from '../components/exercise/NoteModal';
import { AssignmentView } from '../components/exercise/AssignmentView';

// ─── FEEDBACK CHIP STYLES ─────────────────────────────────────────────────────
const CHIP_STYLE = {
  'correct-pos': {
    bg: 'rgba(34,197,94,.2)',
    border: 'rgba(34,197,94,.6)',
    color: '#4ade80',
    mark: '✓',
  },
  'in-solution': {
    bg: 'rgba(59,130,246,.2)',
    border: 'rgba(59,130,246,.6)',
    color: '#60a5fa',
    mark: '~',
  },
  'detected': {
    bg: 'rgba(100,116,139,.1)',
    border: 'rgba(100,116,139,.2)',
    color: '#52606e',
    mark: null,
  },
  'unknown': {
    bg: 'rgba(71,85,105,.08)',
    border: 'rgba(71,85,105,.15)',
    color: '#3d4654',
    mark: null,
  },
} as const;

const HINT_COLORS = ['#f97316', '#fb923c', '#fca5a5'];

// ─── PROPS ────────────────────────────────────────────────────────────────────
interface ExerciseScreenProps {
  topicId:    string;
  conceptId:  string;
  exerciseId?: string;
  onBack:     () => void;
}

// ─── ICON BUTTON STYLE HELPER ─────────────────────────────────────────────────
const iconBtnStyle = (active: boolean): React.CSSProperties => ({
  width: 34, height: 34, borderRadius: 9, flexShrink: 0,
  background:  active ? 'rgba(124,58,237,.35)' : 'rgba(255,255,255,.06)',
  border:      active ? '1px solid rgba(124,58,237,.6)' : '1px solid rgba(255,255,255,.08)',
  color:       active ? '#c4b5fd' : '#6b7280',
  cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'all .15s',
  outline: 'none',
  WebkitTapHighlightColor: 'transparent',
});

// ═══════════════════════════════════════════════════════════════════════════════
export const ExerciseScreen: React.FC<ExerciseScreenProps> = ({
  topicId, conceptId, exerciseId, onBack,
}) => {
  const {
    currentHintLevel, requestHint, revealSolution,
    completeExercise, resetHint, startSession,
    customTasks, exerciseNotes, saveExerciseNote,
    editorHeight: storedEditorHeight,
  } = useLearningStore();

  // ── Find exercise ──
  let exercise: Exercise | null = null;
  if (topicId === 'custom' && exerciseId) {
    exercise = customTasks.find(t => t.id === exerciseId) ?? null;
  } else {
    const topic   = TOPICS.find(t => t.id === topicId);
    const concept = topic?.concepts.find(c => c.id === conceptId);
    exercise = concept?.exercises.find(e => e.id === exerciseId) ?? concept?.exercises[0] ?? null;
  }

  // ── State ──
  const [code, setCode]           = useState('');
  const [fb, setFb]               = useState<'correct' | 'incorrect' | null>(null);
  const [chips, setChips]         = useState<FeedbackElement[]>([]);
  const [solved, setSolved]       = useState(false);
  const [taskOpen, setTaskOpen]   = useState(true);
  const [noteOpen, setNoteOpen]   = useState(false);

  // Layout modes
  const [fullscreen, setFullscreen] = useState(false);
  const [showChips, setShowChips]   = useState(true);
  const [showTokens, setShowTokens] = useState(true);

  // Sheet: 'collapsed' | 'half' | 'full'
  const [sheet, setSheet] = useState<'collapsed' | 'half' | 'full'>('collapsed');

  // Keyboard height
  const [kbH, setKbH] = useState(0);
  const kbOpen = kbH > 80;

  const taRef    = useRef<HTMLTextAreaElement>(null);
  const dragY0   = useRef<number | null>(null);
  const dragSt0  = useRef<'collapsed' | 'half' | 'full'>('collapsed');

  // ── visualViewport keyboard ──
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const upd = () => {
      const kb = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setKbH(kb);
    };
    vv.addEventListener('resize', upd);
    vv.addEventListener('scroll', upd);
    upd();
    return () => { vv.removeEventListener('resize', upd); vv.removeEventListener('scroll', upd); };
  }, []);

  // ── Reset on exercise change ──
  useEffect(() => {
    if (!exercise) return;
    resetHint();
    setCode(exercise.initialCode || '');
    setFb(null); setChips([]); setSolved(false);
    setTaskOpen(true); setSheet('collapsed');
    setFullscreen(false);
    startSession(topicId, conceptId, exercise.mode);
  }, [exercise?.id]);

  // ── Live feedback chips ──
  useEffect(() => {
    if (!exercise) return;
    setChips(code.trim() ? analyzeKotlinSyntax(code, exercise.solution) : []);
  }, [code, exercise?.solution]);

  // ── Reveal solution ──
  useEffect(() => {
    if (currentHintLevel === HintLevel.REVEALED && exercise?.solution) {
      setCode(exercise.solution);
    }
  }, [currentHintLevel, exercise?.solution]);

  if (!exercise) {
    return (
      <div className="flex items-center justify-center h-screen text-text-secondary text-sm">
        Übung nicht gefunden
      </div>
    );
  }

  // ── Derived ──
  const normalize  = (s: string) => s.replace(/\s+/g, ' ').trim();
  const isCorrect  = normalize(code) === normalize(exercise.solution);
  const solToks    = analyzeKotlinSyntax(exercise.solution, exercise.solution).length;
  const correctN   = chips.filter(c => c.type === 'correct-pos').length;
  const pct        = solToks > 0 ? Math.round((correctN / solToks) * 100) : 0;
  const hlNum      = typeof currentHintLevel === 'number' ? currentHintLevel : 3;
  const allHintsUsed = hlNum >= 3;
  const solShown   = currentHintLevel === HintLevel.REVEALED;

  const hintLabel  = solShown ? '—' : allHintsUsed ? 'LÖSUNG' : 'HINT+';
  const hintColor  = solShown ? '#374151' : allHintsUsed ? '#ef4444' : '#f97316';
  const hintBorder = solShown ? '#2a2a3a' : allHintsUsed ? 'rgba(239,68,68,.35)' : 'rgba(249,115,22,.35)';

  const currentHintText =
    hlNum === 1 ? exercise.hints.level1 :
    hlNum === 2 ? exercise.hints.level2 :
    hlNum === 3 ? exercise.hints.level3 : null;

  const ghostHint = hlNum > 0 && !code && !solShown ? currentHintText : null;

  // Sheet heights
  const SH = {
    collapsed: 56,
    half:  Math.min(220, hlNum * 82 + 70),
    full:  240,
  };
  const sheetH  = SH[sheet];
  const TOKEN_H = showTokens ? 48 : 0;
  const totalAcc = TOKEN_H + sheetH;

  const smartToks = getSmartTokens(code);

  // ── Actions ──
  const check = useCallback(() => {
    const ok = isCorrect;
    setFb(ok ? 'correct' : 'incorrect');
    if (ok) {
      setSolved(true);
      setTimeout(() => {
        completeExercise(exercise!.id, exercise!.conceptId, currentHintLevel);
        setFb(null);
        onBack();
      }, 1500);
    } else {
      setTimeout(() => setFb(null), 800);
    }
  }, [isCorrect, exercise, currentHintLevel, onBack, completeExercise]);

  const doRequestHint = useCallback(() => {
    if (solShown) return;
    if (!allHintsUsed) {
      requestHint();
      if (sheet === 'collapsed') setSheet('half');
    } else {
      revealSolution();
    }
  }, [solShown, allHintsUsed, requestHint, revealSolution, sheet]);

  const insert = useCallback((raw: string) => {
    const text = raw.replace('( )', '()').replace('{ }', '{}').replace('[ ]', '[]');
    const ta = taRef.current;
    if (ta) {
      const s = ta.selectionStart, e = ta.selectionEnd;
      setCode(code.slice(0, s) + text + code.slice(e));
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = s + text.length; ta.focus(); }, 0);
    } else {
      setCode(p => p + text);
    }
  }, [code]);

  const onDragStart = (e: React.PointerEvent | React.TouchEvent) => {
    dragY0.current  = 'touches' in e ? e.touches[0].clientY : (e as React.PointerEvent).clientY;
    dragSt0.current = sheet;
  };
  const onDragEnd = (e: React.PointerEvent | React.TouchEvent) => {
    if (dragY0.current === null) return;
    const endY = 'changedTouches' in e
      ? e.changedTouches[0].clientY
      : (e as React.PointerEvent).clientY;
    const d   = endY - dragY0.current;
    const cur = dragSt0.current;
    if (d < -40)     setSheet(cur === 'collapsed' ? 'half' : cur === 'half' ? 'full' : 'full');
    else if (d > 40) setSheet(cur === 'full' ? 'half' : cur === 'half' ? 'collapsed' : 'collapsed');
    dragY0.current = null;
  };

  // ── Sub-components (inline to share scope) ──

  const TokenBar = () => (
    <div style={{ height: 48, background: '#0d0d14', borderTop: '1px solid #1e1e2e',
      display: 'flex', alignItems: 'center', padding: '0 8px', gap: 5,
      overflowX: 'auto', scrollbarWidth: 'none', flexShrink: 0 }}>
      {/* Live check */}
      <button onClick={check}
        style={{ width: 34, height: 34, borderRadius: 8, flexShrink: 0,
          background: isCorrect ? 'rgba(34,197,94,.2)' : '#16162a',
          border: `1.5px solid ${isCorrect ? '#22c55e' : '#252540'}`,
          color: isCorrect ? '#4ade80' : '#6b7280',
          cursor: 'pointer', fontSize: 14, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all .2s', outline: 'none' }}>
        {isCorrect ? '✓' : '▶'}
      </button>
      <div style={{ width: 1, height: 22, background: '#1e1e2e', flexShrink: 0 }} />
      {smartToks.map((s, i) => (
        <button key={i} onClick={() => insert(s)}
          style={{ padding: '5px 10px', height: 34, flexShrink: 0,
            background: '#16162a', border: '1px solid #252540',
            borderRadius: 7, color: '#c4b5fd',
            fontFamily: 'monospace', fontSize: 12, fontWeight: 600,
            cursor: 'pointer', whiteSpace: 'nowrap', outline: 'none' }}
          onPointerDown={e => { e.currentTarget.style.background = '#7c3aed'; e.currentTarget.style.color = '#fff'; }}
          onPointerUp={e => { e.currentTarget.style.background = '#16162a'; e.currentTarget.style.color = '#c4b5fd'; }}
          onPointerLeave={e => { e.currentTarget.style.background = '#16162a'; e.currentTarget.style.color = '#c4b5fd'; }}
        >{s}</button>
      ))}
    </div>
  );

  const HintSheet = () => (
    <div style={{ height: sheetH, background: '#111118',
      borderTop: '1px solid #252540',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      transition: 'height .22s cubic-bezier(.4,0,.2,1)',
      borderRadius: sheet !== 'collapsed' ? '14px 14px 0 0' : 0,
      boxShadow: sheet !== 'collapsed' ? '0 -6px 28px rgba(0,0,0,.55)' : 'none' }}>

      {sheet !== 'collapsed' && (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8, paddingBottom: 2, flexShrink: 0 }}
          onPointerDown={onDragStart as any} onPointerUp={onDragEnd as any}
          onTouchStart={onDragStart as any} onTouchEnd={onDragEnd as any}>
          <div style={{ width: 32, height: 4, borderRadius: 2, background: '#2a2a42', cursor: 'ns-resize' }} />
        </div>
      )}

      {/* Action row */}
      <div onPointerDown={onDragStart as any} onPointerUp={onDragEnd as any}
        onTouchStart={onDragStart as any} onTouchEnd={onDragEnd as any}
        style={{ height: 56, flexShrink: 0, display: 'flex', alignItems: 'center',
          padding: '0 12px', gap: 10, cursor: 'ns-resize', userSelect: 'none' }}>

        <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0,
          background: hlNum > 0 ? '#2d1a00' : '#1a1a2e',
          border: `1px solid ${hlNum > 0 ? 'rgba(249,115,22,.25)' : '#252540'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 17 }}>💡</span>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
          <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#6b7280',
            textTransform: 'uppercase', letterSpacing: '.08em' }}>HILFE & HINTS</span>
          <div style={{ display: 'flex', gap: 3 }}>
            {[1, 2, 3].map(l => (
              <div key={l} style={{ height: 4, width: 20, borderRadius: 2,
                background: hlNum >= l ? HINT_COLORS[l - 1] : '#252540',
                transition: 'background .2s' }} />
            ))}
            <div style={{ height: 4, width: 20, borderRadius: 2,
              background: solShown ? '#ef4444' : '#252540', transition: 'background .2s' }} />
          </div>
        </div>

        <button onClick={doRequestHint} disabled={solShown}
          style={{ padding: '8px 14px', height: 36,
            background: allHintsUsed && !solShown ? 'rgba(239,68,68,.1)' : 'transparent',
            border: `1.5px solid ${hintBorder}`,
            borderRadius: 10, color: hintColor,
            fontSize: 11, fontWeight: 700, fontFamily: 'monospace',
            letterSpacing: '.04em', whiteSpace: 'nowrap',
            cursor: solShown ? 'default' : 'pointer', outline: 'none' }}>
          {hintLabel}
        </button>

        <button onClick={check}
          style={{ padding: '8px 16px', height: 36,
            background: isCorrect
              ? 'linear-gradient(135deg,#16a34a,#22c55e)'
              : 'linear-gradient(135deg,#6d28d9,#7c3aed)',
            border: 'none', borderRadius: 10, color: '#fff',
            fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
            boxShadow: isCorrect ? '0 2px 12px rgba(34,197,94,.3)' : '0 2px 12px rgba(124,58,237,.25)',
            transition: 'background .3s', outline: 'none' }}
          onPointerDown={e => e.currentTarget.style.transform = 'scale(.95)'}
          onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
          onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >CHECK</button>

        <button onClick={() => setSheet(s => s === 'collapsed' ? 'half' : s === 'half' ? 'full' : 'collapsed')}
          style={{ width: 30, height: 30, background: '#1a1a2e', border: '1px solid #252540',
            borderRadius: 8, color: '#6b7280', cursor: 'pointer', fontSize: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            outline: 'none' }}>
          {sheet === 'full' ? '▼' : '▲'}
        </button>
      </div>

      {/* Hint cards */}
      {sheet !== 'collapsed' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '2px 12px 12px',
          display: 'flex', flexDirection: 'column', gap: 8 }}>
          {hlNum === 0
            ? <div style={{ textAlign: 'center', padding: '12px 0', fontSize: 12, color: '#4b5563' }}>
                Drücke HINT+ für einen Hinweis
              </div>
            : [exercise.hints.level1, exercise.hints.level2, exercise.hints.level3]
                .slice(0, hlNum)
                .map((h, i) => (
                  <div key={i} style={{ padding: '9px 12px', borderRadius: 10,
                    background: '#0d0d14',
                    border: `1px solid ${HINT_COLORS[i]}22`,
                    borderLeft: `3px solid ${HINT_COLORS[i]}` }}>
                    <div style={{ fontSize: 10, fontFamily: 'monospace', color: HINT_COLORS[i],
                      marginBottom: 4, letterSpacing: '.06em' }}>HINT {i + 1}</div>
                    <div style={{ fontFamily: 'monospace', fontSize: 13, color: '#d1d5db', lineHeight: 1.6 }}>
                      {h}
                    </div>
                  </div>
                ))
          }
          {solShown && (
            <div style={{ padding: '9px 12px', borderRadius: 10,
              background: 'rgba(239,68,68,.08)',
              border: '1px solid rgba(239,68,68,.25)', borderLeft: '3px solid #ef4444' }}>
              <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#ef4444',
                marginBottom: 4, letterSpacing: '.06em' }}>LÖSUNG</div>
              <div style={{ fontFamily: 'monospace', fontSize: 13, color: '#4ade80', lineHeight: 1.6 }}>
                {exercise.solution}
              </div>
            </div>
          )}
          {/* Chip legend */}
          {chips.length > 0 && (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap',
              padding: '7px 10px', background: '#0d0d14',
              borderRadius: 8, border: '1px solid #1e1e2e', marginTop: 2 }}>
              {([
                ['#4ade80', 'Richtig + Position ✓'],
                ['#60a5fa', 'Falsche Position'],
                ['#52606e', 'Kotlin-Syntax'],
              ] as [string, string][]).map(([c, l]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: c, flexShrink: 0 }} />
                  <span style={{ fontSize: 10, color: '#6b7280' }}>{l}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  const ChipsRow = () => (
    <div style={{ flexShrink: 0, minHeight: 32, background: '#0a0a10',
      borderBottom: '1px solid #1e1e2e',
      display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 4, padding: '4px 12px' }}>
      {chips.length === 0
        ? <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#2a2a3e',
            letterSpacing: '.08em' }}>• Warte auf Syntax-Elemente…</span>
        : <>
            {chips.map((c, i) => {
              const st = CHIP_STYLE[c.type] ?? CHIP_STYLE.unknown;
              return (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 2,
                  padding: '2px 7px', borderRadius: 6, fontSize: 12,
                  fontFamily: 'monospace', fontWeight: 600, transition: 'all .15s',
                  background: st.bg, border: `1px solid ${st.border}`, color: st.color }}>
                  {c.text}
                  {st.mark && <span style={{ fontSize: 9, opacity: .8 }}>{st.mark}</span>}
                </span>
              );
            })}
            {solToks > 0 && (
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                <div style={{ width: 40, height: 3, background: '#1e1e2e', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', transition: 'width .25s', borderRadius: 2,
                    width: `${pct}%`, background: pct === 100 ? '#22c55e' : '#7c3aed' }} />
                </div>
                <span style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 700,
                  color: pct === 100 ? '#4ade80' : '#6b7280', minWidth: 24 }}>{pct}%</span>
              </div>
            )}
          </>
      }
    </div>
  );

  const EditorArea = ({ clickable = false }: { clickable?: boolean }) => (
    <div style={{ flex: 1, minHeight: 0, position: 'relative', background: '#0a0a10' }}
      onClick={clickable ? () => { setFullscreen(true); setTimeout(() => taRef.current?.focus(), 100); } : undefined}>

      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 28,
        background: '#0d0d14', borderRight: '1px solid #1a1a28',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 10,
        fontSize: 11, fontFamily: 'monospace', color: '#3a3a5a',
        userSelect: 'none', pointerEvents: 'none' }}>1</div>

      {ghostHint && (
        <div style={{ position: 'absolute', left: 28, top: 0, right: 0,
          padding: '10px 12px', pointerEvents: 'none',
          fontFamily: "'JetBrains Mono',monospace", fontSize: 14, lineHeight: 1.75,
          color: 'rgba(120,80,220,.3)', whiteSpace: 'pre-wrap' }}>
          {ghostHint}
        </div>
      )}

      <textarea ref={taRef} value={code}
        onChange={e => setCode(e.target.value)}
        readOnly={clickable}
        style={{ position: 'absolute', inset: 0, left: 28,
          background: 'transparent', border: 'none', outline: 'none',
          fontFamily: "'JetBrains Mono',monospace", fontSize: 14, lineHeight: 1.75,
          color: fb === 'correct' ? '#4ade80' : fb === 'incorrect' ? '#f87171' : '#e2e8f0',
          padding: '10px 12px', resize: 'none', caretColor: '#7c3aed',
          spellCheck: false, cursor: clickable ? 'pointer' : 'text' }}
        placeholder={ghostHint ? '' : '// Code hier…'}
      />

      {fb && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: fb === 'correct' ? 'rgba(34,197,94,.07)' : 'rgba(248,113,113,.07)',
          fontSize: 48 }}>
          {fb === 'correct' ? '✅' : '❌'}
        </div>
      )}
    </div>
  );

  // ── Accessory bar (fixed over keyboard) ──
  const AccessoryBar = () => (
    <div style={{ position: 'fixed', bottom: kbH, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430, zIndex: 200,
      display: 'flex', flexDirection: 'column',
      transition: kbH > 0 ? 'none' : 'bottom .25s ease' }}>
      {showChips && kbOpen && <ChipsRow />}
      {showTokens && <TokenBar />}
      <HintSheet />
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════
  // ZUORDNUNG MODE
  // ══════════════════════════════════════════════════════════════════════
  if (exercise.mode === 'assignment' && exercise.assignmentData) {
    return (
      <div className="flex flex-col h-screen bg-background text-text-primary overflow-hidden">
        <header className="h-14 bg-surface flex items-center px-4 justify-between border-b border-surface-2 shrink-0">
          <button onClick={onBack} className="p-2 rounded-lg bg-surface-2 text-text-secondary">
            ←
          </button>
          <div className="text-center">
            <div className="text-[9px] font-mono text-text-secondary uppercase tracking-wider">ZUORDNUNG</div>
            <div className="text-sm font-bold">{exercise.conceptId}</div>
          </div>
          <button onClick={() => setNoteOpen(true)} className="p-2 rounded-lg bg-surface-2 text-text-secondary">💬</button>
        </header>

        <AssignmentView
          exercise={exercise}
          onComplete={(correct) => {
            if (correct) {
              completeExercise(exercise.id, exercise.conceptId, currentHintLevel);
              onBack();
            }
          }}
        />

        <NoteModal
          isOpen={noteOpen}
          onClose={() => setNoteOpen(false)}
          exerciseId={exercise.id}
          initialNote={exerciseNotes[exercise.id] || ''}
          onSave={(note) => saveExerciseNote(exercise.id, note)}
        />
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════
  // FULLSCREEN MODE
  // ══════════════════════════════════════════════════════════════════════
  if (fullscreen) {
    return (
      <>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh',
          maxWidth: 430, margin: '0 auto', background: '#060609', color: '#f1f0fb',
          fontFamily: "'Inter',system-ui,sans-serif", overflow: 'hidden',
          paddingBottom: kbH + totalAcc }}>

          {/* Fullscreen header */}
          <div style={{ height: 48, flexShrink: 0, background: '#0d0d14',
            borderBottom: '1px solid #1e1e2e',
            display: 'flex', alignItems: 'center', padding: '0 10px', gap: 6 }}>

            <button onClick={() => { setFullscreen(false); taRef.current?.blur(); }}
              style={{ width: 34, height: 34, borderRadius: 9, background: 'transparent',
                border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                outline: 'none' }}>←</button>

            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: 9, fontFamily: 'monospace', color: '#6b7280',
                textTransform: 'uppercase', letterSpacing: '.1em' }}>ÜBUNG</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: solved ? '#4ade80' : '#f1f0fb' }}>
                {exercise.conceptId}{solved && ' ✓'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 6 }}>
              <button style={iconBtnStyle(showChips)} onClick={() => setShowChips(p => !p)} title="Feedback-Chips">
                <span style={{ fontSize: 13 }}>≡</span>
              </button>
              <button style={iconBtnStyle(showTokens)} onClick={() => setShowTokens(p => !p)} title="Token-Bar">
                <span style={{ fontSize: 12 }}>⌨</span>
              </button>
              <button onClick={() => setNoteOpen(true)} style={iconBtnStyle(false)} title="Notizen">
                <span style={{ fontSize: 12 }}>💬</span>
              </button>
            </div>
          </div>

          {/* Full editor */}
          <EditorArea clickable={false} />
        </div>

        <AccessoryBar />

        <NoteModal
          isOpen={noteOpen}
          onClose={() => setNoteOpen(false)}
          exerciseId={exercise.id}
          initialNote={exerciseNotes[exercise.id] || ''}
          onSave={(note) => saveExerciseNote(exercise.id, note)}
        />
      </>
    );
  }

  // ══════════════════════════════════════════════════════════════════════
  // NORMAL VIEW
  // ══════════════════════════════════════════════════════════════════════
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh',
        maxWidth: 430, margin: '0 auto', background: '#060609', color: '#f1f0fb',
        fontFamily: "'Inter',system-ui,sans-serif", overflow: 'hidden',
        paddingBottom: SH.collapsed }}>

        {/* Header */}
        <div style={{ height: 52, flexShrink: 0, background: '#0d0d14',
          borderBottom: '1px solid #1e1e2e',
          display: 'flex', alignItems: 'center', padding: '0 10px 0 14px', gap: 8 }}>

          <button onClick={onBack}
            style={{ width: 34, height: 34, background: 'transparent', border: 'none',
              color: '#6b7280', cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', borderRadius: 8, outline: 'none' }}>
            ←
          </button>

          <div style={{ flex: 1, textAlign: 'center', lineHeight: 1.3 }}>
            <div style={{ fontSize: 9, fontFamily: 'monospace', color: '#6b7280',
              textTransform: 'uppercase', letterSpacing: '.1em' }}>ÜBUNG</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: solved ? '#4ade80' : '#f1f0fb' }}>
              {exercise.conceptId}{solved && ' ✓'}
            </div>
          </div>

          <button onClick={() => setNoteOpen(true)}
            style={{ width: 30, height: 30, background: 'transparent', border: '1px solid #1e1e2e',
              borderRadius: 7, color: '#6b7280', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', outline: 'none' }}>
            💬
          </button>
        </div>

        {/* Aufgabe */}
        <div style={{ background: '#0d0d14', borderBottom: '1px solid #1e1e2e', flexShrink: 0 }}>
          <button onClick={() => setTaskOpen(p => !p)}
            style={{ width: '100%', display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', padding: '9px 14px',
              background: 'none', border: 'none', cursor: 'pointer', color: '#f1f0fb', outline: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ fontSize: 13 }}>📋</span>
              <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#6b7280',
                textTransform: 'uppercase', letterSpacing: '.08em' }}>Aufgabe</span>
            </div>
            <span style={{ color: '#4b5563', fontSize: 13 }}>{taskOpen ? '▴' : '▾'}</span>
          </button>
          {taskOpen && (
            <div style={{ padding: '0 14px 12px', fontSize: 14, lineHeight: 1.6, color: '#d1d5db' }}>
              {exercise.initialCode && (
                <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#6b7280',
                  background: '#111118', borderRadius: 6, padding: '5px 10px',
                  marginBottom: 8, border: '1px solid #1e1e2e' }}>
                  {exercise.initialCode}
                </div>
              )}
              {exercise.task}
            </div>
          )}
        </div>

        {/* Editor — tap to go fullscreen */}
        <EditorArea clickable={true} />

        {/* Tap hint */}
        <div style={{ textAlign: 'center', padding: '5px 0', flexShrink: 0,
          background: '#0a0a10', borderBottom: '1px solid #1e1e2e' }}>
          <span style={{ fontSize: 10, color: '#2a2a3e', fontFamily: 'monospace' }}>
            Tippe auf den Editor zum Starten →
          </span>
        </div>
      </div>

      {/* Hint sheet in normal view */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430, zIndex: 200 }}>
        <HintSheet />
      </div>

      <NoteModal
        isOpen={noteOpen}
        onClose={() => setNoteOpen(false)}
        exerciseId={exercise.id}
        initialNote={exerciseNotes[exercise.id] || ''}
        onSave={(note) => saveExerciseNote(exercise.id, note)}
      />
    </>
  );
};
