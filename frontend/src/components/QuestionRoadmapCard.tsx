import React from 'react';
import { Info, Check } from 'lucide-react';

interface QuestionRoadmapCardProps {
  activeStep: number;
  onSelectStep: (step: number) => void;
}

export const QuestionRoadmapCard: React.FC<QuestionRoadmapCardProps> = ({
  activeStep,
  onSelectStep
}) => {
  const steps = [
    { num: 1, title: 'Tell us about yourself & system approach?', completed: true },
    { num: 2, title: 'Two Sum: Hash Map O(n) Strategy', completed: false, active: true },
    { num: 3, title: 'Valid Parentheses: Stack Matching', completed: false },
    { num: 4, title: 'Time & Space Complexity Trade-offs', completed: false },
    { num: 5, title: 'Candidate Behavioral & Wrap-up', completed: false }
  ];

  return (
    <div className="bg-white dark:bg-[#111827] rounded-3xl p-5 border border-slate-200/80 dark:border-white/5 shadow-soft flex flex-col justify-between transition-colors">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Question List</h3>
        <Info className="w-4 h-4 text-teal-600 dark:text-teal-400" />
      </div>

      <div className="relative pl-1 space-y-4 my-auto">
        {/* Vertical dotted connecting line */}
        <div className="absolute left-[15px] top-3 bottom-3 w-[1px] border-l border-dashed border-slate-300 dark:border-slate-700 pointer-events-none" />

        {steps.map((s) => {
          const isDone = s.num < activeStep;
          const isCurrent = s.num === activeStep;

          return (
            <div
              key={s.num}
              onClick={() => onSelectStep(s.num)}
              className="relative flex items-center gap-3 cursor-pointer group"
            >
              {/* Number Circle Badge */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold z-10 transition-transform group-hover:scale-110 ${
                  isDone
                    ? 'bg-teal-500 text-white'
                    : isCurrent
                    ? 'bg-teal-500 text-white ring-4 ring-teal-500/20'
                    : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-300 dark:border-slate-700'
                }`}
              >
                {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : s.num}
              </div>

              {/* Question Text */}
              <p
                className={`text-xs font-medium leading-snug line-clamp-1 transition-colors ${
                  isCurrent
                    ? 'text-slate-900 dark:text-white font-bold'
                    : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                }`}
              >
                {s.title}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
