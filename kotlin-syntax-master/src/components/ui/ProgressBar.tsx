interface ProgressBarProps {
  value: number   // 0–100
  className?: string
  showLabel?: boolean
}

export function ProgressBar({ value, className = '', showLabel = false }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="progress-bar-track flex-1">
        <div className="progress-bar-fill" style={{ width: `${clamped}%` }} />
      </div>
      {showLabel && (
        <span className="text-xs text-[#666] w-8 text-right">{clamped}%</span>
      )}
    </div>
  )
}
