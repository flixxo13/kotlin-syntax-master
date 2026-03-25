interface StatCardProps {
  icon: string
  value: string | number
  label: string
  color?: string
}

export function StatCard({ icon, value, label, color = 'text-kotlin' }: StatCardProps) {
  return (
    <div className="flex items-center gap-2 bg-surface rounded-xl px-3 py-2 border border-surface-2">
      <span className="text-xl">{icon}</span>
      <div>
        <div className={`text-base font-bold leading-none ${color}`}>{value}</div>
        <div className="text-[10px] text-[#666] mt-0.5">{label}</div>
      </div>
    </div>
  )
}
