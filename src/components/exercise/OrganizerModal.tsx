import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckSquare, Square, Layers, ArrowRight, ArrowLeft, Plus } from 'lucide-react';
import { useLearningStore } from '../../store/useLearningStore';

interface OrganizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  spaceId: string;
}

export const OrganizerModal = ({ isOpen, onClose, spaceId }: OrganizerModalProps) => {
  const { customTasks, decks, moveTasksToDeck, addDeck } = useLearningStore();
  const [activeTab, setActiveTab] = useState<'unorganized' | 'all'>('unorganized');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [view, setView] = useState<'select' | 'assign'>('select');
  const [newDeckTitle, setNewDeckTitle] = useState('');

  const unorganizedTasks = useMemo(() => {
    return customTasks.filter(task => 
      !decks.some(deck => deck.exercises.some(e => e.id === task.id))
    );
  }, [customTasks, decks]);

  const displayedTasks = activeTab === 'unorganized' ? unorganizedTasks : customTasks;

  const toggleSelection = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const selectAll = () => {
    if (selectedIds.size === displayedTasks.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(displayedTasks.map(t => t.id)));
    }
  };

  const handleAssignToExisting = (deckId: string) => {
    moveTasksToDeck(Array.from(selectedIds), deckId);
    setSelectedIds(new Set());
    setView('select');
    onClose();
  };

  const handleCreateNewDeck = () => {
    if (!newDeckTitle.trim()) return;
    const newDeckId = `deck_${Date.now()}`;
    addDeck({
      id: newDeckId,
      spaceId: spaceId,
      title: newDeckTitle.trim(),
      description: 'Benutzerdefiniertes Deck',
      exercises: [],
      createdAt: new Date().toISOString()
    });
    moveTasksToDeck(Array.from(selectedIds), newDeckId);
    setSelectedIds(new Set());
    setNewDeckTitle('');
    setView('select');
    onClose();
  };

  // Reset view when closing
  const handleClose = () => {
    setView('select');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background/80 backdrop-blur-md">
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="flex-1 mt-12 bg-surface border-t border-surface-2 rounded-t-3xl flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-surface-2 shrink-0">
          <div className="flex items-center gap-3">
            {view === 'assign' && (
              <button onClick={() => setView('select')} className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-2 text-text-secondary hover:text-white transition-colors">
                <ArrowLeft size={16} />
              </button>
            )}
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">{view === 'assign' ? 'Deck auswählen' : 'Aufgaben organisieren'}</h2>
              <p className="text-xs text-text-secondary mt-1">{view === 'assign' ? `${selectedIds.size} Aufgaben verschieben` : 'Verschiebe Aufgaben in Decks'}</p>
            </div>
          </div>
          <button onClick={handleClose} className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-text-secondary hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {view === 'select' ? (
          <>
            {/* Tabs */}
        <div className="flex items-center gap-4 px-5 pt-4 shrink-0">
          <button 
            onClick={() => setActiveTab('unorganized')}
            className={`text-sm font-bold pb-2 border-b-2 transition-colors ${activeTab === 'unorganized' ? 'border-primary text-primary' : 'border-transparent text-text-secondary'}`}
          >
            Inbox ({unorganizedTasks.length})
          </button>
          <button 
            onClick={() => setActiveTab('all')}
            className={`text-sm font-bold pb-2 border-b-2 transition-colors ${activeTab === 'all' ? 'border-primary text-primary' : 'border-transparent text-text-secondary'}`}
          >
            Alle Aufgaben ({customTasks.length})
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-5 pb-32 flex flex-col gap-3">
          <div className="flex items-center justify-between px-1 mb-2">
            <button onClick={selectAll} className="text-xs font-bold text-text-secondary hover:text-white flex items-center gap-2 transition-colors">
              {selectedIds.size === displayedTasks.length && displayedTasks.length > 0 ? <CheckSquare size={14} className="text-primary" /> : <Square size={14} />}
              Alle auswählen
            </button>
            <span className="text-[10px] font-mono text-text-secondary">
              {selectedIds.size} ausgewählt
            </span>
          </div>

          {displayedTasks.length === 0 ? (
            <div className="text-center py-10 opacity-60">
              <div className="text-3xl mb-2">📥</div>
              <div className="text-sm font-bold">Keine Aufgaben hier</div>
            </div>
          ) : (
            displayedTasks.map(task => {
              const isSelected = selectedIds.has(task.id);
              // Find if task is in a deck
              const deckInfo = decks.find(d => d.exercises.some(e => e.id === task.id));
              
              return (
                <button
                  key={task.id}
                  onClick={() => toggleSelection(task.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${isSelected ? 'bg-primary/10 border-primary text-white' : 'bg-surface-2 border-transparent text-text-secondary hover:border-surface-2 hover:bg-surface-2/80'}`}
                >
                  <div className="shrink-0">
                    {isSelected ? <CheckSquare size={18} className="text-primary" /> : <Square size={18} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold truncate text-white">{task.conceptId}</div>
                    <div className="text-xs opacity-70 truncate">{task.task}</div>
                  </div>
                  {deckInfo && (
                    <div className="shrink-0 flex items-center gap-1 px-2 py-1 bg-surface rounded-md border border-surface-2">
                      <Layers size={10} className="opacity-60" />
                      <span className="text-[9px] font-mono opacity-80 max-w-[80px] truncate">{deckInfo.title}</span>
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>

            {/* Action Footer */}
            <AnimatePresence>
              {selectedIds.size > 0 && (
                <motion.div 
                  initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
                  className="absolute bottom-0 left-0 right-0 p-5 bg-surface border-t border-surface-2 shadow-[0_-20px_40px_rgba(0,0,0,0.5)]"
                >
                  <button 
                    onClick={() => setView('assign')}
                    className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                  >
                    In Deck verschieben <ArrowRight size={18} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 pb-32 flex flex-col gap-6">
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-secondary mb-3">Neues Deck erstellen</div>
              <div className="flex gap-2">
                <input 
                  value={newDeckTitle}
                  onChange={(e) => setNewDeckTitle(e.target.value)}
                  placeholder="Deck Name (z.B. Collections)"
                  className="flex-1 bg-surface-2 border border-surface-2 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors text-white"
                />
                <button 
                  onClick={handleCreateNewDeck}
                  disabled={!newDeckTitle.trim()}
                  className="bg-primary text-white px-4 rounded-xl font-bold disabled:opacity-50 flex items-center gap-2"
                >
                  <Plus size={18} /> Erstellen
                </button>
              </div>
            </div>

            {decks.filter(d => d.spaceId === spaceId).length > 0 && (
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-secondary mb-3">Oder in bestehendes Deck</div>
                <div className="flex flex-col gap-2">
                  {decks.filter(d => d.spaceId === spaceId).map(deck => (
                    <button 
                      key={deck.id}
                      onClick={() => handleAssignToExisting(deck.id)}
                      className="w-full bg-surface-2 border border-surface-2 rounded-xl p-4 flex items-center gap-3 text-left hover:border-primary/50 transition-colors"
                    >
                      <Layers size={20} className="text-primary/70" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white truncate">{deck.title}</div>
                        <div className="text-xs text-text-secondary">{deck.exercises.length} Aufgaben</div>
                      </div>
                      <ArrowRight size={16} className="text-text-secondary opacity-50 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
