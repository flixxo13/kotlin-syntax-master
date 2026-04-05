import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLearningStore } from '../store/useLearningStore';
import { parseTasks, exerciseToText } from '../services/taskParser';
import { Exercise } from '../types';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import {
  Download, Trash2, CheckCircle2, AlertCircle, AlertTriangle,
  Edit2, Plus, ArrowLeft, Eye, Save, ChevronDown, ChevronUp, Copy
} from 'lucide-react';

// ─── TYPES ────────────────────────────────────────────────────────────────────
type View = 'list' | 'import' | 'preview' | 'editor';
type ValidationStatus = 'valid' | 'warning' | 'invalid';

interface ValidationResult {
  id: string;
  status: ValidationStatus;
  errors: string[];
  warnings: string[];
  task: Exercise | null;
  rawData: Record<string, string>;
}

interface Toast {
  msg: string;
  type: 'success' | 'error' | 'warn';
}

// ─── TOPIC LIST ───────────────────────────────────────────────────────────────
const KOTLIN_TOPICS = [
  'Variablen', 'Funktionen', 'Null-Safety', 'when-Expression',
  'for-Schleife', 'Listen', 'Klassen', 'Objekte', 'Interfaces',
  'Lambda', 'Coroutines', 'String-Templates', 'Collections',
  'Data Classes', 'Sealed Classes', 'Extension Functions',
];

// ─── EMPTY TASK ───────────────────────────────────────────────────────────────
const emptyTask = (): Exercise => ({
  id: '',
  conceptId: KOTLIN_TOPICS[0],
  mode: 'builder',
  task: '',
  initialCode: '',
  solution: '',
  hints: { level1: '', level2: '', level3: '' },
});

// ─── RAW PARSER (for validation preview) ─────────────────────────────────────
function parseRawBlocks(text: string): Array<{ data: Record<string, string>; index: number }> {
  const KNOWN_KEYS = [
    'ID', 'MODUS', 'THEMA', 'BESCHREIBUNG', 'STARTCODE',
    'HINT1_STRUKTUR', 'HINT2_ANKER', 'HINT3_KONTEXT', 'LOESUNG',
    'ZIELCODE', 'BAUSTEINE_RICHTIG', 'BAUSTEINE_DISTRAKTOR', 'BAUSTEIN_MAP',
  ];

  const blocks = text.split('---').map(b => b.trim()).filter(b => b.length > 0);

  return blocks.map((block, index) => {
    const lines = block.split('\n');
    const data: Record<string, string> = {};
    let currentKey = '';
    let currentContent: string[] = [];
    let inCode = false;

    lines.forEach(line => {
      const keyMatch = line.match(/^([A-Z0-9_]+):/);
      const isKnown = keyMatch && KNOWN_KEYS.includes(keyMatch[1]);
      if (keyMatch && (isKnown || !inCode)) {
        if (currentKey) data[currentKey] = currentContent.join('\n').trim();
        currentKey = keyMatch[1];
        const first = line.replace(keyMatch[0], '').trim();
        currentContent = first ? [first] : [];
        inCode = false;
      } else {
        if (line.trim().startsWith('```')) inCode = !inCode;
        currentContent.push(line);
      }
    });
    if (currentKey) data[currentKey] = currentContent.join('\n').trim();
    return { data, index };
  });
}

