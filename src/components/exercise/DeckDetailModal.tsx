import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Trash2, Edit2, CheckCircle2, Circle, Settings2 } from 'lucide-react';
import { useLearningStore } from '../../store/useLearningStore';

interface DeckDetailModalProps {
  isOpen: boolean;
  deckId: string | null;
  onClose: () => void;
  onStartSession: (taskId: string, deckId: string) => void;
}

export function DeckDetailModal({ isOpen, deckId, onClose, onStartSession }: DeckDetailModalProps) {
  const { decks, progress, removeTaskFromDeck, removeDeck } = useLearningStore();
  const [isEditMode, setIsEditMode] = useState(false);

  const deck = decks.find(d => d.id === deckId);

  if (!isOpen || !deck) return null;

  const exercises = deck.exercises || [];
  const completedCount = exercises.filter(e => progress[e.id]?.completed).length;
  const mastery = exercises.length > 0 ? Math.round((completedCount / exercises.length) * 100) : 0;

  // Weaknesses = not completed or difficulty > easy (or simply any task that was ever rated medium/hard)
  const weakTasks = exercises.filter(e => {
    const p = progress[e.id];
    if (!p || !p.completed) return true;
    return p.difficulty === 'hard' || p.difficulty === 'medium';
  });

  const handleStartAll = () => {
    if (exercises.length === 0) return;
    onClose();
    // Assuming starting the first one initiates the queue for the whole deck
    onStartSession(exercises[0].id, deck.id);
  };

  const handleStartWeaknesses = () => {
    if (weakTasks.length === 0) return;
    onClose();
    // In a real app we might pass a filter array. For now we just start the first weak task
    onStartSession(weakTasks[0].id, deck.id);
  };

  const handleDeleteDeck = () => {
    if (window.confirm('Deck wirklich löschen? Die Aufgaben landen in der Inbox.')) {
      removeDeck(deck.id);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[900]"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 top-[10%] bg-background rounded-t-[32px] border border-surface-2 shadow-2xl z-[901] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-surface-2 bg-surface flex flex-col shrink-0 relative">
              <div className="w-12 h-1 bg-surface-2 rounded-full mx-auto mb-6" />
              
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-surface-2 text-text-secondary active:scale-95"
              >
                <X size={18} />
              </button>

              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-1 pr-10">{deck.title}</h2>
                  <p className="text-sm text-text-secondary">{exercises.length} Aufgaben • {mastery}% gemeistert</p>
                </div>
                <button 
                  onClick={() => setIsEditMode(!isEditMode)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                    isEditMode ? 'bg-primary text-white' : 'bg-surface-2 text-text-secondary'
                  }`}
                >
                  <Edit2 size={14} /> {isEditMode ? 'Fertig' : 'Bearbeiten'}
                </button>
              </div>

              {/* Start Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleStartAll}
                  disabled={exercises.length === 0}
                  className="flex-2 bg-primary text-white h-12 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50 transition-all flex-grow"
                >
                  <Play fill="currentColor" size={16} /> Deck lernen
                </button>
                {weakTasks.length > 0 && weakTasks.length < exercises.length && (
                  <button
                    onClick={handleStartWeaknesses}
                    className="flex-1 bg-surface-2 border border-surface-2 text-text-primary h-12 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all px-4"
                  >
                    ⚡ Schwächen
                  </button>
                )}
              </div>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
              <div className="px-2 text-xs font-mono font-bold uppercase tracking-widest text-text-secondary mb-2 flex justify-between">
                <span>Aufgaben ({exercises.length})</span>
              </div>

              {exercises.length === 0 ? (
                <div className="text-center py-10 opacity-50">
                  <div className="text-4xl mb-3">📭</div>
                  <div className="text-sm">Keine Aufgaben im Deck.</div>
                </div>
              ) : (
                exercises.map((task) => {
                  const p = progress[task.id];
                  const isCompleted = p?.completed;
                  return (
                    <div 
                      key={task.id}
                      className="bg-surface border border-surface-2 rounded-xl p-3 flex items-center gap-3"
                    >
                      {isEditMode ? (
                        <button
                          onClick={() => removeTaskFromDeck(task.id, deck.id)}
                          className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center shrink-0 active:scale-90"
                          title="Aus Deck entfernen"
                        >
                          <Trash2 size={16} />
                        </button>
                      ) : (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          isCompleted ? 'bg-green-500/20 text-green-500' : 'bg-surface-2 text-text-secondary'
                        }`}>
                          {isCompleted ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-text-primary truncate">
                          {task.conceptId}
                        </div>
                        <div className="text-xs text-text-secondary truncate mt-0.5">
                          {task.initialCode || 'Code lesen'}
                        </div>
                      </div>

                      {p?.difficulty && (
                        <div className="text-[10px] font-mono px-2 py-1 rounded bg-surface-2 text-text-secondary shrink-0">
                          {p.difficulty === 'easy' ? '🟢' : p.difficulty === 'medium' ? '🟡' : '🔴'}
                        </div>
                      )}
                    </div>
                  );
                })
              )}

              {/* Danger Zone */}
              {isEditMode && (
                <div className="mt-8 pt-6 border-t border-red-500/20">
                  <button
                    onClick={handleDeleteDeck}
                    className="w-full h-12 rounded-xl border border-red-500/30 text-red-500 font-bold flex items-center justify-center gap-2 hover:bg-red-500/10 active:scale-95"
                  >
                    <Trash2 size={18} /> Deck auflösen
                  </button>
                  <p className="text-center text-xs text-text-secondary mt-3">
                    Die Aufgaben gehen nicht verloren, sondern landen in der Inbox.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
