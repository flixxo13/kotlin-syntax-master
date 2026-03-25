import { Lightbulb } from 'lucide-react'
import type { HintLevel } from '../../types'

interface HintPanelProps {
  hints: { level1: string; level2: string; level3: string }
  currentLevel: HintLevel
  onRequestHint: () => void
  onRevealSolution: () => void
  isSolutionRevealed: boolean
}

export function HintPanel({
  hints,
  currentLevel,
  onRequestHint,
  onRevealSolution,
  isSolutionRevealed
}: HintPanelProps) {
  const numericLevel = typeof currentLevel === 'number' ? currentLevel : 3

  const hintTexts = [hints.level1, hints.level2, hints.level3]
  const visibleHints = hintTexts.slice(0, numericLevel)
  const canRequestMore = numericLevel < 3 && !isSolutionRevealed

  return (
    <div className="space-y-2">
      {/* Angezeigte Hints */}
      {visibleHints.map((text, i) => (
        <div
          key={i}
          className="flex items-start gap-2 bg-surface rounded-xl p-3 border border-hint/30 animate-fade-in"
        >
          <Lightbulb size={14} className="text-hint flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] text-hint font-semibold uppercase tracking-wider">
              Hint {i + 1}
            </span>
            <p className="text-sm font-mono text-[#ddd] mt-0.5">{text}</p>
          </div>
        </div>
      ))}

      {/* Hint-Button oder Lösung anzeigen */}
      <div className="flex gap-2">
        {canRequestMore && (
          <button
            onClick={onRequestHint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium
                       bg-hint/10 border border-hint/30 text-hint active:bg-hint/20 transition-colors"
          >
            <Lightbulb size={14} />
            Hint {numericLevel + 1} zeigen
          </button>
        )}

        {numericLevel >= 3 && !isSolutionRevealed && (
          <button
            onClick={onRevealSolution}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium
                       bg-error/10 border border-error/30 text-error active:bg-error/20 transition-colors"
          >
            Lösung anzeigen
          </button>
        )}
      </div>
    </div>
  )
}
