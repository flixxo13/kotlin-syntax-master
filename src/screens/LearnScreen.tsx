import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Download, LayoutGrid, BookOpen, Layers, Settings2 } from 'lucide-react';
import { TOPICS } from '../data/topics';
import { useLearningStore } from '../store/useLearningStore';
import type { Space } from '../types';
import { OrganizerModal } from '../components/exercise/OrganizerModal';

interface LearnScreenProps {
  onStartTopic: (topicId: string) => void;
  onStartCustomTask: (taskId: string, deckId?: string) => void;
  onGoToImport: () => void;
}

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

export const LearnScreen = ({ onStartTopic, onStartCustomTask, onGoToImport }: LearnScreenProps) => {
  const { customTasks, progress, getConceptMastery, spaces, decks } = useLearningStore();
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
  const [isOrganizerOpen, setIsOrganizerOpen] = useState(false);

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

  const renderOverview = () => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col gap-6 px-4 pb-12"
    >
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

    const unorganizedTasks = customTasks.filter(task => 
      !decks.some(deck => deck.exercises.some(e => e.id === task.id))
    );
    const hasInbox = space.id === 'custom' && unorganizedTasks.length > 0;

    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }} 
        animate={{ opacity: 1, x: 0 }} 
        exit={{ opacity: 0, x: 20 }}
        className="flex flex-col gap-6 px-4 pb-12"
      >
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

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-secondary">
              Verfügbare Decks
            </div>
            {space.id === 'custom' && (customTasks.length > 0) && (
              <button 
                onClick={() => setIsOrganizerOpen(true)}
                className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary flex items-center gap-1 hover:opacity-80 transition-opacity"
              >
                <Settings2 className="w-3 h-3" /> Organisieren
              </button>
            )}
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
            decks.filter(d => d.spaceId === space.id).length === 0 && !hasInbox ? (
              <div className="flex flex-col items-center gap-4 py-12 text-center opacity-60">
                <div className="text-4xl">📂</div>
                <div className="text-xs">In diesem Bereich sind noch keine Decks.</div>
                <button onClick={onGoToImport} className="text-xs text-primary font-bold">Jetzt Aufgaben importieren</button>
              </div>
            ) : (
              <>
                {hasInbox && (
                  <DeckCard 
                    key="inbox" 
                    deck={{ title: '📥 Unorganisierte Aufgaben' }} 
                    mastery={0} 
                    exerciseCount={unorganizedTasks.length} 
                    onClick={() => onStartCustomTask(unorganizedTasks[0].id)} 
                  />
                )}
                {decks.filter(d => d.spaceId === space.id).map(deck => {
                  const completedCount = deck.exercises.filter(e => progress[e.id]?.completed).length;
                  const mastery = Math.round((completedCount / deck.exercises.length) * 100);
                  return (
                    <DeckCard 
                      key={deck.id} 
                      deck={deck} 
                      mastery={mastery} 
                      exerciseCount={deck.exercises.length} 
                      onClick={() => onStartCustomTask(deck.exercises[0].id, deck.id)} 
                    />
                  );
                })}
              </>
            )
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col gap-5 pt-6 min-h-screen bg-background">
      {!selectedSpaceId && (
        <div className="px-5">
          <div className="text-[10px] font-mono text-text-secondary uppercase tracking-widest mb-1">
            Bibliothek
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">Lernbereiche</h1>
        </div>
      )}

      <AnimatePresence mode="wait">
        {selectedSpaceId ? renderSpaceDetail(selectedSpaceId) : renderOverview()}
      </AnimatePresence>

      <OrganizerModal 
        isOpen={isOrganizerOpen} 
        onClose={() => setIsOrganizerOpen(false)} 
        spaceId={selectedSpaceId || 'custom'} 
      />
    </div>
  );
};
