import React from 'react';
import { GripHorizontal } from 'lucide-react';

interface ResizeHandleProps {
  onResize: (e: React.MouseEvent | React.TouchEvent) => void;
  onReset: () => void;
}

export const ResizeHandle: React.FC<ResizeHandleProps> = ({ onResize, onReset }) => {
  return (
    <div 
      className="h-8 bg-surface-2 flex items-center justify-center cursor-ns-resize border-b border-surface active:bg-surface-2/80"
      onMouseDown={onResize}
      onTouchStart={onResize}
      onDoubleClick={onReset}
    >
      <div className="flex flex-col items-center gap-0.5 opacity-50">
        <GripHorizontal className="w-5 h-5" />
        <span className="text-[8px] uppercase font-mono tracking-widest">Drag</span>
      </div>
    </div>
  );
};