// ─── VALIDATOR ────────────────────────────────────────────────────────────────
function validateBlocks(text: string): ValidationResult[] {
  const raw = parseRawBlocks(text);
  const seenIds = new Map<string, boolean>();

  return raw.map(({ data, index }) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const id = data['ID'] || `Block ${index + 1}`;
    const modus = data['MODUS'] || '';
    const isZuordnung = modus === 'ZUORDNUNG';

    if (!data['ID'])           errors.push('Kein ID');
    if (!data['MODUS'])        errors.push('Kein MODUS');
    if (!data['THEMA'])        errors.push('Kein THEMA');
    if (!data['BESCHREIBUNG']) errors.push('Keine BESCHREIBUNG');

    // Duplicate ID check
    if (data['ID']) {
      if (seenIds.has(data['ID'])) {
        errors.push(`Doppelte ID '${data['ID']}'`);
      }
      seenIds.set(data['ID'], true);
    }

    if (!isZuordnung) {
      if (!data['HINT1_STRUKTUR']) errors.push('HINT1_STRUKTUR fehlt');
      if (!data['HINT2_ANKER'])    errors.push('HINT2_ANKER fehlt');
      if (!data['HINT3_KONTEXT'])  errors.push('HINT3_KONTEXT fehlt');
      if (!data['LOESUNG'])        errors.push('LOESUNG fehlt');

      // Hint dot vs solution word count
      if (data['HINT1_STRUKTUR'] && data['LOESUNG']) {
        const cleanSol = data['LOESUNG'].replace(/```kotlin/g, '').replace(/```/g, '').trim();
        const solWords = cleanSol.split(/\s+/).filter(Boolean).length;
        const dots = (data['HINT1_STRUKTUR'].match(/\.\.\./g) || []).length;
        if (dots > 0 && Math.abs(dots - solWords) > 2) {
          warnings.push(`Hint1 hat ${dots} Punkte, Lösung ~${solWords} Tokens`);
        }
      }

      // Startcode = solution check
      if (data['STARTCODE'] && data['LOESUNG']) {
        const cs = data['STARTCODE'].replace(/```kotlin/g, '').replace(/```/g, '').trim();
        const cl = data['LOESUNG'].replace(/```kotlin/g, '').replace(/```/g, '').trim();
        if (cs && cl && cs === cl) warnings.push('Startcode entspricht Lösung');
      }
    } else {
      if (!data['ZIELCODE'])          errors.push('ZIELCODE fehlt');
      if (!data['BAUSTEINE_RICHTIG']) errors.push('BAUSTEINE_RICHTIG fehlt');
      if (!data['BAUSTEIN_MAP'])      errors.push('BAUSTEIN_MAP fehlt');
    }

    const status: ValidationStatus =
      errors.length > 0 ? 'invalid' : warnings.length > 0 ? 'warning' : 'valid';

    // Build Exercise object if valid
    let task: Exercise | null = null;
    if (errors.length === 0) {
      const cleanCode = (c: string) =>
        c ? c.replace(/^```kotlin\s*/i, '').replace(/```$/, '').trim() : '';
      task = {
        id: data['ID'],
        conceptId: data['THEMA'],
        mode: isZuordnung ? 'assignment' : 'builder',
        task: data['BESCHREIBUNG'],
        initialCode: cleanCode(data['STARTCODE'] || ''),
        solution: cleanCode(data['LOESUNG'] || ''),
        hints: {
          level1: data['HINT1_STRUKTUR'] || '',
          level2: data['HINT2_ANKER'] || '',
          level3: cleanCode(data['HINT3_KONTEXT'] || ''),
        },
      };
    }

    return { id, status, errors, warnings, task, rawData: data };
  });
}

// ─── KI PROMPT TEMPLATE ───────────────────────────────────────────────────────
const KI_PROMPT = `Generiere 5 Kotlin-Übungen im SYNTAX_BUILDER Format.
Thema: [DEIN THEMA hier einsetzen]

Format:
ID: b_XX
MODUS: SYNTAX_BUILDER
THEMA: ...
BESCHREIBUNG: ...
STARTCODE:
\`\`\`kotlin
\`\`\`
HINT1_STRUKTUR: ... ... = ...
HINT2_ANKER: val name = ...
HINT3_KONTEXT:
\`\`\`kotlin
___ name = ... // Keyword gesucht
\`\`\`
LOESUNG:
\`\`\`kotlin
val name = "Kotlin"
\`\`\`
---`;

