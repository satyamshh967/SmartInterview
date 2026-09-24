import React, { useState } from 'react';
import { Video, Star, CheckCircle2, XCircle, ArrowUpRight, Search, Play } from 'lucide-react';
import { CandidateItem } from './CandidateListCard';

interface CandidatesViewProps {
  candidates: CandidateItem[];
  onSelectCandidate: (candidate: CandidateItem) => void;
  onViewScorecard: (candidate: CandidateItem) => void;
}

export const CandidatesView: React.FC<CandidatesViewProps> = ({
  candidates,
  onSelectCandidate,
  onViewScorecard
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filtered = candidates.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200/80 dark:border-white/5 shadow-soft transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-teal-600 dark:text-teal-400">Talent Pool</span>
            <span className="text-slate-300 dark:text-slate-700">&bull;</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Candidate Video Archives</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Interview Recordings & Talent Directory</h1>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-3 py-2 bg-slate-50 dark:bg-[#090D16] border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* Candidates Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((cand) => {
          const isApproved = cand.status === 'Approved';

          return (
            <div
              key={cand.id}
              className="bg-white dark:bg-[#111827] rounded-3xl p-5 border border-slate-200/80 dark:border-white/5 shadow-soft flex flex-col justify-between hover:border-teal-500/40 transition-all group"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={cand.avatar}
                    alt={cand.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-white/10"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                      {cand.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{cand.role}</p>
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                      isApproved
                        ? 'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400'
                        : 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400'
                    }`}>
                      {cand.status}
                    </span>
                  </div>
                </div>

                {/* Score bar */}
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-500">AI Evaluation Score</span>
                    <span className="text-slate-900 dark:text-white font-bold">{cand.score}/100</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isApproved ? 'bg-teal-500' : 'bg-orange-500'}`}
                      style={{ width: `${cand.score}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectCandidate(cand)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <Play className="w-3 h-3 text-teal-500 fill-teal-500" />
                  <span>Watch Interview</span>
                </button>

                <button
                  onClick={() => onViewScorecard(cand)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 transition-colors shadow-sm"
                >
                  <span>Scorecard</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
