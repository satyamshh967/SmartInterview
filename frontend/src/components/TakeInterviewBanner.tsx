import React from 'react';
import { Sparkles, Terminal, Cpu, Code2, Layers, SlidersHorizontal, ArrowRight, Play } from 'lucide-react';

interface TakeInterviewBannerProps {
  onQuickStart: (track: string, difficulty: string) => void;
  onOpenCustomModal: () => void;
}

export const TakeInterviewBanner: React.FC<TakeInterviewBannerProps> = ({
  onQuickStart,
  onOpenCustomModal
}) => {
  const quickOptions = [
    { track: 'Fullstack Software Engineer', diff: 'Medium', label: 'Fullstack SWE', icon: Terminal },
    { track: 'Backend Systems & Architecture', diff: 'Hard', label: 'Backend Systems', icon: Cpu },
    { track: 'Core Data Structures & Algorithms', diff: 'Medium', label: 'Core DSA', icon: Code2 },
    { track: 'Frontend Engineering & Web Systems', diff: 'Easy', label: 'Frontend React', icon: Layers }
  ];

  return (
    <div className="bg-white dark:bg-[#111827] rounded-3xl p-4 sm:p-5 border border-slate-200/90 dark:border-white/5 shadow-soft transition-colors flex flex-wrap items-center justify-between gap-4">
      {/* Left: Headline & Description */}
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-500/10 border border-teal-200/80 dark:border-teal-500/20 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400 border border-teal-200/60 dark:border-teal-500/20">
              Live Assessment
            </span>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Take an Interview Now
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Timed C++ sandboxed code evaluations and real-time speech NLP scoring.
          </p>
        </div>
      </div>

      {/* Right: Various Track Options to Take Interview */}
      <div className="flex flex-wrap items-center gap-2">
        {quickOptions.map((opt) => {
          const Icon = opt.icon;
          return (
            <button
              key={opt.track}
              onClick={() => onQuickStart(opt.track, opt.diff)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/80 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 dark:hover:bg-teal-500/10 dark:hover:text-teal-400 border border-slate-200/80 dark:border-white/5 transition-all shadow-sm active:scale-95 group"
            >
              <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors" />
              <span>{opt.label}</span>
            </button>
          );
        })}

        <button
          onClick={onOpenCustomModal}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-500/20 active:scale-95 transition-all"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>More Options</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
