import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Star, Zap, ChevronLeft, ChevronRight, Download, Shuffle, LayoutGrid, BookOpen, Layers, Settings2, Play } from 'lucide-react';
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
  const { totalXP, streak, totalExercises, customTasks, progress, getConceptMastery } = useLearningStore();

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

  // ── Render ─────────────────────────────────────────────────────────────────
  
  // Logic to find a next task could be complex. For now, we just pick the first uncompleted topic or custom task.
  const handleQuickStart = () => {
    // Basic fallback: just start the first topic
    onStartTopic(TOPICS[0].id);
  };

  return (
    <div className="flex flex-col gap-5 pt-6 min-h-screen bg-background px-4">
      {/* ── Header ── */}
      <div>
        <div className="text-[10px] font-mono text-text-secondary uppercase tracking-widest mb-1">
          Kotlin Master
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">Dashboard</h1>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="flex flex-col gap-6 pb-12"
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

        {/* Quick Start Button */}
        <button
          onClick={handleQuickStart}
          className="w-full bg-primary text-white p-6 rounded-2xl shadow-xl shadow-primary/20 flex flex-col gap-3 active:scale-95 transition-transform relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <Play size={80} />
          </div>
          <div className="relative z-10 text-left">
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/70 mb-1">Empfohlen für heute</div>
            <div className="text-2xl font-bold">Weiter lernen</div>
            <div className="text-sm mt-1 opacity-90">Setze deine aktuelle Lektion fort.</div>
          </div>
        </button>

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
    </div>
  );
};
