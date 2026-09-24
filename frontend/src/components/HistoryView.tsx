import React, { useEffect, useState } from 'react';
import { 
  History, 
  TrendingUp, 
  Award, 
  Clock, 
  Calendar, 
  ChevronRight, 
  CheckCircle2, 
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { InterviewHistoryItem } from '../types';
import { fetchInterviewHistory } from '../services/api';

interface HistoryViewProps {
  onSelectInterview: (interviewId: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onSelectInterview }) => {
  const [historyData, setHistoryData] = useState<{
    history: InterviewHistoryItem[];
    analytics: any;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true);
      try {
        const data = await fetchInterviewHistory();
        setHistoryData(data);
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-20 text-center">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500 dark:text-slate-400">Loading interview simulation history...</p>
      </div>
    );
  }

  const { history = [], analytics } = historyData || {};

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200/80 dark:border-white/5 shadow-soft transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-teal-600 dark:text-teal-400">Progress Tracking</span>
            <span className="text-slate-300 dark:text-slate-700">&bull;</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Continuous Assessment Log</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Interview History & Trends</h1>
        </div>

        {analytics && (
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="bg-slate-50 dark:bg-[#090D16] px-4 py-2 rounded-2xl border border-slate-200 dark:border-white/5">
              <span className="text-slate-400 block text-[10px] uppercase font-sans">Simulations</span>
              <span className="text-base font-bold text-slate-900 dark:text-white">{analytics.totalInterviews}</span>
            </div>
            <div className="bg-slate-50 dark:bg-[#090D16] px-4 py-2 rounded-2xl border border-slate-200 dark:border-white/5">
              <span className="text-slate-400 block text-[10px] uppercase font-sans">Avg Score</span>
              <span className="text-base font-bold text-teal-600 dark:text-teal-400">{analytics.avgOverallScore}%</span>
            </div>
          </div>
        )}
      </div>

      {/* History Items List */}
      <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-white/5 overflow-hidden shadow-soft transition-colors">
        <div className="px-6 py-4 bg-slate-50/70 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-white/5 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Past Simulated Sessions</span>
          <span className="text-xs text-slate-500 font-mono">{history.length} Records</span>
        </div>

        {history.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No interview history recorded yet. Complete an interview in the Interview Room to start tracking your progress.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {history.map((item) => {
              const score = item.score;
              const overall = score?.overallScore || 0;
              const dateStr = new Date(item.startedAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });

              return (
                <div
                  key={item.interviewId}
                  onClick={() => onSelectInterview(item.interviewId)}
                  className="p-5 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 cursor-pointer transition-all flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 flex flex-col items-center justify-center font-mono">
                      <span className="text-base font-black text-teal-700 dark:text-teal-400">{score ? overall : '--'}</span>
                      <span className="text-[9px] text-slate-400 uppercase font-sans">SCORE</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                          {item.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="text-slate-600 dark:text-slate-300 font-medium">{item.candidateName}</span>
                        <span>&bull;</span>
                        <span>{item.track}</span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1 font-mono text-[11px]">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {dateStr}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {score && (
                      <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-slate-400">
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase font-sans">Correctness</span>
                          <span className="text-teal-600 dark:text-teal-400 font-bold">{score.codeCorrectnessScore}%</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase font-sans">Verbal NLP</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">{score.communicationScore}%</span>
                        </div>
                      </div>
                    )}

                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                      <span>View Report</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
