import { BookOpen, ChevronRight, Flame, Star, Zap, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { TOPICS } from '../data/topics';
import { useLearningStore } from '../store/useLearningStore';

// ─── ICON MAP ─────────────────────────────────────────────────────────────────
const TOPIC_ICONS: Record<string, string> = {
  BookOpen:  '📖',
  Variable:  '𝑥',
  Function:  'ƒ',
  Null:      '∅',
  When:      '⇒',
  Loop:      '↺',
  List:      '[]',
  Class:     '◻',
  Lambda:    'λ',
  default:   '◆',
};

interface HomeScreenProps {
  onStartTopic:      (topicId: string) => void;
  onStartCustomTask: (taskId:  string) => void;
}

export const HomeScreen = ({ onStartTopic, onStartCustomTask }: HomeScreenProps) => {
  const { totalXP, streak, totalExercises, customTasks, getConceptMastery } = useLearningStore();

  // Calculate overall mastery from all concepts
  const allConceptIds = TOPICS.flatMap(t => t.concepts.map(c => c.id));
  const avgMastery = allConceptIds.length === 0 ? 0 :
    Math.round(
      allConceptIds.reduce((sum, id) => sum + getConceptMastery(id), 0) / allConceptIds.length
    );

  return (
    <div className="flex flex-col gap-6 p-4 pb-6">

      {/* ── Header ── */}
      <div className="pt-2">
        <div className="text-[10px] font-mono text-text-secondary uppercase tracking-widest mb-1">
          Kotlin Master
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Syntax lernen</h1>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-surface border border-surface-2 rounded-xl p-3 flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span className="text-[10px] font-mono text-text-secondary uppercase tracking-wider">Streak</span>
          </div>
          <div className="text-xl font-bold">{streak}</div>
          <div className="text-[10px] text-text-secondary">Tage</div>
        </div>

        <div className="bg-surface border border-surface-2 rounded-xl p-3 flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-mono text-text-secondary uppercase tracking-wider">XP</span>
          </div>
          <div className="text-xl font-bold">{totalXP}</div>
          <div className="text-[10px] text-text-secondary">Punkte</div>
        </div>

        <div className="bg-surface border border-surface-2 rounded-xl p-3 flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-yellow-500" />
            <span className="text-[10px] font-mono text-text-secondary uppercase tracking-wider">Mastery</span>
          </div>
          <div className="text-xl font-bold">{avgMastery}%</div>
          <div className="text-[10px] text-text-secondary">{totalExercises} gelöst</div>
        </div>
      </div>

      {/* ── Custom Tasks ── */}
      {customTasks.length > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-secondary">
              Meine Aufgaben ({customTasks.length})
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {customTasks.slice(0, 5).map((task, i) => (
              <motion.button
                key={task.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => onStartCustomTask(task.id)}
                className="w-full bg-surface border border-primary/20 rounded-xl p-3 flex items-center justify-between gap-3 active:scale-[0.98] transition-transform text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary font-mono text-sm font-bold">
                    K
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">{task.conceptId}</div>
                    <div className="text-[10px] text-text-secondary truncate">{task.task}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-text-secondary shrink-0" />
              </motion.button>
            ))}

            {customTasks.length > 5 && (
              <div className="text-center text-[11px] text-text-secondary py-1">
                +{customTasks.length - 5} weitere im Import-Tab
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Built-in Topics ── */}
      <section className="flex flex-col gap-3">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-secondary">
          Themen
        </span>

        <div className="flex flex-col gap-2">
          {TOPICS.map((topic, i) => {
            // Average mastery across topic's concepts
            const topicMastery = topic.concepts.length === 0 ? 0 :
              Math.round(
                topic.concepts.reduce((sum, c) => sum + getConceptMastery(c.id), 0) /
                topic.concepts.length
              );

            const exerciseCount = topic.concepts.reduce(
              (sum, c) => sum + c.exercises.length, 0
            );

            const icon = TOPIC_ICONS[topic.icon] || TOPIC_ICONS.default;

            return (
              <motion.button
                key={topic.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => onStartTopic(topic.id)}
                className="w-full bg-surface border border-surface-2 rounded-xl p-4 flex items-center gap-4 active:scale-[0.98] transition-transform text-left"
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center shrink-0 text-lg">
                  {icon}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold truncate">{topic.title}</div>
                  <div className="text-[11px] text-text-secondary truncate">{topic.description}</div>

                  {/* Progress bar */}
                  {topicMastery > 0 && (
                    <div className="mt-2 h-1 bg-surface-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${topicMastery}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Right side */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <ChevronRight className="w-4 h-4 text-text-secondary" />
                  <span className="text-[10px] text-text-secondary font-mono">
                    {exerciseCount} Üb.
                  </span>
                  {topicMastery > 0 && (
                    <span className="text-[10px] text-primary font-mono font-bold">
                      {topicMastery}%
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* ── Empty state if no topics and no custom ── */}
      {TOPICS.length === 0 && customTasks.length === 0 && (
        <div className="p-10 text-center text-text-secondary">
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <div className="text-sm font-bold mb-1">Noch keine Aufgaben</div>
          <div className="text-xs">Importiere Aufgaben im Import-Tab.</div>
        </div>
      )}
    </div>
  );
};
