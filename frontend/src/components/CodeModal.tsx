import React, { useState } from 'react';
import { X, Terminal, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { Problem, EvaluationResult, InterviewSession } from '../types';
import { CodeEditor } from './CodeEditor';
import { ConsoleOutput } from './ConsoleOutput';
import { VideoRecorder } from './VideoRecorder';
import { evaluateCodeSubmission } from '../services/api';

interface CodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  problem: Problem;
  interview: InterviewSession | null;
  onTestResultsUpdated?: (result: EvaluationResult) => void;
}

export const CodeModal: React.FC<CodeModalProps> = ({
  isOpen,
  onClose,
  problem,
  interview,
  onTestResultsUpdated
}) => {
  if (!isOpen) return null;

  const [selectedLanguage, setSelectedLanguage] = useState<string>('python');
  const [code, setCode] = useState<string>(
    problem.starterCode.python || ''
  );
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evalResult, setEvalResult] = useState<EvaluationResult | null>(null);

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    setCode(problem.starterCode[lang as keyof typeof problem.starterCode] || '');
  };

  const handleRunSample = async (codeToRun: string, lang: string) => {
    setIsEvaluating(true);
    try {
      const res = await evaluateCodeSubmission({
        interviewId: interview?.id,
        problemId: problem.id,
        language: lang,
        code: codeToRun,
        isSampleOnly: true
      });
      setEvalResult(res.evaluation);
      if (onTestResultsUpdated) onTestResultsUpdated(res.evaluation);
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleSubmitFull = async (codeToRun: string, lang: string) => {
    setIsEvaluating(true);
    try {
      const res = await evaluateCodeSubmission({
        interviewId: interview?.id,
        problemId: problem.id,
        language: lang,
        code: codeToRun,
        isSampleOnly: false
      });
      setEvalResult(res.evaluation);
      if (onTestResultsUpdated) onTestResultsUpdated(res.evaluation);
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-[#090D16] text-white w-full max-w-6xl h-[90vh] rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900/90 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">{problem.title}</h2>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  {problem.difficulty}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">C++ Native Process Evaluation & Memory Sandbox</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-5 overflow-hidden">
          {/* Left Problem Info: 4 cols */}
          <div className="lg:col-span-4 bg-[#0D121F] rounded-2xl border border-white/5 p-4 overflow-y-auto space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Problem Statement</span>
              <p className="text-xs text-slate-300 mt-2 whitespace-pre-wrap leading-relaxed">
                {problem.description}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Examples</span>
              <div className="space-y-2 mt-2">
                {problem.examples.map((ex, i) => (
                  <div key={i} className="p-2.5 bg-[#090D16] rounded-xl border border-white/5 font-mono text-[11px]">
                    <div className="text-slate-400">In: <span className="text-slate-200">{ex.input}</span></div>
                    <div className="text-emerald-400 font-semibold">Out: {ex.output}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Constraints</span>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400 mt-1 font-mono">
                {problem.constraints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Center/Right Code Editor & Console: 8 cols */}
          <div className="lg:col-span-8 flex flex-col gap-4 overflow-hidden h-full">
            <div className="flex-1 min-h-[300px]">
              <CodeEditor
                initialCode={code}
                language={selectedLanguage}
                onLanguageChange={handleLanguageChange}
                onRunSample={handleRunSample}
                onSubmitFull={handleSubmitFull}
                onReset={() => setCode(problem.starterCode[selectedLanguage as keyof typeof problem.starterCode] || '')}
                isEvaluating={isEvaluating}
                statusBadge={evalResult?.status}
              />
            </div>

            <div className="h-56">
              <ConsoleOutput
                result={evalResult}
                isEvaluating={isEvaluating}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
