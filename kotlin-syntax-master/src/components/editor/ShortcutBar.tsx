interface ShortcutBarProps {
  onInsert: (text: string) => void
}

const SHORTCUTS_ROW1 = ['fun', 'val', 'var', 'if', 'when', 'for', 'while', 'return']
const SHORTCUTS_ROW2 = ['{ }', '( )', '[ ]', '->', '?:', '?.', '!!', '::', '$', '..', '===', '==']

export function ShortcutBar({ onInsert }: ShortcutBarProps) {
  return (
    <div className="bg-surface-2 border-t border-surface-3">
      {/* Zeile 1: Keywords */}
      <div className="shortcut-bar">
        {SHORTCUTS_ROW1.map(key => (
          <button
            key={key}
            onMouseDown={(e) => { e.preventDefault(); onInsert(key === '{ }' ? '{}' : key) }}
            className="shortcut-key"
          >
            {key}
          </button>
        ))}
      </div>
      {/* Zeile 2: Operatoren & Symbole */}
      <div className="shortcut-bar border-t border-surface-3/50">
        {SHORTCUTS_ROW2.map(key => (
          <button
            key={key}
            onMouseDown={(e) => {
              e.preventDefault()
              // Smarte Einfügung: Klammern platzieren Cursor in der Mitte
              const insertMap: Record<string, string> = {
                '{ }': '{}', '( )': '()', '[ ]': '[]'
              }
              onInsert(insertMap[key] ?? key)
            }}
            className="shortcut-key"
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  )
}
