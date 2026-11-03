import React from 'react';
import { Book, Library, HelpCircle, BookOpen, Bookmark, Settings, FileText } from 'lucide-react';
import { ScreenType } from '../types';

interface BottomNavProps {
  currentScreen: ScreenType;
  onSelectScreen: (screen: ScreenType) => void;
  savedCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onSelectScreen,
  savedCount
}) => {
  const navItems: Array<{
    id: ScreenType;
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }> = [
    {
      id: 'books',
      label: 'Books',
      icon: <Library className="w-5 h-5" />
    },
    {
      id: 'bible',
      label: 'Reader',
      icon: <Book className="w-5 h-5" />
    },
    {
      id: 'lessons',
      label: 'Lessons',
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: 'quiz',
      label: 'Quiz',
      icon: <HelpCircle className="w-5 h-5" />
    },
    {
      id: 'dictionary',
      label: 'Dictionary',
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      id: 'bookmarks',
      label: 'Saved',
      icon: <Bookmark className="w-5 h-5" />,
      badge: savedCount > 0 ? savedCount : undefined
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />
    }
  ];

  return (
    <nav
      id="main-bottom-nav"
      aria-label="Main Navigation"
      className="fixed bottom-0 left-0 right-0 z-30 bg-[#0E1B33]/85 backdrop-blur-2xl border-t border-white/10 px-2 pt-1.5 sm:pt-2 flex items-center justify-around shadow-2xl select-none"
      style={{
        paddingBottom: 'calc(max(var(--safe-area-inset-bottom, env(safe-area-inset-bottom, 0px)), var(--sab-fallback, 0px)) + 0.375rem)'
      }}
    >
      {navItems.map((item) => {
        const isActive = currentScreen === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectScreen(item.id)}
            className={`relative flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${
              isActive
                ? 'text-[#E4C765] font-extrabold bg-white/10 shadow-sm border border-white/10 scale-105'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <div className="relative">
              {item.icon}
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[15px] h-3.5 px-1 bg-[#C9A227] text-white text-[8px] font-extrabold rounded-full flex items-center justify-center shadow-xs">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] sm:text-[11px] tracking-tight">
              {item.label}
            </span>
            {isActive && (
              <span className="w-1 h-1 rounded-full bg-[#E4C765] mt-0.5 shadow-sm shadow-[#E4C765]" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
