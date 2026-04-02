import React from 'react';
import { motion } from 'motion/react';
import { ClipboardList, ChevronDown } from 'lucide-react';

interface TaskCardProps {
  task: string;
  isCollapsed: boolean;
  onToggle: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, isCollapsed, onToggle }) => {
  return (
    <div className="bg-surface border-b border-surface-2 p-4 flex flex-col gap-2 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-text-secondary">
          <ClipboardList className="w-4 h-4" />
          <span className="text-[10px] uppercase font-mono tracking-widest">Aufgabe</span>
        </div>
        <button onClick={onToggle} className="p-1 hover:bg-surface-2 rounded transition-colors">
          <ChevronDown className={isCollapsed ? "w-4 h-4 rotate-180 transition-transform" : "w-4 h-4 transition-transform"} />
        </button>
      </div>
      {!isCollapsed && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm leading-relaxed"
        >
          {task}
        </motion.p>
      )}
    </div>
  );
};
