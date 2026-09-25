import React from 'react';
import { ChevronUp } from 'lucide-react';

export interface CandidateItem {
  id: string;
  name: string;
  role: string;
  status: 'Approved' | 'Rejected';
  score: number;
  avatar: string;
}

interface CandidateListCardProps {
  candidates: CandidateItem[];
  selectedId: string;
  onSelectCandidate: (candidate: CandidateItem) => void;
}

export const CandidateListCard: React.FC<CandidateListCardProps> = ({
  candidates,
  selectedId,
  onSelectCandidate
}) => {
  return (
    <div className="bg-white dark:bg-[#111827] rounded-3xl p-5 border border-slate-200/80 dark:border-white/5 shadow-soft flex flex-col h-full transition-colors">
      {/* Top Black Header Pill */}
      <div className="bg-[#181E29] text-white px-4 py-3 rounded-2xl flex items-center justify-between mb-4 shadow-sm select-none">
        <span className="text-xs font-bold tracking-tight">All Candidates</span>
        <ChevronUp className="w-4 h-4 text-slate-400" />
      </div>

      {/* Candidate Rows */}
      <div className="space-y-3.5 overflow-y-auto flex-1 pr-1">
        {(candidates || []).map((cand) => {
          const isSelected = cand.id === selectedId;
          const isApproved = cand.status === 'Approved';

          return (
            <div
              key={cand.id}
              onClick={() => onSelectCandidate(cand)}
              className={`p-2.5 rounded-2xl cursor-pointer transition-all border ${
                isSelected
                  ? 'bg-slate-50 dark:bg-white/[0.04] border-slate-300 dark:border-teal-500/40 shadow-sm'
                  : 'hover:bg-slate-50/70 dark:hover:bg-white/[0.02] border-transparent'
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <img
                    src={cand.avatar}
                    alt={cand.name}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-white/10"
                  />
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {cand.name}
                    </h3>
                    <span className={`text-[10px] font-semibold leading-tight ${
                      isApproved ? 'text-teal-600 dark:text-teal-400' : 'text-orange-500 dark:text-orange-400'
                    }`}>
                      {cand.status}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                    {cand.score}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">/100</span>
                </div>
              </div>

              {/* Mini horizontal progress bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isApproved ? 'bg-teal-500' : 'bg-orange-500'
                  }`}
                  style={{ width: `${cand.score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
