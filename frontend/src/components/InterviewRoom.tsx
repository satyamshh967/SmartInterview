import React, { useState } from 'react';
import { 
  FileText, 
  Code2, 
  Terminal, 
  CheckCircle, 
  HelpCircle, 
  ChevronRight, 
  Sparkles, 
  Play, 
  CheckCircle2, 
  Send,
  Sliders,
  ChevronDown
} from 'lucide-react';
import { Problem, InterviewSession, EvaluationResult, NLPFeedback } from '../types';
import { CodeEditor } from './CodeEditor';
import { ConsoleOutput } from './ConsoleOutput';
import { VideoRecorder } from './VideoRecorder';
import { Timer } from './Timer';
import { evaluateCodeSubmission } from '../services/api';

interface InterviewRoomProps {
  interview: InterviewSession | null;
  problems: Problem[];
  onStartNewSession: (difficulty: string, track: string) => void;
  onFinishInterview: (transcript: string, timeTakenSec: number) => void;
  isStarting: boolean;
}

export const InterviewRoom: React.FC<InterviewRoomProps> = ({
  interview,
  problems,
  onStartNewSession,
  onFinishInterview,
  isStarting
}) => {
  const [activeProblemIndex, setActiveProblemIndex] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('python');
  const [codeMap, setCodeMap] = useState<{ [problemId: string]: string }>({});
  const [evalResult, setEvalResult] = useState<EvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [showFinishConfirm, setShowFinishConfirm] = useState<boolean>(false);

  // Setup form states for starting new interview
  const [newDifficulty, setNewDifficulty] = useState<string>('Medium');
  const [newTrack, setNewTrack] = useState<string>('Fullstack & Algorithms');

  // If no interview is currently started, render start session screen
  if (!interview || problems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Technical Assessment</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Start Your Technical Interview Simulation
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Practice realistic timed coding interviews with multi-language sandboxed execution and real-time verbal communication evaluation.
          </p>
        </div>

        <div className="bg-[#0D121F] rounded-2xl border border-white/5 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Interview Track
              </label>
              <select
                value={newTrack}
                onChange={(e) => setNewTrack(e.target.value)}
                className="w-full bg-[#090D16] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="Fullstack & Algorithms">Fullstack Software Engineering</option>
                <option value="Backend Systems & Architecture">Backend Systems & Distributed Logic</option>
                <option value="Data Structures & Algorithms">Core DSA (Arrays, Stacks, Trees)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Target Difficulty
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Easy', 'Medium', 'Hard'].map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setNewDifficulty(diff)}
                    className={`py-3 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      newDifficulty === diff
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                        : 'bg-[#090D16] border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Included Features Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/5">
            <div className="p-3.5 bg-[#090D16] rounded-xl border border-white/5">
              <span className="text-xs font-semibold text-slate-200 block mb-1">C++ Sandboxed Evaluator</span>
              <p className="text-[11px] text-slate-400 leading-normal">
                Sub-millisecond test suite execution with strict memory and time limit monitoring.
              </p>
            </div>
            <div className="p-3.5 bg-[#090D16] rounded-xl border border-white/5">
              <span className="text-xs font-semibold text-slate-200 block mb-1">Python NLP Analysis</span>
              <p className="text-[11px] text-slate-400 leading-normal">
                Speech-to-text scoring evaluating Big-O articulation, clarity, and structural coherence.
              </p>
            </div>
            <div className="p-3.5 bg-[#090D16] rounded-xl border border-white/5">
              <span className="text-xs font-semibold text-slate-200 block mb-1">Detailed Scorecard</span>
              <p className="text-[11px] text-slate-400 leading-normal">
                Multi-dimensional radar competency metrics, strengths, and areas for improvement.
              </p>
            </div>
          </div>

          <button
            onClick={() => onStartNewSession(newDifficulty, newTrack)}
            disabled={isStarting}
            className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-400 shadow-xl shadow-indigo-500/25 transition-all active:scale-[0.99] disabled:opacity-50"
          >
            {isStarting ? 'Preparing Interview Room...' : 'Enter Interview Room & Start Timer'}
          </button>
        </div>
      </div>
    );
  }

  const currentProblem = problems[activeProblemIndex] || problems[0];

  // Get active code
  const currentCode = codeMap[currentProblem.id] ||
    (currentProblem.starterCode[selectedLanguage as keyof typeof currentProblem.starterCode] || '');

  const handleCodeChange = (newCode: string) => {
    setCodeMap((prev) => ({ ...prev, [currentProblem.id]: newCode }));
  };

  const handleLanguageChange = (newLang: string) => {
    setSelectedLanguage(newLang);
    const starter = currentProblem.starterCode[newLang as keyof typeof currentProblem.starterCode] || '';
    setCodeMap((prev) => ({ ...prev, [currentProblem.id]: starter }));
  };

  const handleResetCode = () => {
    const starter = currentProblem.starterCode[selectedLanguage as keyof typeof currentProblem.starterCode] || '';
    setCodeMap((prev) => ({ ...prev, [currentProblem.id]: starter }));
  };

  const handleRunSampleTests = async (codeToRun: string, lang: string) => {
    setIsEvaluating(true);
    setEvalResult(null);
    try {
      const res = await evaluateCodeSubmission({
        interviewId: interview.id,
        problemId: currentProblem.id,
        language: lang,
        code: codeToRun,
        isSampleOnly: true
      });
      setEvalResult(res.evaluation);
    } catch (err: any) {
      console.error('Run failed:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleSubmitFullSolution = async (codeToRun: string, lang: string) => {
    setIsEvaluating(true);
    setEvalResult(null);
    try {
      const res = await evaluateCodeSubmission({
        interviewId: interview.id,
        problemId: currentProblem.id,
        language: lang,
        code: codeToRun,
        isSampleOnly: false
      });
      setEvalResult(res.evaluation);
    } catch (err: any) {
      console.error('Submit failed:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="max-w-[1720px] mx-auto px-4 lg:px-6 py-4 space-y-4">
      {/* Top Session Control Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0D121F] p-3 rounded-2xl border border-white/5 shadow-md">
        {/* Left: Interview Title & Problem Switcher */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <h2 className="text-sm font-bold text-white tracking-tight">{interview.title}</h2>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="text-indigo-400 font-medium">{interview.track}</span>
              <span>&bull;</span>
              <span className="text-slate-300">{interview.difficulty}</span>
            </div>
          </div>

          <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />

          {/* Problem Tabs */}
          <div className="flex items-center gap-1.5 bg-[#090D16] p-1 rounded-xl border border-white/5">
            {problems.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => {
                  setActiveProblemIndex(idx);
                  setEvalResult(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  activeProblemIndex === idx
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <span>Q{idx + 1}: {p.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Live Countdown Timer & Conclude Action */}
        <div className="flex items-center gap-3">
          <Timer
            initialMinutes={interview.timeLimitMinutes || 35}
            onSecondsUpdated={(sec) => setElapsedSeconds(sec)}
            onTimeExpired={() => onFinishInterview(transcript, elapsedSeconds)}
          />

          <button
            onClick={() => setShowFinishConfirm(true)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 active:scale-95 transition-all"
          >
            End Interview
          </button>
        </div>
      </div>

      {/* Main Workspace: 3-column / 2-column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column (Problem Description): 4 cols */}
        <div className="lg:col-span-4 bg-[#0D121F] rounded-2xl border border-white/5 p-5 h-[calc(100vh-170px)] overflow-y-auto space-y-4 shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                currentProblem.difficulty === 'Easy'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : currentProblem.difficulty === 'Medium'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}>
                {currentProblem.difficulty}
              </span>
              <span className="text-[11px] text-slate-400">{currentProblem.category}</span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">{currentProblem.title}</h1>
          </div>

          {/* Description */}
          <div className="text-slate-300 text-xs leading-relaxed space-y-3 whitespace-pre-wrap font-sans">
            {currentProblem.description}
          </div>

          {/* Examples */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Examples</h3>
            {currentProblem.examples.map((ex, i) => (
              <div key={i} className="p-3 bg-[#090D16] rounded-xl border border-white/5 space-y-1.5 text-xs font-mono">
                <div>
                  <span className="text-slate-500 font-bold block text-[10px] uppercase">Input</span>
                  <span className="text-slate-200">{ex.input}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block text-[10px] uppercase">Output</span>
                  <span className="text-emerald-400 font-semibold">{ex.output}</span>
                </div>
                {ex.explanation && (
                  <div>
                    <span className="text-slate-500 font-bold block text-[10px] uppercase font-sans">Explanation</span>
                    <span className="text-slate-400 font-sans text-[11px]">{ex.explanation}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Constraints */}
          <div className="pt-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Constraints</h3>
            <ul className="space-y-1 text-xs font-mono text-slate-400 list-disc list-inside">
              {currentProblem.constraints.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>

          {/* AI Interviewer Prompt */}
          <div className="p-3 bg-indigo-950/20 rounded-xl border border-indigo-500/20 text-xs">
            <div className="flex items-center gap-1.5 text-indigo-300 font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Interviewer Tip</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              State your time and space complexity explicitly before writing code. Use the communication box below to articulate your thought process.
            </p>
          </div>
        </div>

        {/* Center Column (Code Editor & Test Console): 5 cols */}
        <div className="lg:col-span-5 flex flex-col gap-4 h-[calc(100vh-170px)]">
          <div className="flex-1 min-h-[380px]">
            <CodeEditor
              initialCode={currentCode}
              language={selectedLanguage}
              onLanguageChange={handleLanguageChange}
              onRunSample={handleRunSampleTests}
              onSubmitFull={handleSubmitFullSolution}
              onReset={handleResetCode}
              isEvaluating={isEvaluating}
              statusBadge={evalResult?.status}
            />
          </div>

          <div className="h-64">
            <ConsoleOutput
              result={evalResult}
              isEvaluating={isEvaluating}
            />
          </div>
        </div>

        {/* Right Column (Video Feed & NLP Explanation): 3 cols */}
        <div className="lg:col-span-3 h-[calc(100vh-170px)] overflow-y-auto">
          <VideoRecorder
            interviewId={interview.id}
            problemId={currentProblem.id}
            code={currentCode}
            onTranscriptChange={(t) => setTranscript(t)}
          />
        </div>
      </div>

      {/* Confirmation Modal to End Interview */}
      {showFinishConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0D121F] max-w-md w-full p-6 rounded-2xl border border-white/10 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Conclude Technical Interview?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Submitting now will finalize all code solutions, evaluate hidden edge cases with the C++ engine, and generate your comprehensive NLP communication scorecard.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowFinishConfirm(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 rounded-xl transition-colors"
              >
                Continue Interview
              </button>
              <button
                onClick={() => {
                  setShowFinishConfirm(false);
                  onFinishInterview(transcript, elapsedSeconds);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-500/20 transition-all"
              >
                Submit & View Scorecard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
