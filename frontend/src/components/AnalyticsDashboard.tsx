import React from 'react';
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Cpu, 
  MessageSquare, 
  Sparkles, 
  Download, 
  ArrowRight,
  TrendingUp,
  Brain,
  ShieldCheck,
  Video
} from 'lucide-react';
import { ScoreRecord, InterviewSession } from '../types';

interface AnalyticsDashboardProps {
  score: ScoreRecord | null;
  interview: InterviewSession | null;
  onRetake: () => void;
  onViewHistory: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  score,
  interview,
  onRetake,
  onViewHistory
}) => {
  if (!score) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
          <Award className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">No Completed Interview Selected</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Complete an interview session in the Interview Room or select a past session from History to inspect its comprehensive AI evaluation scorecard.
        </p>
        <button
          onClick={onRetake}
          className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all"
        >
          Launch Interview Simulation
        </button>
      </div>
    );
  }

  const { overallScore, codeCorrectnessScore, codeEfficiencyScore, communicationScore, timeManagementScore, strengths, improvements, competencies, nlpDetails } = score;

  const isStrongHire = overallScore >= 85;
  const isHire = overallScore >= 70 && overallScore < 85;

  const ratingLabel = isStrongHire ? 'Strong Hire' : isHire ? 'Hire' : 'Practice Recommended';
  const ratingBadgeClass = isStrongHire
    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    : isHire
    ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
    : 'text-amber-400 bg-amber-500/10 border-amber-500/20';

  const downloadReportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ interview, score }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Interview_Report_${score.interviewId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0D121F] p-5 rounded-2xl border border-white/5 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-400">Evaluation Scorecard</span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-xs text-slate-400">{interview?.track || 'Software Engineering'}</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Performance Analytics & Assessment</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={downloadReportJson}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 rounded-xl border border-white/5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
          <button
            onClick={onRetake}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-500/20 transition-all"
          >
            <span>Take Another Interview</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Score & Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Overall Score Dial Card: 4 cols */}
        <div className="md:col-span-4 bg-[#0D121F] rounded-2xl border border-white/5 p-6 flex flex-col items-center justify-center text-center shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          <span className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-4">Overall Candidate Rating</span>

          {/* Glowing Circular Score Ring */}
          <div className="relative w-36 h-36 flex items-center justify-center mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="60"
                stroke="currentColor"
                strokeWidth="8"
                className="text-slate-800"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="60"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 60}
                strokeDashoffset={2 * Math.PI * 60 * (1 - overallScore / 100)}
                strokeLinecap="round"
                className="text-indigo-500 transition-all duration-1000 ease-out"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-black text-white tracking-tight">{overallScore}</span>
              <span className="text-[11px] text-slate-400 font-medium">out of 100</span>
            </div>
          </div>

          <div className={`px-3 py-1 rounded-full text-xs font-bold border tracking-wide uppercase ${ratingBadgeClass}`}>
            {ratingLabel}
          </div>
          <p className="text-[11px] text-slate-400 mt-3 max-w-xs">
            Evaluated automatically using C++ sandboxed test execution & Python NLP linguistic modeling.
          </p>
        </div>

        {/* 4 Core Dimensions: 8 cols */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 1. Code Correctness */}
          <div className="bg-[#0D121F] p-5 rounded-2xl border border-white/5 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Code Correctness</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-extrabold text-white">{codeCorrectnessScore}%</span>
              <span className="text-xs text-slate-400 font-mono">({score.passedTestCases}/{score.totalTestCases} Tests Passed)</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full transition-all duration-700" style={{ width: `${codeCorrectnessScore}%` }} />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Pass rate across both sample cases and hidden edge test suites.</p>
          </div>

          {/* 2. Code Execution Efficiency */}
          <div className="bg-[#0D121F] p-5 rounded-2xl border border-white/5 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Execution Efficiency</span>
              <Cpu className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-extrabold text-white">{codeEfficiencyScore}%</span>
              <span className="text-xs text-slate-400 font-mono">Sub-millisecond</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-cyan-500 h-full rounded-full transition-all duration-700" style={{ width: `${codeEfficiencyScore}%` }} />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Runtime efficiency & memory footprint evaluated by C++ engine.</p>
          </div>

          {/* 3. Verbal Communication */}
          <div className="bg-[#0D121F] p-5 rounded-2xl border border-white/5 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Verbal Articulation</span>
              <MessageSquare className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-extrabold text-white">{communicationScore}%</span>
              <span className="text-xs text-slate-400 font-mono">Python NLP Engine</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full transition-all duration-700" style={{ width: `${communicationScore}%` }} />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Clarity, Big-O terminology, and STAR structural methodology.</p>
          </div>

          {/* 4. Time Management */}
          <div className="bg-[#0D121F] p-5 rounded-2xl border border-white/5 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Time Management</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-extrabold text-white">{timeManagementScore}%</span>
              <span className="text-xs text-slate-400 font-mono">Paced Delivery</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full transition-all duration-700" style={{ width: `${timeManagementScore}%` }} />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Delivery speed vs allocated interview time window.</p>
          </div>
        </div>
      </div>

      {/* Competency Breakdown & AI Feedback Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Competencies Progress Bars: 5 cols */}
        <div className="lg:col-span-5 bg-[#0D121F] rounded-2xl border border-white/5 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Core Competencies</span>
            <Brain className="w-4 h-4 text-indigo-400" />
          </div>

          <div className="space-y-3.5 pt-2">
            {[
              { label: 'Algorithms & Data Structures', val: competencies?.algorithms || 80, color: 'bg-indigo-500' },
              { label: 'Problem Solving & Strategy', val: competencies?.problemSolving || 85, color: 'bg-cyan-500' },
              { label: 'Code Quality & Cleanliness', val: competencies?.codeQuality || 75, color: 'bg-emerald-500' },
              { label: 'Verbal Articulation & Terminology', val: competencies?.verbalArticulation || 70, color: 'bg-purple-500' },
              { label: 'Execution Speed & Pacing', val: competencies?.speedAndTime || 90, color: 'bg-amber-500' },
            ].map((comp, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">{comp.label}</span>
                  <span className="font-mono text-slate-400">{comp.val}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className={`${comp.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${comp.val}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Recording & Session Summary */}
          <div className="mt-6 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
              <Video className="w-3.5 h-3.5 text-indigo-400" />
              <span>Interview Session Recording: Archived</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Video stream and speech transcripts are preserved for training review and placement cell verification.
            </p>
          </div>
        </div>

        {/* AI Mentor Insights: 7 cols */}
        <div className="lg:col-span-7 bg-[#0D121F] rounded-2xl border border-white/5 p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">AI Evaluation Feedback</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md border border-white/5">
              NLP Engine
            </span>
          </div>

          {/* Strengths */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Key Demonstrated Strengths
            </span>
            <div className="space-y-1.5">
              {strengths && strengths.map((s, i) => (
                <div key={i} className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-xs text-emerald-200 leading-relaxed">
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Areas for Improvement */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              Actionable Areas for Improvement
            </span>
            <div className="space-y-1.5">
              {improvements && improvements.map((imp, i) => (
                <div key={i} className="p-3 bg-amber-950/20 border border-amber-500/20 rounded-xl text-xs text-amber-200 leading-relaxed">
                  {imp}
                </div>
              ))}
            </div>
          </div>

          {/* Linguistic Keyword Coverage */}
          {nlpDetails && nlpDetails.detectedKeywords && nlpDetails.detectedKeywords.length > 0 && (
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Technical Algorithmic Vocabulary Detected
              </span>
              <div className="flex flex-wrap gap-1.5">
                {nlpDetails.detectedKeywords.map((kw, i) => (
                  <span key={i} className="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-lg border border-white/5">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
