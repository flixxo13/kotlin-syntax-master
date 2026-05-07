import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Star, Zap, ChevronLeft, ChevronRight, Download, Shuffle, LayoutGrid, BookOpen, Layers } from 'lucide-react';
import { TOPICS } from '../data/topics';
import { useLearningStore } from '../store/useLearningStore';
import type { Exercise, ExerciseDifficulty, Space, Deck } from '../types';

// ─── UTILS ────────────────────────────────────────────────────────────────────
function relativeDate(iso?: string): string {
  if (!iso) return 'Noch nie';
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (diff === 0) return 'Heute';
  if (diff === 1) return 'Gestern';
  if (diff < 7) return `Vor ${diff} Tg.`;
  return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
}

const DIFF: Record<ExerciseDifficulty, { emoji: string; color: string }> = {
  easy: { emoji: '🟢', color: '#4ade80' },
  medium: { emoji: '🟡', color: '#fbbf24' },
  hard: { emoji: '🔴', color: '#f87171' },
};

const TOPIC_ICONS: Record<string, string> = {
  BookOpen: '📖', Variable: '𝑥', Function: 'ƒ', Null: '∅',
  When: '⇒', Loop: '↺', List: '[]', Class: '◻', Lambda: 'λ', default: '◆',
};

// ─── PROPS ────────────────────────────────────────────────────────────────────
interface HomeScreenProps {
  onStartTopic: (topicId: string) => void;
  onStartCustomTask: (taskId: string) => void;
  onGoToImport: () => void;
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function SpaceCard({ space, mastery, deckCount, onClick }: { space: Space, mastery: number, deckCount: number, onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full bg-surface border border-surface-2 rounded-2xl p-4 flex items-center gap-4 text-left shadow-sm hover:border-primary/30 transition-colors"
    >
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
        style={{ background: `${space.color}22`, color: space.color }}
      >
        {space.icon === 'BookOpen' ? <BookOpen /> : space.icon === 'Download' ? <Download /> : <LayoutGrid />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold text-text-primary">{space.title}</div>
        <div className="text-[11px] text-text-secondary truncate">{space.description}</div>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 h-1 bg-surface-2 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${mastery}%`, background: space.color }} />
          </div>
          <span className="text-[10px] font-mono font-bold text-text-secondary">{mastery}%</span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <ChevronRight className="w-4 h-4 text-text-secondary opacity-30" />
        <span className="text-[9px] font-mono text-text-secondary uppercase">{deckCount} Decks</span>
      </div>
    </motion.button>
  );
}

function DeckCard({ deck, mastery, exerciseCount, onClick }: { deck: any, mastery: number, exerciseCount: number, onClick: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full bg-surface border border-surface-2 rounded-xl p-3 flex items-center gap-3 text-left"
    >
      <div className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center text-primary/70 shrink-0">
        <Layers size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-bold text-text-primary truncate">{deck.title}</div>
        <div className="text-[10px] text-text-secondary truncate">{exerciseCount} Übungen</div>
        {mastery > 0 && (
          <div className="mt-1.5 h-1 bg-surface-2 rounded-full overflow-hidden w-2/3">
            <div className="h-full bg-primary" style={{ width: `${mastery}%` }} />
          </div>
        )}
      </div>
      <div className="flex flex-col items-end gap-1">
        <ChevronRight className="w-4 h-4 text-text-secondary opacity-30" />
        {mastery > 0 && <span className="text-[10px] font-mono font-bold text-primary">{mastery}%</span>}
      </div>
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export const HomeScreen = ({ onStartTopic, onStartCustomTask, onGoToImport }: HomeScreenProps) => {
  const { totalXP, streak, totalExercises, customTasks, progress, getConceptMastery, spaces, decks } = useLearningStore();
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);

  // ── Overall mastery ────────────────────────────────────────────────────────
  const allConceptIds = useMemo(() => TOPICS.flatMap(t => t.concepts.map(c => c.id)), []);
  const avgMastery = allConceptIds.length === 0 ? 0 :
    Math.round(allConceptIds.reduce((s, id) => s + getConceptMastery(id), 0) / allConceptIds.length);

  // ── Stats Row ──────────────────────────────────────────────────────────────
  const stats = [
    { icon: <Flame size={14} className="text-orange-500" />, label: 'Streak', value: streak, sub: 'Tage' },
    { icon: <Zap size={14} className="text-primary" />, label: 'XP', value: totalXP, sub: 'Punkte' },
    { icon: <Star size={14} className="text-yellow-500" />, label: 'Mastery', value: `${avgMastery}%`, sub: `${totalExercises} gelöst` },
  ];

  // ── Space Data ─────────────────────────────────────────────────────────────
  const spaceData = useMemo(() => {
    return spaces.map(space => {
      let mastery = 0;
      let deckCount = 0;

      if (space.id === 'system') {
        deckCount = TOPICS.length;
        const total = TOPICS.reduce((sum, topic) => {
          const tm = topic.concepts.length === 0 ? 0 :
            Math.round(topic.concepts.reduce((s, c) => s + getConceptMastery(c.id), 0) / topic.concepts.length);
          return sum + tm;
        }, 0);
        mastery = Math.round(total / deckCount);
      } else {
        const spaceDecks = decks.filter(d => d.spaceId === space.id);
        deckCount = spaceDecks.length;
        if (deckCount > 0) {
          const total = spaceDecks.reduce((sum, deck) => {
            const completedCount = deck.exercises.filter(e => progress[e.id]?.completed).length;
            const dm = Math.round((completedCount / deck.exercises.length) * 100);
            return sum + dm;
          }, 0);
          mastery = Math.round(total / deckCount);
        }
      }

      return { space, mastery, deckCount };
    });
  }, [spaces, decks, getConceptMastery, progress]);

  // ── Render Helpers ─────────────────────────────────────────────────────────

  const renderOverview = () => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col gap-6 px-4 pb-12"
    >
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mt-2">
        {stats.map(({ icon, label, value, sub }) => (
          <div key={label} className="bg-surface border border-surface-2 rounded-2xl p-3 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 opacity-60">
              {icon}
              <span className="text-[9px] font-mono uppercase tracking-widest">{label}</span>
            </div>
            <div className="text-xl font-bold leading-none mt-1">{value}</div>
            <div className="text-[9px] text-text-secondary">{sub}</div>
          </div>
        ))}
      </div>

      {/* Spaces Header */}
      <div>
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-secondary mb-3 px-1">
          Lernbereiche
        </div>
        <div className="flex flex-col gap-3">
          {spaceData.map(data => (
            <SpaceCard 
              key={data.space.id} 
              {...data} 
              onClick={() => setSelectedSpaceId(data.space.id)} 
            />
          ))}
        </div>
      </div>

      {/* Import Shortcut */}
      {customTasks.length === 0 && (
        <button
          onClick={onGoToImport}
          className="w-full py-10 border-2 border-dashed border-surface-2 rounded-2xl flex flex-col items-center gap-3 text-text-secondary hover:text-primary hover:border-primary/30 transition-colors"
        >
          <div className="text-3xl">📥</div>
          <div className="text-xs font-bold">Eigene Aufgaben importieren</div>
        </button>
      )}
    </motion.div>
  );

  const renderSpaceDetail = (spaceId: string) => {
    const space = spaces.find(s => s.id === spaceId);
    if (!space) return null;

    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }} 
        animate={{ opacity: 1, x: 0 }} 
        exit={{ opacity: 0, x: 20 }}
        className="flex flex-col gap-6 px-4 pb-12"
      >
        {/* Sub Header */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSelectedSpaceId(null)}
            className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-text-secondary active:scale-90 transition-transform"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-lg font-bold leading-tight">{space.title}</h2>
            <p className="text-xs text-text-secondary">{space.description}</p>
          </div>
        </div>

        {/* Decks List */}
        <div className="flex flex-col gap-3">
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-secondary px-1">
            Verfügbare Decks
          </div>
          
          {space.id === 'system' ? (
            TOPICS.map((topic) => {
              const topicMastery = topic.concepts.length === 0 ? 0 :
                Math.round(topic.concepts.reduce((s, c) => s + getConceptMastery(c.id), 0) / topic.concepts.length);
              const exerciseCount = topic.concepts.reduce((s, c) => s + c.exercises.length, 0);
              return (
                <DeckCard 
                  key={topic.id} 
                  deck={topic} 
                  mastery={topicMastery} 
                  exerciseCount={exerciseCount} 
                  onClick={() => onStartTopic(topic.id)} 
                />
              );
            })
          ) : (
            decks.filter(d => d.spaceId === space.id).length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-12 text-center opacity-60">
                <div className="text-4xl">📂</div>
                <div className="text-xs">In diesem Bereich sind noch keine Decks.</div>
                <button onClick={onGoToImport} className="text-xs text-primary font-bold">Jetzt Aufgaben importieren</button>
              </div>
            ) : (
              decks.filter(d => d.spaceId === space.id).map(deck => {
                const completedCount = deck.exercises.filter(e => progress[e.id]?.completed).length;
                const mastery = Math.round((completedCount / deck.exercises.length) * 100);
                return (
                  <DeckCard 
                    key={deck.id} 
                    deck={deck} 
                    mastery={mastery} 
                    exerciseCount={deck.exercises.length} 
                    onClick={() => onStartCustomTask(deck.exercises[0].id)} 
                  />
                );
              })
            )
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col gap-5 pt-6 min-h-screen bg-background">
      {/* ── Header ── */}
      {!selectedSpaceId && (
        <div className="px-5">
          <div className="text-[10px] font-mono text-text-secondary uppercase tracking-widest mb-1">
            Kotlin Master
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">Syntax lernen</h1>
        </div>
      )}

      {/* ── Content ── */}
      <AnimatePresence mode="wait">
        {selectedSpaceId ? renderSpaceDetail(selectedSpaceId) : renderOverview()}
      </AnimatePresence>
    </div>
  );
};
