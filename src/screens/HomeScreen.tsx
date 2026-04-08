import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Star, Zap, ChevronRight, Download, Shuffle } from 'lucide-react';
import { TOPICS } from '../data/topics';
import { useLearningStore } from '../store/useLearningStore';
import type { Exercise, ExerciseDifficulty } from '../types';

// ─── UTILS ────────────────────────────────────────────────────────────────────
function relativeDate(iso?: string): string {
  if (!iso) return 'Noch nie';
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (diff === 0) return 'Heute';
  if (diff === 1) return 'Gestern';
  if (diff <  7)  return `Vor ${diff} Tagen`;
  if (diff < 30)  return `Vor ${Math.floor(diff / 7)} Wo.`;
  return `Vor ${Math.floor(diff / 30)} Mon.`;
}

const DIFF: Record<ExerciseDifficulty, { emoji: string; color: string }> = {
  easy:   { emoji: '🟢', color: '#4ade80' },
  medium: { emoji: '🟡', color: '#fbbf24' },
  hard:   { emoji: '🔴', color: '#f87171' },
};

const TOPIC_ICONS: Record<string, string> = {
  BookOpen: '📖', Variable: '𝑥', Function: 'ƒ', Null: '∅',
  When: '⇒', Loop: '↺', List: '[]', Class: '◻', Lambda: 'λ', default: '◆',
};

// ─── PROPS ────────────────────────────────────────────────────────────────────
interface HomeScreenProps {
  onStartTopic:      (topicId: string) => void;
  onStartCustomTask: (taskId:  string) => void;
  onGoToImport:      () => void;
}

