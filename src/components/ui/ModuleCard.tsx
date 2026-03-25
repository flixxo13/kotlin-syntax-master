import { ChevronRight, CheckCircle2 } from 'lucide-react'
import { ProgressBar } from './ProgressBar'
import type { Topic } from '../../types'

interface ModuleCardProps {
  topic: Topic
  progress: number   // 0–100
  onClick: () => void
}

export function ModuleCard({ topic, progress, onClick }: ModuleCardProps) {
  const isDone = progress >= 100

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 bg-surface rounded-2xl p-4 border border-surface-2
                 active:border-kotlin active:bg-surface-2 transition-all text-left"
    >
      {/* Icon */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0
                       ${isDone ? 'bg-success/20' : 'bg-kotlin/20'}`}>
        {isDone ? '✅' : getModuleEmoji(topic.icon)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold text-white truncate">{topic.title}</span>
          {isDone
            ? <CheckCircle2 size={16} className="text-success flex-shrink-0" />
            : <ChevronRight size={16} className="text-[#444] flex-shrink-0" />
          }
        </div>
        <ProgressBar value={progress} showLabel />
        <p className="text-[11px] text-[#666] mt-1 truncate">{topic.description}</p>
      </div>
    </button>
  )
}

function getModuleEmoji(icon: string): string {
  const map: Record<string, string> = {
    Rocket: '🚀', Variable: '📦', Database: '🔢',
    GitBranch: '🔀', Wrench: '🔧', Shield: '🛡️', Layers: '📚'
  }
  return map[icon] ?? '📄'
}
