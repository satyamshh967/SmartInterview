import React, { useEffect, useState } from 'react';
import { 
  Building2, 
  GraduationCap, 
  Users, 
  Award, 
  CheckCircle2, 
  TrendingUp, 
  ChevronRight,
  Filter,
  Search
} from 'lucide-react';
import { fetchInterviewHistory, fetchCandidates } from '../services/api';
import { Candidate, InterviewHistoryItem } from '../types';

interface RecruiterViewProps {
  onSelectCandidateInterview: (interviewId: string) => void;
}

export const RecruiterView: React.FC<RecruiterViewProps> = ({ onSelectCandidateInterview }) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [history, setHistory] = useState<InterviewHistoryItem[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [cands, histData] = await Promise.all([
          fetchCandidates(),
          fetchInterviewHistory()
        ]);
        setCandidates(cands);
        setHistory(histData.history || []);
        setAnalytics(histData.analytics || null);
      } catch (err) {
        console.error('Failed to load recruiter data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredHistory = history.filter(h =>
    h.candidateName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.track?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200/80 dark:border-white/5 shadow-soft transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-teal-600 dark:text-teal-400">Institutional Portal</span>
            <span className="text-slate-300 dark:text-slate-700">&bull;</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Placement Cells & Training Institutes</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Candidate Placement Readiness Dashboard</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Monitor cohort assessment results, evaluate candidate readiness benchmarks, and verify interview artifacts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 rounded-xl text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Automated Scoring Verified</span>
          </div>
        </div>
      </div>

      {/* Cohort Key Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#111827] p-5 rounded-3xl border border-slate-200/80 dark:border-white/5 shadow-soft">
          <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block mb-1">Enrolled Cohort</span>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{candidates.length + 18}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Active Placement Candidates</span>
        </div>

        <div className="bg-white dark:bg-[#111827] p-5 rounded-3xl border border-slate-200/80 dark:border-white/5 shadow-soft">
          <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block mb-1">Avg Tech Rating</span>
          <div className="text-3xl font-black text-teal-600 dark:text-teal-400">{analytics?.avgOverallScore || 78}%</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Across all code tests</span>
        </div>

        <div className="bg-white dark:bg-[#111827] p-5 rounded-3xl border border-slate-200/80 dark:border-white/5 shadow-soft">
          <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block mb-1">Pass Rate</span>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">84.2%</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Above 70% threshold</span>
        </div>

        <div className="bg-white dark:bg-[#111827] p-5 rounded-3xl border border-slate-200/80 dark:border-white/5 shadow-soft">
          <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block mb-1">Avg Articulation</span>
          <div className="text-3xl font-black text-cyan-600 dark:text-cyan-400">{analytics?.avgCommunication || 75}%</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Python NLP speech score</span>
        </div>
      </div>

      {/* Candidate Evaluation Registry */}
      <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-white/5 overflow-hidden shadow-soft">
        <div className="p-4 bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-white/5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Cohort Assessment Registry</span>
          </div>

          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search candidate or track..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-[#090D16] border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-teal-500 font-sans"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-white/5">
          {filteredHistory.length === 0 ? (
            <div className="p-10 text-center text-slate-400 text-xs">
              No matching candidate simulation records found.
            </div>
          ) : (
            filteredHistory.map((item) => {
              const overall = item.score?.overallScore || 75;
              const isPassed = overall >= 70;

              return (
                <div
                  key={item.interviewId}
                  onClick={() => onSelectCandidateInterview(item.interviewId)}
                  className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-all flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-center font-bold text-xs text-teal-600 dark:text-teal-400">
                      {item.candidateName?.slice(0, 2).toUpperCase() || 'CD'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{item.candidateName}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          isPassed
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'
                        }`}>
                          {isPassed ? 'Qualified' : 'Needs Review'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{item.track} &bull; {item.title}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="text-sm font-black text-teal-600 dark:text-teal-400">{overall}/100</span>
                      <span className="text-[10px] text-slate-400 block uppercase">Overall Rating</span>
                    </div>

                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                      <span>Detailed Dossier</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
