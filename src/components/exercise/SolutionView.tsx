import { KotlinEditor } from '../editor/KotlinEditor'

interface SolutionViewProps {
  solution: string
  explanation?: string
}

export function SolutionView({ solution, explanation }: SolutionViewProps) {
  return (
    <div className="space-y-3 animate-slide-up">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-error" />
        <span className="text-xs text-error font-semibold uppercase tracking-wider">
          Lösung
        </span>
      </div>

      <KotlinEditor
        value={solution}
        onChange={() => {}}
        readOnly
        showShortcuts={false}
        showResize={false}
      />

      {explanation && (
        <div className="bg-surface rounded-xl p-3 border border-surface-2">
          <p className="text-xs text-[#888] leading-relaxed">{explanation}</p>
        </div>
      )}
    </div>
  )
}