// ─── QUICK-PRACTICE CAROUSEL ──────────────────────────────────────────────────
function QuickPracticeCarousel({ tasks, onStart }: {
  tasks: Array<{ task: Exercise; pct: number; lastPracticed?: string; difficulty?: ExerciseDifficulty }>;
  onStart: (id: string) => void;
}) {
  if (tasks.length === 0) return null;
  return (
    <section>
      <div className="flex items-center justify-between mb-3 px-4">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-secondary">
          Schnell üben
        </span>
      </div>
      <div
        className="flex gap-3 overflow-x-auto pb-1 px-4"
        style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' } as any}
      >
        {tasks.map(({ task, pct, lastPracticed, difficulty }, i) => {
          const diff = difficulty ? DIFF[difficulty] : null;
          return (
            <motion.button
              key={task.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => onStart(task.id)}
              style={{ scrollSnapAlign: 'start', minWidth: 200, maxWidth: 220 }}
              className="shrink-0 bg-surface border border-surface-2 rounded-2xl p-4 flex flex-col gap-3 text-left active:scale-[.97] transition-transform"
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-mono text-sm font-bold shrink-0">
                  K
                </div>
                {diff && (
                  <span className="text-base leading-none" title={difficulty}>{diff.emoji}</span>
                )}
              </div>

              {/* Title */}
              <div>
                <div className="text-xs font-bold leading-tight line-clamp-2 text-text-primary">
                  {task.conceptId}
                </div>
                <div className="text-[10px] text-text-secondary mt-0.5 truncate">
                  {relativeDate(lastPracticed)}
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1 bg-surface-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, background: pct === 100 ? '#4ade80' : '#7f52ff' }}
                />
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

// ─── TASK CARD ENHANCED ───────────────────────────────────────────────────────
function TaskCardEnhanced({ task, pct, lastPracticed, difficulty, index, onStart }: {
  task:          Exercise;
  pct:           number;
  lastPracticed?: string;
  difficulty?:   ExerciseDifficulty;
  index:         number;
  onStart:       (id: string) => void;
}) {
  const diff = difficulty ? DIFF[difficulty] : null;
  // Mini ring: SVG circle progress
  const r = 10, circ = 2 * Math.PI * r;
  const dash = circ - (pct / 100) * circ;

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      onClick={() => onStart(task.id)}
      className="w-full bg-surface border border-surface-2 rounded-xl p-3 flex items-center gap-3 active:scale-[.98] transition-transform text-left"
    >
      {/* Left: difficulty emoji + K icon */}
      <div className="relative shrink-0">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-mono text-sm font-bold">
          K
        </div>
        {diff && (
          <span className="absolute -top-1 -right-1 text-[11px] leading-none">{diff.emoji}</span>
        )}
      </div>

      {/* Middle */}
      <div className="flex-1 min-w-0">
        <div className="text-xs font-bold truncate">{task.conceptId}</div>
        <div className="text-[11px] text-text-secondary truncate leading-snug mt-0.5">
          {task.task.length > 60 ? task.task.slice(0, 58) + '…' : task.task}
        </div>
        <div className="text-[10px] text-text-secondary mt-1 font-mono">
          {relativeDate(lastPracticed)}
        </div>
      </div>

      {/* Right: ring + chevron */}
      <div className="shrink-0 flex flex-col items-center gap-1">
        {pct > 0 ? (
          <svg width="26" height="26" viewBox="0 0 26 26">
            <circle cx="13" cy="13" r={r} fill="none" stroke="#1e1e2e" strokeWidth="3" />
            <circle
              cx="13" cy="13" r={r} fill="none"
              stroke={pct === 100 ? '#4ade80' : '#7f52ff'}
              strokeWidth="3"
              strokeDasharray={circ}
              strokeDashoffset={dash}
              strokeLinecap="round"
              transform="rotate(-90 13 13)"
            />
          </svg>
        ) : (
          <ChevronRight className="w-4 h-4 text-text-secondary" />
        )}
      </div>
    </motion.button>
  );
}

// ─── FILTER SHEET ─────────────────────────────────────────────────────────────
type DiffFilter = 'all' | ExerciseDifficulty;
type SortMode   = 'recent' | 'unsolved' | 'hard';

function FilterSheet({ diff, sort, onDiff, onSort, onClose }: {
  diff: DiffFilter; sort: SortMode;
  onDiff: (d: DiffFilter) => void; onSort: (s: SortMode) => void;
  onClose: () => void;
}) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-surface rounded-t-2xl border border-surface-2 p-5 pb-10"
      >
        <div className="w-9 h-1 bg-surface-2 rounded-full mx-auto mb-5" />

        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-secondary mb-3">
          Schwierigkeit
        </div>
        <div className="flex gap-2 mb-5">
          {(['all', 'easy', 'medium', 'hard'] as DiffFilter[]).map(d => (
            <button key={d} onClick={() => onDiff(d)}
              className={`flex-1 h-9 rounded-xl text-xs font-bold transition-all ${diff === d ? 'bg-primary/20 border border-primary/40 text-primary' : 'bg-surface-2 border border-surface-2 text-text-secondary'}`}
            >
              {d === 'all' ? 'Alle' : d === 'easy' ? '🟢' : d === 'medium' ? '🟡' : '🔴'}
            </button>
          ))}
        </div>

        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-secondary mb-3">
          Sortierung
        </div>
        <div className="flex flex-col gap-2">
          {([
            ['recent',   '🕐 Zuletzt geübt'],
            ['unsolved', '⬜ Ungelöst zuerst'],
            ['hard',     '🔴 Schwer zuerst'],
          ] as [SortMode, string][]).map(([s, label]) => (
            <button key={s} onClick={() => onSort(s)}
              className={`w-full h-10 rounded-xl text-sm font-bold text-left px-4 transition-all ${sort === s ? 'bg-primary/20 border border-primary/40 text-primary' : 'bg-surface-2 border border-surface-2 text-text-secondary'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </motion.div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOME SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
export const HomeScreen = ({ onStartTopic, onStartCustomTask, onGoToImport }: HomeScreenProps) => {
  const { totalXP, streak, totalExercises, customTasks, progress, getConceptMastery, getRandomCustomTask } =
    useLearningStore();

  const [activeTab, setActiveTab] = useState<'custom' | 'topics'>('custom');
  const [diffFilter, setDiffFilter] = useState<DiffFilter>('all');
  const [sortMode,   setSortMode]   = useState<SortMode>('recent');
  const [showFilter, setShowFilter] = useState(false);

  // ── Overall mastery ────────────────────────────────────────────────────────
  const allConceptIds = useMemo(() => TOPICS.flatMap(t => t.concepts.map(c => c.id)), []);
  const avgMastery = allConceptIds.length === 0 ? 0 :
    Math.round(allConceptIds.reduce((s, id) => s + getConceptMastery(id), 0) / allConceptIds.length);

  // ── Helper: enrich task with progress ─────────────────────────────────────
  const enrichTask = (task: Exercise) => {
    const p = progress[task.id];
    return {
      task,
      pct:           p?.completed ? 100 : 0,
      lastPracticed: p?.lastPracticed,
      difficulty:    p?.difficulty,
    };
  };

  // ── Carousel: top 5 (custom first, sorted by lastPracticed desc) ───────────
  const carouselTasks = useMemo(() => {
    const all = [...customTasks, ...TOPICS.flatMap(t => t.concepts.flatMap(c => c.exercises))];
    return all
      .map(enrichTask)
      .filter(e => e.lastPracticed) // only practiced ones
      .sort((a, b) => (b.lastPracticed ?? '').localeCompare(a.lastPracticed ?? ''))
      .slice(0, 5);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customTasks, progress]);

  // ── Filtered + sorted custom tasks ────────────────────────────────────────
  const filteredTasks = useMemo(() => {
    let list = customTasks.map(enrichTask);

    if (diffFilter !== 'all')
      list = list.filter(e => e.difficulty === diffFilter);

    if (sortMode === 'recent')
      list = list.sort((a, b) => (b.lastPracticed ?? '').localeCompare(a.lastPracticed ?? ''));
    else if (sortMode === 'unsolved')
      list = list.sort((a, b) => a.pct - b.pct);
    else if (sortMode === 'hard')
      list = list.sort((a, b) => {
        const order = { hard: 0, medium: 1, easy: 2, undefined: 3 };
        return (order[a.difficulty as keyof typeof order] ?? 3) - (order[b.difficulty as keyof typeof order] ?? 3);
      });

    return list;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customTasks, progress, diffFilter, sortMode]);

  const handleRandom = () => {
    const task = getRandomCustomTask();
    if (task) onStartCustomTask(task.id);
  };

  const activeFilterCount = (diffFilter !== 'all' ? 1 : 0) + (sortMode !== 'recent' ? 1 : 0);

  return (
    <div className="flex flex-col gap-5 pt-4 pb-28">

      {/* ── Header ── */}
      <div className="px-4">
        <div className="text-[10px] font-mono text-text-secondary uppercase tracking-widest mb-0.5">
          Kotlin Master
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Syntax lernen</h1>
      </div>

      {/* ── Stats Row (compact) ── */}
      <div className="grid grid-cols-3 gap-2 px-4">
        {[
          { icon: <Flame className="w-3 h-3 text-orange-500" />, label: 'Streak', value: streak,        sub: 'Tage'   },
          { icon: <Zap   className="w-3 h-3 text-primary"     />, label: 'XP',     value: totalXP,       sub: 'Punkte' },
          { icon: <Star  className="w-3 h-3 text-yellow-500"  />, label: 'Mastery', value: `${avgMastery}%`, sub: `${totalExercises} gelöst` },
        ].map(({ icon, label, value, sub }) => (
          <div key={label} className="bg-surface border border-surface-2 rounded-xl p-2.5 flex flex-col gap-0.5">
            <div className="flex items-center gap-1">
              {icon}
              <span className="text-[9px] font-mono text-text-secondary uppercase tracking-wider">{label}</span>
            </div>
            <div className="text-lg font-bold leading-none">{value}</div>
            <div className="text-[9px] text-text-secondary">{sub}</div>
          </div>
        ))}
      </div>

      {/* ── Quick Practice Carousel ── */}
      <QuickPracticeCarousel
        tasks={carouselTasks}
        onStart={onStartCustomTask}
      />

      {/* ── Segmented Control ── */}
      <div className="px-4">
        <div className="flex bg-surface-2 rounded-xl p-1 gap-1">
          {(['custom', 'topics'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 h-8 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab
                  ? 'bg-surface text-text-primary shadow-sm'
                  : 'text-text-secondary'
              }`}
            >
              {tab === 'custom' ? `Importiert (${customTasks.length})` : 'Themen'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <AnimatePresence mode="wait">
        {activeTab === 'custom' ? (
          <motion.div key="custom" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.15 }} className="flex flex-col gap-3 px-4">

            {customTasks.length === 0 ? (
              /* Empty state */
              <div className="flex flex-col items-center gap-4 py-12 text-center">
                <div className="text-4xl">📥</div>
                <div>
                  <div className="font-bold text-sm mb-1">Noch keine Aufgaben importiert</div>
                  <div className="text-xs text-text-secondary">Importiere KI-generierte Kotlin-Aufgaben und übe sie hier.</div>
                </div>
                <button
                  onClick={onGoToImport}
                  className="flex items-center gap-2 bg-primary/10 border border-primary/30 text-primary font-bold text-sm px-5 py-3 rounded-xl active:scale-95 transition-transform"
                >
                  <Download className="w-4 h-4" /> Jetzt importieren
                </button>
              </div>
            ) : (
              <>
                {/* Random + Filter row */}
                <div className="flex gap-2">
                  <button
                    onClick={handleRandom}
                    className="flex-1 h-11 bg-primary/10 border border-primary/30 text-primary font-bold text-sm rounded-xl flex items-center justify-center gap-2 active:scale-[.97] transition-transform"
                  >
                    <Shuffle className="w-4 h-4" />
                    Zufällige Aufgabe
                  </button>
                  <button
                    onClick={() => setShowFilter(v => !v)}
                    className={`h-11 px-4 rounded-xl font-bold text-sm flex items-center gap-1.5 border transition-all ${
                      activeFilterCount > 0
                        ? 'bg-primary/20 border-primary/40 text-primary'
                        : 'bg-surface border-surface-2 text-text-secondary'
                    }`}
                  >
                    ⚙
                    {activeFilterCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-primary text-white text-[9px] flex items-center justify-center font-bold">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                </div>

                {/* Task list */}
                {filteredTasks.length === 0 ? (
                  <div className="text-center py-8 text-sm text-text-secondary">
                    Keine Aufgaben für diesen Filter.
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {filteredTasks.map((item, i) => (
                      <TaskCardEnhanced key={item.task.id} {...item} index={i} onStart={onStartCustomTask} />
                    ))}
                  </div>
                )}
              </>
            )}
          </motion.div>
        ) : (
          /* ── Topics Tab ── */
          <motion.div key="topics" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.15 }} className="flex flex-col gap-2 px-4">
            {TOPICS.map((topic, i) => {
              const topicMastery = topic.concepts.length === 0 ? 0 :
                Math.round(topic.concepts.reduce((s, c) => s + getConceptMastery(c.id), 0) / topic.concepts.length);
              const exerciseCount = topic.concepts.reduce((s, c) => s + c.exercises.length, 0);
              const icon = TOPIC_ICONS[topic.icon] || TOPIC_ICONS.default;

              return (
                <motion.button key={topic.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  onClick={() => onStartTopic(topic.id)}
                  className="w-full bg-surface border border-surface-2 rounded-xl p-4 flex items-center gap-3 active:scale-[.98] transition-transform text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center shrink-0 text-lg">{icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold truncate">{topic.title}</div>
                    <div className="text-[11px] text-text-secondary truncate">{topic.description}</div>
                    {topicMastery > 0 && (
                      <div className="mt-1.5 h-1 bg-surface-2 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${topicMastery}%` }} />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <ChevronRight className="w-4 h-4 text-text-secondary" />
                    <span className="text-[10px] text-text-secondary font-mono">{exerciseCount} Üb.</span>
                    {topicMastery > 0 && (
                      <span className="text-[10px] text-primary font-mono font-bold">{topicMastery}%</span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Filter Sheet ── */}
      <AnimatePresence>
        {showFilter && (
          <FilterSheet
            diff={diffFilter} sort={sortMode}
            onDiff={d => setDiffFilter(d)}
            onSort={s => setSortMode(s)}
            onClose={() => setShowFilter(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
