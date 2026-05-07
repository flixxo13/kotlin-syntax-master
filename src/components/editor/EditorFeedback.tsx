import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export type FeedbackType = 'detected' | 'in-solution' | 'correct-pos';

export interface FeedbackElement {
  id: string;
  text: string;
  type: FeedbackType;
}

interface EditorFeedbackProps {
  elements: FeedbackElement[];
}

export const EditorFeedback: React.FC<EditorFeedbackProps> = ({ elements }) => {
  return (
    <div className="flex flex-wrap gap-1.5 px-4 py-2 min-h-[44px] bg-surface-2/20 border-b border-surface-2 items-center">
      <AnimatePresence mode="popLayout">
        {elements.map((el) => (
          <motion.div
            key={el.id}
            initial={{ opacity: 0, scale: 0.8, y: 5 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              backgroundColor: el.type === 'correct-pos' ? 'rgb(34, 197, 94)' : // green-500
                               el.type === 'in-solution' ? 'rgb(59, 130, 246)' : // blue-500
                               'rgb(75, 85, 99)', // gray-600
            }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.1 } }}
            className="px-2 py-1 rounded-md text-[10px] font-mono font-bold text-white flex items-center shadow-sm relative overflow-hidden"
          >
            {/* Blinking Overlay */}
            {(el.type === 'in-solution' || el.type === 'correct-pos') && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0, 1, 0] }}
                transition={{ duration: 0.5, times: [0, 0.25, 0.5, 0.75, 1] }}
                className="absolute inset-0 bg-white/40 pointer-events-none"
              />
            )}
            <span className="relative z-10">{el.text}</span>
          </motion.div>
        ))}
      </AnimatePresence>
      {elements.length === 0 && (
        <div className="flex items-center gap-2 text-[10px] text-text-secondary font-mono italic opacity-40">
          <div className="w-1 h-1 bg-text-secondary rounded-full animate-pulse" />
          Warte auf Syntax-Elemente...
        </div>
      )}
    </div>
  );
};
