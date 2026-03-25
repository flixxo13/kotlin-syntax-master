import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface TaskCardProps {
  task: string
  conceptTitle: string
  isKeyboardOpen?: boolean
}

export function TaskCard({ task, conceptTitle, isKeyboardOpen = false }: TaskCardProps) {
  const [collapsed, setCollapsed] = useState(false)
  const isCollapsed = collapsed || isKeyboardOpen

  return (
    <div className="bg-surface rounded-xl border border-surface-2 overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs text-kotlin font-semibold uppercase tracking-wider">
            Aufgabe
          </span>
          <span className="text-xs text-[#555]">· {conceptTitle}</span>
        </div>
        {isCollapsed
          ? <ChevronDown size={14} className="text-[#555]" />
          : <ChevronUp size={14} className="text-[#555]" />
        }
      </button>

      {!isCollapsed && (
        <div className="px-4 pb-4 animate-fade-in">
          <p className="text-sm text-[#ccc] leading-relaxed">{task}</p>
        </div>
      )}

      {isCollapsed && (
        <div className="px-4 pb-2">
          <p className="text-xs text-[#555] truncate">{task}</p>
        </div>
      )}
    </div>
  )
}
