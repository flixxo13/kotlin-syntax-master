import React from 'react';

interface ShortcutBarProps {
  onInsert: (text: string) => void;
}

const SHORTCUTS = [
  'fun', 'val', 'var', '{ }', '( )', '->', '?:', '?.', '!!', '..', '===', '==', ':', ',', '[ ]', '$'
];

export const ShortcutBar: React.FC<ShortcutBarProps> = ({ onInsert }) => {
  return (
    <div className="flex overflow-x-auto bg-surface-2 p-2 gap-2 no-scrollbar border-b border-surface">
      {SHORTCUTS.map((s) => (
        <button
          key={s}
          onClick={() => onInsert(s)}
          className="px-4 py-2 bg-surface rounded text-sm font-mono whitespace-nowrap active:bg-primary active:text-white transition-colors"
        >
          {s}
        </button>
      ))}
    </div>
  );
};