// ═══════════════════════════════════════════════════════════════════════════════
// IMPORT SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
export const ImportScreen = () => {
  const { addCustomTasks, removeCustomTask, clearCustomTasks, customTasks, exerciseNotes } =
    useLearningStore();

  const [view, setView]             = useState<View>('list');
  const [inputText, setInputText]   = useState('');
  const [validated, setValidated]   = useState<ValidationResult[]>([]);
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [editorData, setEditorData] = useState<Exercise>(emptyTask());
  const [editorErrors, setEditorErrors] = useState<Record<string, string>>({});
  const [toast, setToast]           = useState<Toast | null>(null);
  const [showGuide, setShowGuide]   = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId]   = useState<string | null>(null);

  // Live validation
  useEffect(() => {
    if (!inputText.trim()) { setValidated([]); return; }
    try { setValidated(validateBlocks(inputText)); } catch { setValidated([]); }
  }, [inputText]);

  const showToast = (msg: string, type: Toast['type'] = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  // ── Stats ──
  const validCount   = validated.filter(v => v.status === 'valid').length;
  const warnCount    = validated.filter(v => v.status === 'warning').length;
  const invalidCount = validated.filter(v => v.status === 'invalid').length;
  const importable   = validCount + warnCount;

  // ── Import ──
  const handleImport = () => {
    const toImport = validated
      .filter(v => v.status !== 'invalid' && v.task)
      .map(v => v.task!);
    if (toImport.length === 0) { showToast('Keine gültigen Aufgaben.', 'error'); return; }
    addCustomTasks(toImport);
    showToast(`${toImport.length} Aufgaben importiert!`);
    setInputText('');
    setValidated([]);
    setView('list');
  };

  // ── Editor ──
  const openEditor = (task: Exercise | null) => {
    setEditingId(task ? task.id : null);
    setEditorData(task ? { ...task, hints: { ...task.hints } } : emptyTask());
    setEditorErrors({});
    setView('editor');
  };

  const handleEditorSave = () => {
    const errs: Record<string, string> = {};
    if (!editorData.id.trim())           errs.id = 'ID erforderlich';
    if (!editorData.task.trim())         errs.task = 'Beschreibung erforderlich';
    if (!editorData.solution.trim())     errs.solution = 'Lösung erforderlich';
    if (!editorData.hints.level1.trim()) errs.h1 = 'Hint 1 erforderlich';
    setEditorErrors(errs);
    if (Object.keys(errs).length > 0) return;
    addCustomTasks([editorData]);
    showToast(editingId ? 'Aufgabe gespeichert!' : 'Neue Aufgabe erstellt!');
    setView('list');
  };

  const updateHint = (level: 'level1' | 'level2' | 'level3', val: string) =>
    setEditorData(p => ({ ...p, hints: { ...p.hints, [level]: val } }));

  const copyPrompt = () => {
    navigator.clipboard.writeText(KI_PROMPT);
    showToast('Prompt kopiert!');
  };

  const copyAllNotes = () => {
    const text = Object.entries(exerciseNotes)
      .map(([id, note]) => `ID: ${id}\nNOTE: ${note}\n---`)
      .join('\n\n');
    navigator.clipboard.writeText(text);
    showToast('Notizen kopiert!');
  };

  const handleDownload = () => {
    if (customTasks.length === 0) return;
    const text = customTasks.map(exerciseToText).join('\n---\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `kotlin-master-aufgaben-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`${customTasks.length} Aufgaben exportiert!`);
  };

  // ── Status badge helper ──
  const StatusBadge = ({ status }: { status: ValidationStatus }) => {
    if (status === 'valid')
      return <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-success/20 text-success"><CheckCircle2 className="w-3 h-3" />ok</span>;
    if (status === 'warning')
      return <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-hint/20 text-hint"><AlertTriangle className="w-3 h-3" />warn</span>;
    return <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-error/20 text-error"><AlertCircle className="w-3 h-3" />fehler</span>;
  };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full">

      {/* ── Sub-Header with back nav ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-2 bg-surface shrink-0">
        {view !== 'list' ? (
          <button
            onClick={() => setView(view === 'preview' ? 'import' : 'list')}
            className="p-2 rounded-lg bg-surface-2 text-text-secondary hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        ) : <div className="w-8" />}

        <div className="text-center">
          <div className="text-[13px] font-bold">
            {view === 'list'    ? 'Aufgaben'     :
             view === 'import'  ? 'KI-Import'    :
             view === 'preview' ? 'Vorschau'     :
             editingId          ? 'Bearbeiten'   : 'Neue Aufgabe'}
          </div>
          <div className="text-[10px] font-mono text-text-secondary">
            {customTasks.length} gespeichert
          </div>
        </div>

        {view === 'list' ? (
          <button
            onClick={() => openEditor(null)}
            className="p-2 rounded-lg bg-primary/10 text-primary transition-colors"
            title="Neue Aufgabe"
          >
            <Plus className="w-4 h-4" />
          </button>
        ) : <div className="w-8" />}
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto p-4 pb-24 flex flex-col gap-4">
        <AnimatePresence mode="wait">

          {/* ══════════ LIST VIEW ══════════ */}
          {view === 'list' && (
            <motion.div key="list"
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.18 }}
              className="flex flex-col gap-3"
            >
              {/* Import button */}
              <button
                onClick={() => setView('import')}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <Download className="w-5 h-5" />
                KI-Text importieren
              </button>

              {/* Empty state */}
              {customTasks.length === 0 ? (
                <div className="p-10 text-center border border-dashed border-surface-2 rounded-xl text-text-secondary">
                  <div className="text-3xl mb-3">📥</div>
                  <div className="text-sm font-bold mb-1">Noch keine Aufgaben</div>
                  <div className="text-xs">Importiere KI-Text oder erstelle mit +</div>
                </div>
              ) : (
                <>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-secondary px-1">
                    Aufgaben ({customTasks.length})
                  </div>
                  {customTasks.map(task => (
                    <div key={task.id}
                      className="bg-surface border-l-2 border-success border border-surface-2 rounded-xl p-3 flex items-center justify-between gap-3"
                    >
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-mono text-text-secondary uppercase">
                          {task.mode === 'builder' ? 'SYNTAX_BUILDER' : 'ZUORDNUNG'} · {task.id}
                        </span>
                        <span className="text-sm font-bold truncate">{task.conceptId}</span>
                        <span className="text-xs text-text-secondary truncate">{task.task}</span>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => openEditor(task)}
                          className="p-2 bg-surface-2 hover:bg-surface-2/80 rounded-lg text-text-secondary hover:text-primary transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(task.id)}
                          className="p-2 bg-surface-2 hover:bg-surface-2/80 rounded-lg text-text-secondary hover:text-error transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Export + Delete all */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleDownload}
                      className="flex-1 py-3 rounded-xl border border-primary/30 text-primary text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                    >
                      <Download className="w-4 h-4" /> Als .txt speichern
                    </button>
                    <button
                      onClick={() => setConfirmDeleteAll(true)}
                      className="flex-1 py-3 rounded-xl border border-error/30 text-error text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                    >
                      <Trash2 className="w-4 h-4" /> Alle löschen
                    </button>
                  </div>
                </>
              )}

              {/* Notes section */}
              {Object.keys(exerciseNotes).length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-secondary">
                      Notizen ({Object.keys(exerciseNotes).length})
                    </span>
                    <button onClick={copyAllNotes}
                      className="text-[10px] flex items-center gap-1 text-primary hover:underline font-bold">
                      <Copy className="w-3 h-3" /> Alle kopieren
                    </button>
                  </div>
                  {Object.entries(exerciseNotes).map(([id, note]) => (
                    <div key={id} className="bg-surface border border-surface-2 rounded-xl p-3">
                      <div className="text-[10px] font-mono text-primary mb-1">{id}</div>
                      <div className="text-xs text-text-secondary leading-relaxed">{note}</div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ══════════ IMPORT VIEW ══════════ */}
          {view === 'import' && (
            <motion.div key="import"
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.18 }}
              className="flex flex-col gap-4"
            >
              {/* Live counter */}
              {validated.length > 0 && (
                <div className="flex items-center gap-2 p-3 bg-surface rounded-xl border border-surface-2">
                  <span className="text-xs text-text-secondary flex-1">Erkannt:</span>
                  {validCount > 0   && <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-success/20 text-success"><CheckCircle2 className="w-3 h-3"/>{validCount} ok</span>}
                  {warnCount > 0    && <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-hint/20 text-hint"><AlertTriangle className="w-3 h-3"/>{warnCount} warn</span>}
                  {invalidCount > 0 && <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-error/20 text-error"><AlertCircle className="w-3 h-3"/>{invalidCount} fehler</span>}
                </div>
              )}

              {/* Textarea */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-secondary">
                  KI-Text einfügen
                </span>
                <textarea
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder={"ID: b_01\nMODUS: SYNTAX_BUILDER\nTHEMA: Variablen\n...\n---\nID: b_02\n..."}
                  className="w-full h-48 bg-surface-2 border border-surface-2 rounded-xl p-4 font-mono text-xs focus:ring-2 focus:ring-primary outline-none resize-none text-white"
                />
              </div>

              {/* Per-task validation */}
              {validated.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-secondary">
                    Validierung
                  </span>
                  {validated.map((v, i) => (
                    <div key={i}
                      className={`bg-surface rounded-xl border border-surface-2 p-3 flex items-start justify-between gap-3 ${
                        v.status === 'valid'   ? 'border-l-2 border-l-success' :
                        v.status === 'warning' ? 'border-l-2 border-l-hint'   :
                        'border-l-2 border-l-error'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-mono font-bold mb-1">{v.id}</div>
                        {v.errors.map((e, j) => (
                          <div key={j} className="text-[11px] text-error">✗ {e}</div>
                        ))}
                        {v.warnings.map((w, j) => (
                          <div key={j} className="text-[11px] text-hint">⚠ {w}</div>
                        ))}
                        {v.status === 'valid' && (
                          <div className="text-[11px] text-success">✓ Bereit zum Import</div>
                        )}
                      </div>
                      <StatusBadge status={v.status} />
                    </div>
                  ))}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-2">
                {importable > 0 && (
                  <button
                    onClick={() => setView('preview')}
                    className="flex-1 bg-surface-2 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform text-sm"
                  >
                    <Eye className="w-4 h-4" /> Vorschau ({importable})
                  </button>
                )}
                <button
                  onClick={handleImport}
                  disabled={importable === 0}
                  className="flex-1 bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-40 text-sm"
                >
                  <Download className="w-4 h-4" /> Importieren
                </button>
              </div>

              {/* KI Prompt helper */}
              <div className="bg-surface border border-primary/20 rounded-xl p-4">
                <button
                  onClick={() => setShowPrompt(p => !p)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-primary">
                    KI-Prompt für neue Aufgaben
                  </span>
                  {showPrompt ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-primary" />}
                </button>
                {showPrompt && (
                  <div className="mt-3">
                    <pre className="text-[10px] font-mono text-text-secondary bg-surface-2 rounded-lg p-3 whitespace-pre-wrap leading-relaxed">
                      {KI_PROMPT}
                    </pre>
                    <button
                      onClick={copyPrompt}
                      className="mt-2 w-full py-2 rounded-lg bg-primary/10 text-primary text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition-transform"
                    >
                      <Copy className="w-3 h-3" /> Prompt kopieren
                    </button>
                  </div>
                )}
              </div>

              {/* Format guide */}
              <div className="bg-surface border border-surface-2 rounded-xl">
                <button
                  onClick={() => setShowGuide(p => !p)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-text-secondary">
                    Format-Anleitung
                  </span>
                  {showGuide ? <ChevronUp className="w-4 h-4 text-text-secondary" /> : <ChevronDown className="w-4 h-4 text-text-secondary" />}
                </button>
                {showGuide && (
                  <div className="px-4 pb-4 space-y-3 text-xs text-text-secondary">
                    <div className="bg-surface-2 rounded-lg p-3 font-mono text-[10px] leading-relaxed">
                      {`ID: b_01\nMODUS: SYNTAX_BUILDER\nTHEMA: Variablen\nBESCHREIBUNG: ...\nSTARTCODE:\n\`\`\`kotlin\n\n\`\`\`\nHINT1_STRUKTUR: ... ... = ...\nHINT2_ANKER: val name = ...\nHINT3_KONTEXT:\n\`\`\`kotlin\n___ name = "..." // Keyword?\n\`\`\`\nLOESUNG:\n\`\`\`kotlin\nval name = "Kotlin"\n\`\`\``}
                    </div>
                    <p>Mehrere Aufgaben mit <code className="bg-surface-2 px-1 rounded">---</code> trennen.</p>
                    <p>Doppelte IDs werden erkannt und als Fehler markiert.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ══════════ PREVIEW VIEW ══════════ */}
          {view === 'preview' && (
            <motion.div key="preview"
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.18 }}
              className="flex flex-col gap-4"
            >
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-secondary px-1">
                {importable} Aufgaben werden importiert
              </div>

              {validated.filter(v => v.status !== 'invalid').map((v, i) => (
                <div key={i} className="bg-surface border border-surface-2 rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary block mb-1">
                        {v.rawData['MODUS'] || 'SYNTAX_BUILDER'}
                      </span>
                      <div className="text-sm font-bold">{v.rawData['THEMA']}</div>
                      <div className="text-[10px] font-mono text-text-secondary mt-0.5">{v.id}</div>
                    </div>
                    {v.status === 'warning' && <StatusBadge status="warning" />}
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed">{v.rawData['BESCHREIBUNG']}</p>

                  {v.rawData['STARTCODE'] && v.rawData['STARTCODE'].replace(/```kotlin|```/g, '').trim() && (
                    <div>
                      <div className="text-[10px] font-mono text-text-secondary mb-1">Startcode</div>
                      <div className="bg-surface-2 border border-surface-2 rounded-lg p-2 font-mono text-[11px] text-text-secondary">
                        {v.rawData['STARTCODE'].replace(/```kotlin|```/g, '').trim()}
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="text-[10px] font-mono text-text-secondary mb-2">Hints</div>
                    <div className="flex flex-col gap-1.5">
                      {(['HINT1_STRUKTUR', 'HINT2_ANKER', 'HINT3_KONTEXT'] as const).map((k, hi) => (
                        v.rawData[k] && (
                          <div key={k}
                            className="bg-surface-2 rounded-lg p-2 font-mono text-[11px]"
                            style={{ color: hi === 0 ? 'var(--color-hint)' : hi === 1 ? '#fb923c' : '#f87171' }}
                          >
                            {v.rawData[k].replace(/```kotlin|```/g, '').trim()}
                          </div>
                        )
                      ))}
                    </div>
                  </div>

                  {v.rawData['LOESUNG'] && (
                    <div>
                      <div className="text-[10px] font-mono text-text-secondary mb-1">Lösung</div>
                      <div className="bg-success/20 border border-success/30 rounded-lg p-2 font-mono text-[11px] text-success">
                        {v.rawData['LOESUNG'].replace(/```kotlin|```/g, '').trim()}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <button
                onClick={handleImport}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <Download className="w-5 h-5" />
                {importable} Aufgaben importieren
              </button>
            </motion.div>
          )}

          {/* ══════════ EDITOR VIEW ══════════ */}
          {view === 'editor' && (
            <motion.div key="editor"
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.18 }}
              className="flex flex-col gap-4"
            >
              {/* ID + Thema row */}
              <div className="flex gap-3">
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-secondary">
                    ID *
                  </label>
                  <input
                    className={`w-full bg-surface-2 border rounded-xl px-3 py-2.5 font-mono text-sm outline-none focus:ring-2 focus:ring-primary text-white ${editorErrors.id ? 'border-error' : 'border-surface-2'}`}
                    placeholder="b_01"
                    value={editorData.id}
                    onChange={e => setEditorData(p => ({ ...p, id: e.target.value }))}
                  />
                  {editorErrors.id && <span className="text-[10px] text-error">{editorErrors.id}</span>}
                </div>
                <div className="flex flex-col gap-1 flex-[1.6]">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-secondary">
                    Thema
                  </label>
                  <select
                    className="w-full bg-surface-2 border border-surface-2 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary text-white"
                    value={editorData.conceptId}
                    onChange={e => setEditorData(p => ({ ...p, conceptId: e.target.value }))}
                  >
                    {KOTLIN_TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              {/* Beschreibung */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-secondary">
                  Aufgabentext *
                </label>
                <textarea
                  rows={3}
                  className={`w-full bg-surface-2 border rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-primary resize-none text-white ${editorErrors.task ? 'border-error' : 'border-surface-2'}`}
                  placeholder="Deklariere eine unveränderliche Variable score mit dem Wert 10."
                  value={editorData.task}
                  onChange={e => setEditorData(p => ({ ...p, task: e.target.value }))}
                />
                {editorErrors.task && <span className="text-[10px] text-error">{editorErrors.task}</span>}
              </div>

              {/* Startcode */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-secondary">
                  Startcode <span className="font-normal normal-case">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  className="w-full bg-surface-2 border border-surface-2 rounded-xl p-3 font-mono text-xs outline-none focus:ring-2 focus:ring-primary resize-none text-white"
                  placeholder="val data = listOf(10, 20, 30)"
                  value={editorData.initialCode}
                  onChange={e => setEditorData(p => ({ ...p, initialCode: e.target.value }))}
                />
              </div>

              <div className="h-px bg-surface-2" />

              {/* Hints */}
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-secondary">Hints</div>

              {([
                { key: 'level1' as const, label: 'Hint 1 – Struktur *', placeholder: '... ... = ...', color: 'text-hint', err: 'h1' },
                { key: 'level2' as const, label: 'Hint 2 – Anker',      placeholder: 'val score = ...', color: 'text-orange-500' },
                { key: 'level3' as const, label: 'Hint 3 – Kontext (Code)', placeholder: '___ score = 10 // kein var', color: 'text-error', mono: true },
              ]).map(h => (
                <div key={h.key} className="flex flex-col gap-1">
                  <label className={`text-[10px] font-mono font-bold uppercase tracking-widest ${h.color}`}>
                    {h.label}
                  </label>
                  <input
                    className={`w-full bg-surface-2 border rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary text-white ${h.mono ? 'font-mono text-xs' : 'text-sm'} ${h.err && editorErrors[h.err] ? 'border-error' : 'border-surface-2'}`}
                    placeholder={h.placeholder}
                    value={editorData.hints[h.key]}
                    onChange={e => updateHint(h.key, e.target.value)}
                  />
                  {h.err && editorErrors[h.err] && (
                    <span className="text-[10px] text-error">{editorErrors[h.err]}</span>
                  )}
                </div>
              ))}

              <div className="h-px bg-surface-2" />

              {/* Lösung */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-success">
                  Lösung *
                </label>
                <textarea
                  rows={2}
                  className={`w-full bg-surface-2 border rounded-xl p-3 font-mono text-xs outline-none focus:ring-2 focus:ring-primary resize-none text-success ${editorErrors.solution ? 'border-error' : 'border-surface-2'}`}
                  placeholder="val score = 10"
                  value={editorData.solution}
                  onChange={e => setEditorData(p => ({ ...p, solution: e.target.value }))}
                />
                {editorErrors.solution && <span className="text-[10px] text-error">{editorErrors.solution}</span>}
              </div>

              {/* Live preview */}
              {(editorData.task || editorData.solution) && (
                <div className="bg-surface border border-primary/20 rounded-xl p-4 flex flex-col gap-2">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary">
                    Vorschau
                  </div>
                  {editorData.task && (
                    <p className="text-xs text-text-secondary">{editorData.task}</p>
                  )}
                  {editorData.initialCode && (
                    <div className="bg-surface-2 rounded-lg p-2 font-mono text-[11px] text-text-secondary">
                      {editorData.initialCode}
                    </div>
                  )}
                  {editorData.hints.level1 && (
                    <div className="bg-surface-2 rounded-lg p-2 font-mono text-[11px] text-hint">
                      {editorData.hints.level1}
                    </div>
                  )}
                  {editorData.solution && (
                    <div className="bg-success/20 border border-success/30 rounded-lg p-2 font-mono text-[11px] text-success">
                      {editorData.solution}
                    </div>
                  )}
                </div>
              )}

              {/* Save */}
              <button
                onClick={handleEditorSave}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <Save className="w-5 h-5" />
                {editingId ? 'Änderungen speichern' : 'Aufgabe erstellen'}
              </button>

              {editingId && (
                <button
                  onClick={() => setConfirmDeleteId(editingId)}
                  className="w-full py-3 rounded-xl border border-error/30 text-error text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <Trash2 className="w-4 h-4" /> Aufgabe löschen
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-xl text-sm font-bold shadow-2xl z-50 whitespace-nowrap flex items-center gap-2 ${
              toast.type === 'error' ? 'bg-error/20 text-error border border-error/30' :
              toast.type === 'warn'  ? 'bg-hint/20 text-hint border border-hint/20'  :
              'bg-success/20 text-success border border-success/30'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Confirm Modals ── */}
      <ConfirmModal
        isOpen={confirmDeleteAll}
        onClose={() => setConfirmDeleteAll(false)}
        onConfirm={() => { clearCustomTasks(); setConfirmDeleteAll(false); showToast('Alle gelöscht.', 'warn'); }}
        title="Alle löschen?"
        message="Alle importierten Aufgaben werden unwiderruflich gelöscht."
        confirmText="Alle löschen"
        type="danger"
      />
      <ConfirmModal
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={() => {
          if (confirmDeleteId) {
            removeCustomTask(confirmDeleteId);
            showToast('Aufgabe gelöscht.', 'warn');
            if (view === 'editor') setView('list');
          }
          setConfirmDeleteId(null);
        }}
        title="Aufgabe löschen?"
        message={`Aufgabe '${confirmDeleteId}' wird unwiderruflich gelöscht.`}
        confirmText="Löschen"
        type="danger"
      />
    </div>
  );
};
