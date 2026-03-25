import { Home, BookOpen, BarChart2, User } from 'lucide-react'
import { useLearningStore } from '../../store/useLearningStore'

const navItems = [
  { id: 'home',     icon: Home,      label: 'Home' },
  { id: 'learn',    icon: BookOpen,  label: 'Lernen' },
  { id: 'progress', icon: BarChart2, label: 'Fortschritt' },
  { id: 'profile',  icon: User,      label: 'Profil' },
] as const

export function BottomNav() {
  const { activeScreen, setActiveScreen } = useLearningStore()

  return (
    <nav className="flex items-stretch bg-surface border-t border-surface-2 safe-bottom">
      {navItems.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => setActiveScreen(id)}
          className={`bottom-nav-item flex-1 ${activeScreen === id ? 'active' : ''}`}
        >
          <Icon
            size={22}
            strokeWidth={activeScreen === id ? 2.5 : 1.8}
            className={activeScreen === id ? 'text-kotlin' : 'text-[#555]'}
          />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}
