import { useLearningStore } from '../store/useLearningStore'
import { formatXP } from '../utils/xp'

export function ProfileScreen() {
  const { streak, totalXP, totalExercises, streakFreezeAvailable, resetProgress } = useLearningStore()

  return (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar px-4 pt-4 pb-4 space-y-4">
      <h2 className="text-lg font-bold text-white">Profil</h2>

      {/* Avatar Placeholder */}
      <div className="flex flex-col items-center py-6 bg-surface rounded-2xl border border-surface-2">
        <div className="w-16 h-16 rounded-full bg-kotlin/30 flex items-center justify-center text-3xl mb-3">
          🧑‍💻
        </div>
        <p className="text-base font-semibold text-white">Kotlin Lernender</p>
        <p className="text-xs text-[#555] mt-1">Level 1 · Anfänger</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { v: streak, l: 'Streak', i: '🔥' },
          { v: formatXP(totalXP), l: 'XP', i: '⭐' },
          { v: totalExercises, l: 'Übungen', i: '✅' },
        ].map(s => (
          <div key={s.l} className="bg-surface rounded-xl border border-surface-2 p-3 text-center">
            <div className="text-xl mb-1">{s.i}</div>
            <div className="text-lg font-bold text-kotlin">{s.v}</div>
            <div className="text-[10px] text-[#555]">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Streak Freeze */}
      <div className="bg-surface rounded-xl border border-surface-2 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">🛡️ Streak-Freeze</p>
            <p className="text-xs text-[#555] mt-0.5">Schützt deinen Streak für einen Tag</p>
          </div>
          <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold
            ${streakFreezeAvailable ? 'bg-success/20 text-success' : 'bg-surface-2 text-[#555]'}`}>
            {streakFreezeAvailable ? 'Verfügbar' : 'Verbraucht'}
          </div>
        </div>
      </div>

      {/* V2 Platzhalter */}
      <div className="bg-surface rounded-xl border border-surface-2 p-4 opacity-50">
        <p className="text-sm font-semibold text-[#888]">☁️ Cloud-Sync</p>
        <p className="text-xs text-[#555] mt-1">Kommt in Version 2 · Supabase</p>
      </div>

      {/* Reset (Entwickler) */}
      <button
        onClick={() => {
          if (confirm('Wirklich allen Fortschritt zurücksetzen?')) resetProgress()
        }}
        className="w-full py-3 rounded-xl border border-error/30 text-error text-sm font-medium active:bg-error/10"
      >
        Fortschritt zurücksetzen
      </button>
    </div>
  )
}
