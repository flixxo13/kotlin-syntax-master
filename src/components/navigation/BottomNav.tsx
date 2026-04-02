import { Home, BookOpen, Download, BarChart2, User } from 'lucide-react';

type Tab = 'home' | 'learn' | 'import' | 'progress' | 'profile';

interface BottomNavProps {
  activeTab:   string;
  onTabChange: (tab: Tab) => void;
}

const TABS: Array<{ id: Tab; label: string; Icon: React.ComponentType<{ className?: string }> }> = [
  { id: 'home',     label: 'HOME',        Icon: Home      },
  { id: 'learn',    label: 'LERNEN',      Icon: BookOpen  },
  { id: 'import',   label: 'IMPORT',      Icon: Download  },
  { id: 'progress', label: 'FORTSCHRITT', Icon: BarChart2 },
  { id: 'profile',  label: 'PROFIL',      Icon: User      },
];

export const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-surface-2">
      <div className="flex items-center justify-around px-2 pb-4 pt-2 max-w-lg mx-auto">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className="flex flex-col items-center gap-1 flex-1 py-1 transition-colors"
            >
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? 'text-primary' : 'text-text-secondary'
                }`}
              />
              <span
                className={`text-[9px] font-bold tracking-wider transition-colors ${
                  isActive ? 'text-primary' : 'text-text-secondary'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
