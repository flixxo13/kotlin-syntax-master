import React from 'react';
import { motion } from 'motion/react';
import { Lightbulb } from 'lucide-react';
import { HintLevel } from '../../types';

interface HintPanelProps {
  currentLevel: HintLevel;
  hints: {
    level1: string;
    level2: string;
    level3: string;
  };
  onRequestHint: () => void;
  onRevealSolution: () => void;
}

export const HintPanel: React.FC<HintPanelProps> = ({ 
  currentLevel, 
  hints, 
  onRequestHint, 
  onRevealSolution 
}) => {
  const level = typeof currentLevel === 'number' ? currentLevel : 3;

  return (
    <div className="p-4 bg-surface flex flex-col gap-4 border-t border-surface-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-hint">
          <Lightbulb className="w-4 h-4" />
          <span className="text-[10px] uppercase font-mono tracking-widest">Hints</span>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3].map((l) => (
            <div 
              key={l}
              className={`w-2 h-2 rounded-full ${level >= l ? 'bg-hint' : 'bg-surface-2'}`}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {level > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-surface-2 rounded text-xs font-mono text-hint border border-hint/20"
          >
            {level === 1 && hints.level1}
            {level === 2 && hints.level2}
            {level === 3 && hints.level3}
          </motion.div>
        )}

        <div className="flex gap-2">
          {level < 3 && (
            <button
              onClick={onRequestHint}
              className="flex-1 py-3 bg-surface-2 hover:bg-surface-2/80 rounded text-[10px] uppercase font-mono tracking-widest transition-colors"
            >
              Hint {level + 1} anfordern
            </button>
          )}
          {level >= 3 && currentLevel !== 'revealed' && (
            <button
              onClick={onRevealSolution}
              className="flex-1 py-3 bg-error/20 text-error border border-error/30 rounded text-[10px] uppercase font-mono tracking-widest transition-colors"
            >
              Lösung anzeigen
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
