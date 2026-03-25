import { useMemo } from 'react'

interface ChipBarProps {
  options: string[]       // gaps + distractors gemischt
  used: string[]          // bereits verwendete Chips
  onSelect: (chip: string) => void
}

export function ChipBar({ options, used, onSelect }: ChipBarProps) {
  // Einmalig mischen
  const shuffled = useMemo(
    () => [...options].sort(() => Math.random() - 0.5),
    [options.join(',')]
  )

  return (
    <div className="bg-surface rounded-xl border border-surface-2 p-3">
      <p className="text-[10px] text-[#555] uppercase tracking-wider mb-2">Bausteine</p>
      <div className="flex flex-wrap gap-2">
        {shuffled.map((chip) => {
          const isUsed = used.includes(chip)
          return (
            <button
              key={chip}
              onClick={() => !isUsed && onSelect(chip)}
              disabled={isUsed}
              className={`chip text-sm font-mono
                ${isUsed ? 'opacity-30 cursor-not-allowed' : 'active:scale-95 active:border-kotlin'}`}
            >
              {chip}
            </button>
          )
        })}
      </div>
    </div>
  )
}
