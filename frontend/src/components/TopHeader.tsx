import React from 'react';
import { 
  ChevronLeft, 
  Bell, 
  Sun, 
  Moon, 
  BookOpen,
  Code,
  Sparkles
} from 'lucide-react';

interface TopHeaderProps {
  theme: 'light' | 'contrast' | 'dark';
  toggleTheme: () => void;
  roleTitle?: string;
  onOpenCodeEditor: () => void;
  onOpenTakeInterview: () => void;
  onOpenThemeModal: () => void;
  onBack?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  theme,
  toggleTheme,
  roleTitle = 'Fullstack Software Engineer',
  onOpenCodeEditor,
  onOpenTakeInterview,
  onOpenThemeModal,
  onBack
}) => {
  return (
    <header className="h-16 px-5 lg:px-8 flex items-center justify-between border-b border-slate-200/90 dark:border-white/5 bg-white dark:bg-[#111827] transition-colors select-none">
      {/* Left: Back Arrow, Title, Role Tag */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack ? onBack : () => window.location.reload()}
          className="w-8 h-8 rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          title="Back to Overview"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5">
          <h1 className="font-bold text-base text-slate-900 dark:text-white tracking-tight">
            AI Interview Platform
          </h1>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
            {roleTitle}
          </span>
        </div>
      </div>

      {/* Right Controls: Take Interview CTA, Code Sandbox, Theme Toggle, Bell, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Prominent Take Interview Button */}
        <button
          onClick={onOpenTakeInterview}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-500/25 active:scale-95 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-200" />
          <span>Take Interview</span>
        </button>

        {/* Quick Open Sandbox Button */}
        <button
          onClick={onOpenCodeEditor}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-teal-500/10 text-slate-700 dark:text-teal-400 border border-slate-200 dark:border-teal-500/20 hover:bg-slate-200 dark:hover:bg-teal-500/20 transition-all shadow-sm"
        >
          <Code className="w-3.5 h-3.5" />
          <span>Code Sandbox</span>
        </button>

        {/* Theme Options (Palette) Button */}
        <button
          onClick={onOpenThemeModal}
          className="w-9 h-9 rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          title="Themes & Appearance Options"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </button>

        {/* Notification Bell */}
        <button 
          className="relative w-9 h-9 rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-[#111827]" />
        </button>

        {/* Reviewer / Evaluator Profile */}
        <div className="flex items-center gap-2.5 pl-1 border-l border-slate-200 dark:border-white/10">
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80"
            alt="Kristin Watson"
            className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-white/10"
          />
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 hidden sm:inline">
            Kristin Watson
          </span>
        </div>
      </div>
    </header>
  );
};
