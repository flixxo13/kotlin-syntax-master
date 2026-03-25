import type { SessionResult } from '../types'

interface SessionEndScreenProps {
  result: SessionResult
  onContinue: () => void
  onRestart: () => void
}

export function SessionEndScreen({ result, onContinue, onRestart }: SessionEndScreenProps) {
  const accuracy = result.exercisesTotal > 0
    ? Math.round((result.exercisesCorrect / result.exercisesTotal) * 100)
    : 0

  const minutes = Math.floor(result.durationSeconds / 60)
  const seconds = result.durationSeconds % 60
  const timeStr = minutes > 0
    ? `${minutes}m ${seconds}s`
    : `${seconds}s`

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-8 bg-black">
      {/* Trophy */}
      <div className="text-6xl mb-4 animate-pop-in">🎯</div>

      <h1 className="text-2xl font-bold text-white mb-1">Session abgeschlossen!</h1>
      <p className="text-sm text-[#666] mb-8">Gut gemacht — weiter so!</p>

      {/* Stats Grid */}
      <div className="w-full grid grid-cols-2 gap-3 mb-8">
        <StatTile icon="✅" value={`${result.exercisesCorrect}/${result.exercisesTotal}`}
                  label="Richtig" color="text-success" />
        <StatTile icon="💡" value={result.hintsUsed}
                  label="Hints benutzt" color="text-hint" />
        <StatTile icon="⭐" value={`+${result.xpEarned} XP`}
                  label="Verdient" color="text-kotlin" />
        <StatTile icon="⏱️" value={timeStr}
                  label="Dauer" color="text-[#aaa]" />
      </div>

      {/* Genauigkeit */}
      <div className="w-full bg-surface rounded-2xl border border-surface-2 p-4 mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[#888]">Genauigkeit</span>
          <span className={`text-sm font-bold ${accuracy >= 80 ? 'text-success' : accuracy >= 50 ? 'text-warning' : 'text-error'}`}>
            {accuracy}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-surface-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700
              ${accuracy >= 80 ? 'bg-success' : accuracy >= 50 ? 'bg-warning' : 'bg-error'}`}
            style={{ width: `${accuracy}%` }}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full space-y-3">
        <button
          onClick={onContinue}
          className="w-full py-4 rounded-2xl bg-kotlin text-white font-bold text-base active:bg-kotlin-dark transition-colors"
        >
          Weiter lernen →
        </button>
        <button
          onClick={onRestart}
          className="w-full py-3 rounded-2xl bg-surface border border-surface-2 text-[#777] font-medium text-sm active:opacity-80"
        >
          🔁 Nochmal
        </button>
      </div>
    </div>
  )
}

function StatTile({
  icon, value, label, color
}: { icon: string; value: string | number; label: string; color: string }) {
  return (
    <div className="bg-surface rounded-2xl border border-surface-2 p-4 text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <div className={`text-xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-[#555] mt-0.5">{label}</div>
    </div>
  )
}
