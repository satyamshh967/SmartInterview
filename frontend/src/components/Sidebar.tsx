import React from 'react';
import { 
  LayoutGrid, 
  Headphones, 
  Video, 
  Award, 
  FileText, 
  Settings, 
  LogOut,
  Code2
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const navItems = [
    { id: 'dashboard', icon: LayoutGrid, label: 'Dashboard Overview' },
    { id: 'interview', icon: Headphones, label: 'Live Interview Assessment' },
    { id: 'candidates', icon: Video, label: 'Candidate Directory' },
    { id: 'analytics', icon: Award, label: 'Scorecards & Analytics' },
    { id: 'questions', icon: FileText, label: 'Question Bank' },
    { id: 'settings', icon: Settings, label: 'Settings & API' },
  ];

  return (
    <aside className="w-16 md:w-20 bg-white dark:bg-[#111827] flex flex-col items-center justify-between py-6 border-r border-slate-200/90 dark:border-white/5 flex-shrink-0 select-none z-20 transition-colors">
      {/* Top Professional Emblem */}
      <div className="flex flex-col items-center gap-6">
        <div 
          onClick={() => setActiveView('dashboard')}
          className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm cursor-pointer hover:opacity-95 transition-all active:scale-95"
          title="SmartInterview AI"
        >
          <Code2 className="w-5 h-5" />
        </div>

        {/* Navigation Icon List */}
        <nav className="flex flex-col items-center gap-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                title={item.label}
                className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-teal-50 text-teal-600 border border-teal-200 shadow-sm dark:bg-teal-500/20 dark:text-teal-400 dark:border-teal-500/30'
                    : 'text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <Icon className="w-5 h-5" />
                {isActive && (
                  <span className="absolute -left-1.5 w-1 h-5 bg-teal-500 dark:bg-teal-400 rounded-r-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Logout / Quit Icon */}
      <div>
        <button
          onClick={() => window.location.reload()}
          title="Reset View"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:text-rose-400 dark:hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
};
