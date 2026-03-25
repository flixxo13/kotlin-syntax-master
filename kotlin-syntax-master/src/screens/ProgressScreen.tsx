import { useLearningStore } from '../store/useLearningStore'
import { getTopicProgress } from '../data/topics'
import { ProgressBar } from '../components/ui/ProgressBar'
import { formatXP } from '../utils/xp'

export function ProgressScreen() {
  const { topics, progress, streak, totalXP, totalExercises, reviewQueue } = useLearningStore()

  return (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar px-4 pt-4 pb-4 space-y-4">
      <h2 className="text-lg font-bold text-white">Mein Fortschritt</h2>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Tage Streak',   value: streak,                  icon: '🔥', color: 'text-warning' },
          { label: 'Gesamt XP',     value: formatXP(totalXP),       icon: '⭐', color: 'text-kotlin' },
          { label: 'Übungen',       value: totalExercises,           icon: '✅', color: 'text-success' },
          { label: 'In Warteschla.', value: reviewQueue.length,      icon: '🔁', color: 'text-hint' },
        ].map(card => (
          <div key={card.label} className="bg-surface rounded-2xl border border-surface-2 p-4 text-center">
            <div className="text-2xl mb-1">{card.icon}</div>
            <div className={`text-xl font-bold ${card.color}`}>{card.value}</div>
            <div className="text-[11px] text-[#555] mt-0.5">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Modul-Fortschritt */}
      <div>
        <h3 className="text-sm font-semibold text-[#888] uppercase tracking-wider mb-3">Module</h3>
        <div className="space-y-3">
          {topics.map(topic => {
            const prog = getTopicProgress(topic.id, progress)
            return (
              <div key={topic.id} className="bg-surface rounded-xl border border-surface-2 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-white">{topic.title}</span>
                  <span className="text-xs text-kotlin font-medium">{prog}%</span>
                </div>
                <ProgressBar value={prog} />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-[#555]">
                    {topic.concepts.length} Konzepte
                  </span>
                  {prog >= 100 && (
                    <span className="text-xs text-success">✅ Abgeschlossen</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
