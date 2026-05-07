import React, { useState, useEffect } from 'react';
import { motion, Reorder } from 'motion/react';
import { useLearningStore } from '../../store/useLearningStore';

interface AssignmentViewProps {
  zielCode: string;
  bausteineRichtig: string[];
  bausteineDistraktor: string[];
  onComplete: (isCorrect: boolean) => void;
  map: Record<string, string>;
  currentHintLevel?: string | number;
}

export const AssignmentView: React.FC<AssignmentViewProps> = ({
  zielCode,
  bausteineRichtig,
  bausteineDistraktor,
  onComplete,
  map,
  currentHintLevel
}) => {
  const [availableTokens, setAvailableTokens] = useState<string[]>([]);
  const [placedTokens, setPlacedTokens] = useState<Record<string, string>>({});
  const [slots, setSlots] = useState<string[]>([]);

  useEffect(() => {
    // Initialize tokens
    const allTokens = [...bausteineRichtig, ...bausteineDistraktor].sort(() => Math.random() - 0.5);
    setAvailableTokens(allTokens);

    // Find slots in zielCode
    const slotMatches = zielCode.match(/__\d+__/g) || [];
    setSlots(slotMatches);
    setPlacedTokens({});
  }, [zielCode, bausteineRichtig, bausteineDistraktor]);

  useEffect(() => {
    if (currentHintLevel === 'revealed') {
      setPlacedTokens(map);
      setAvailableTokens([]);
    }
  }, [map, currentHintLevel]);

  const handleTokenClick = (token: string) => {
    // Find first empty slot
    const firstEmptySlot = slots.find(slot => !placedTokens[slot]);
    if (firstEmptySlot) {
      setPlacedTokens(prev => ({ ...prev, [firstEmptySlot]: token }));
      setAvailableTokens(prev => {
        const index = prev.indexOf(token);
        if (index > -1) {
          const next = [...prev];
          next.splice(index, 1);
          return next;
        }
        return prev;
      });
    }
  };

  const handleSlotClick = (slot: string) => {
    const token = placedTokens[slot];
    if (token) {
      setAvailableTokens(prev => [...prev, token]);
      setPlacedTokens(prev => {
        const next = { ...prev };
        delete next[slot];
        return next;
      });
    }
  };

  const checkSolution = () => {
    // Check if all slots are filled correctly according to the map
    const allFilled = slots.length > 0 && slots.every(slot => placedTokens[slot]);
    if (!allFilled) {
      onComplete(false);
      return;
    }

    const isCorrect = slots.every(slot => placedTokens[slot] === map[slot]);
    onComplete(isCorrect);
  };

  // Render the code with interactive slots
  const renderCode = () => {
    const parts = zielCode.split(/(__\d+__)/);
    return (
      <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
        {parts.map((part, i) => {
          if (part.match(/__\d+__/)) {
            const token = placedTokens[part];
            return (
              <button
                key={i}
                onClick={() => handleSlotClick(part)}
                className={`inline-flex items-center justify-center min-w-[40px] h-6 px-2 mx-1 rounded border transition-all ${
                  token 
                    ? 'bg-primary text-white border-primary' 
                    : 'bg-surface-2 border-surface-2 border-dashed text-transparent'
                }`}
              >
                {token || '____'}
              </button>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </pre>
    );
  };

  return (
    <div className="flex flex-col gap-6 p-4 h-full">
      <div className="flex-1 bg-surface border border-surface-2 rounded-xl p-6 overflow-y-auto">
        <div className="text-text-secondary text-[10px] uppercase font-mono tracking-widest mb-4">Ziel-Code</div>
        {renderCode()}
      </div>

      <div className="flex flex-col gap-4">
        <div className="text-text-secondary text-[10px] uppercase font-mono tracking-widest">Verfügbare Bausteine</div>
        <div className="flex flex-wrap gap-2">
          {availableTokens.map((token, i) => (
            <button
              key={i}
              onClick={() => handleTokenClick(token)}
              className="px-3 py-2 bg-surface-2 hover:bg-surface-2/80 rounded text-sm font-mono active:scale-95 transition-all"
            >
              {token}
            </button>
          ))}
        </div>
      </div>
      
      <button
        onClick={checkSolution}
        className="w-full py-4 bg-primary text-white rounded-xl font-bold active:scale-95 transition-transform"
      >
        Prüfen
      </button>
    </div>
  );
};
