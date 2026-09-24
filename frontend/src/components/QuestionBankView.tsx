import React, { useState } from 'react';
import { FileText, Code2, CheckCircle2, ChevronRight, Terminal, Search, Filter } from 'lucide-react';
import { Problem } from '../types';

interface QuestionBankViewProps {
  problems: Problem[];
  onOpenProblem: (problem: Problem) => void;
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({
  problems,
  onOpenProblem
}) => {
  const [search, setSearch] = useState<string>('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('All');

  const filtered = problems.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                          p.category.toLowerCase().includes(search.toLowerCase());
    const matchesDiff = filterDifficulty === 'All' || p.difficulty === filterDifficulty;
    return matchesSearch && matchesDiff;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200/80 dark:border-white/5 shadow-soft transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-teal-600 dark:text-teal-400">Question Library</span>
            <span className="text-slate-300 dark:text-slate-700">&bull;</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Algorithmic Problem Bank</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Technical Problems & Test Suites</h1>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search problems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-2 bg-slate-50 dark:bg-[#090D16] border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500"
            />
          </div>

          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="bg-slate-50 dark:bg-[#090D16] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Problem Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((prob) => {
          const isEasy = prob.difficulty === 'Easy';
          const isMed = prob.difficulty === 'Medium';

          return (
            <div
              key={prob.id}
              className="bg-white dark:bg-[#111827] rounded-3xl p-5 border border-slate-200/80 dark:border-white/5 shadow-soft flex flex-col justify-between hover:border-teal-500/40 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    isEasy
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                      : isMed
                      ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                      : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
                  }`}>
                    {prob.difficulty}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">{prob.category}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {prob.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                  {prob.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">
                  {prob.sampleTestCases.length} Sample + Hidden Suites
                </span>

                <button
                  onClick={() => onOpenProblem(prob)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 transition-all shadow-sm active:scale-95"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Open Sandbox</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
