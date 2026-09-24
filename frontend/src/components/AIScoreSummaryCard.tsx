import React, { useState } from 'react';
import { Info, Check, X, Sparkles } from 'lucide-react';

interface AIScoreSummaryCardProps {
  score?: number;
  summaryText?: string;
  onHireTalent: () => void;
}

export const AIScoreSummaryCard: React.FC<AIScoreSummaryCardProps> = ({
  score = 85,
  summaryText = "The presentation of talent is strong. Articulated O(n) algorithmic trade-offs cleanly with optimal hash map logic.",
  onHireTalent
}) => {
  const [decision, setDecision] = useState<'shortlist' | 'reject' | null>('shortlist');

  return (
    <div className="bg-white dark:bg-[#111827] rounded-3xl p-5 border border-slate-200/80 dark:border-white/5 shadow-soft flex flex-col justify-between transition-colors">
      <div>
        <div className="flex items-center justify-between mb-1">
          <Info className="w-4 h-4 text-teal-600 dark:text-teal-400" />
        </div>

        {/* Big Percentage */}
        <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          {score}%
        </div>

        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
          AI Evaluation Score Summary
        </h3>

        <p className="text-[11px] text-slate-400 dark:text-slate-400 leading-relaxed mt-1 line-clamp-3">
          {summaryText}
        </p>
      </div>

      <div className="space-y-2.5 mt-4">
        {/* Shortlist / Reject toggle pills */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setDecision('shortlist')}
            className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all ${
              decision === 'shortlist'
                ? 'border-teal-500 bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400'
                : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50'
            }`}
          >
            <Check className="w-3.5 h-3.5 text-teal-500" />
            <span>Shortlist</span>
          </button>

          <button
            onClick={() => setDecision('reject')}
            className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all ${
              decision === 'reject'
                ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400'
                : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50'
            }`}
          >
            <X className="w-3.5 h-3.5 text-orange-500" />
            <span>Reject</span>
          </button>
        </div>

        {/* Big Teal CTA Button */}
        <button
          onClick={onHireTalent}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 shadow-md shadow-teal-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Hire Talent</span>
        </button>
      </div>
    </div>
  );
};
