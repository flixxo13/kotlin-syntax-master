import { Flame, Star } from 'lucide-react'
import { useLearningStore } from '../store/useLearningStore'
import { ModuleCard } from '../components/ui/ModuleCard'
import { StatCard } from '../components/ui/StatCard'
import { getTopicProgress } from '../data/topics'
import { formatXP } from '../utils/xp'

export function HomeScreen() {
  const {
    topics, streak, totalXP, totalExercises,
    progress, setActiveScreen, setSelectedTopic
  } = useLearningStore()

  const greeting = getGreeting()

  return (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar px-4 pt-4 pb-4 space-y-4">
      {/* Header */}
      <div>
        <p className="text-xs text-[#666] uppercase tracking-widest">Kotlin Syntax Master</p>
        <h1 className="text-xl font-bold text-white mt-0.5">{greeting} 👋</h1>
      </div>

      {/* Stats Row */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        <StatCard icon="🔥" value={streak} label={streak === 1 ? 'Tag Streak' : 'Tage Streak'}
                  color={streak > 0 ? 'text-warning' : 'text-[#555]'} />
        <StatCard icon="⭐" value={formatXP(totalXP)} label="XP gesamt"
                  color="text-kotlin" />
        <StatCard icon="✅" value={totalExercises} label="Übungen" color="text-success" />
      </div>

      {/* Tages-Ziel */}
      <DailyGoalCard />

      {/* Module Liste */}
      <div>
        <h2 className="text-sm font-semibold text-[#888] uppercase tracking-wider mb-3">
          Deine Module
        </h2>
        <div className="space-y-3">
          {topics.map(topic => (
            <ModuleCard
              key={topic.id}
              topic={topic}
              progress={getTopicProgress(topic.id, progress)}
              onClick={() => {
                setSelectedTopic(topic.id)
                setActiveScreen('learn')
              }}
            />
          ))}
          {topics.length === 0 && (
            <div className="text-center py-12 text-[#555] text-sm">
              Module werden geladen...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DailyGoalCard() {
  const { totalExercises, lastSessionAt } = useLearningStore()
  const todayCount = 5  // Tagesziel
  const done = lastSessionAt
    ? new Date(lastSessionAt).toDateString() === new Date().toDateString()
    : false

  return (
    <div className="bg-surface rounded-2xl border border-surface-2 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-white">Tagesziel</span>
        <span className="text-xs text-kotlin">5 Übungen</span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: todayCount }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-2 rounded-full transition-all duration-500
              ${i < (done ? todayCount : 0) ? 'bg-kotlin' : 'bg-surface-3'}`}
          />
        ))}
      </div>
      <p className="text-xs text-[#555] mt-2">
        {done ? '🎉 Tagesziel erreicht!' : 'Noch nicht geübt heute'}
      </p>
    </div>
  )
}

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Guten Morgen'
  if (h < 18) return 'Guten Tag'
  return 'Guten Abend'
}
