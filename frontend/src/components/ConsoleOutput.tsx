import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Cpu, 
  Terminal, 
  AlertCircle,
  EyeOff
} from 'lucide-react';
import { EvaluationResult } from '../types';

interface ConsoleOutputProps {
  result: EvaluationResult | null;
  isEvaluating: boolean;
}

export const ConsoleOutput: React.FC<ConsoleOutputProps> = ({
  result,
  isEvaluating
}) => {
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);

  if (isEvaluating) {
    return (
      <div className="h-48 flex flex-col items-center justify-center bg-[#0D121F] rounded-2xl border border-white/5 p-6 text-slate-400">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-medium text-slate-300">Evaluating in C++ Sandboxed Environment...</p>
        <p className="text-[11px] text-slate-500 mt-1">Executing test suite with strict time and memory monitoring</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="h-48 flex flex-col items-center justify-center bg-[#0D121F] rounded-2xl border border-white/5 p-6 text-slate-500">
        <Terminal className="w-6 h-6 mb-2 opacity-50" />
        <p className="text-xs">Run or Submit your solution to inspect test outputs and execution performance.</p>
      </div>
    );
  }

  const { status, totalTestCases, passedTestCases, totalExecutionTimeMs, peakMemoryKb, compilationError, details } = result;

  const isAccepted = status === 'ACCEPTED';
  const currentCase = details && details.length > activeCaseIndex ? details[activeCaseIndex] : null;

  return (
    <div className="flex flex-col h-full max-h-72 bg-[#0D121F] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
      {/* Console Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Test Results</span>

          {/* Status Badge */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold">
            {isAccepted ? (
              <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Accepted ({passedTestCases}/{totalTestCases})
              </span>
            ) : status === 'TIME_LIMIT_EXCEEDED' ? (
              <span className="flex items-center gap-1 text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                <Clock className="w-3.5 h-3.5" />
                Time Limit Exceeded
              </span>
            ) : status === 'COMPILATION_ERROR' ? (
              <span className="flex items-center gap-1 text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-md">
                <AlertCircle className="w-3.5 h-3.5" />
                Compilation Error
              </span>
            ) : (
              <span className="flex items-center gap-1 text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-md">
                <XCircle className="w-3.5 h-3.5" />
                Wrong Answer ({passedTestCases}/{totalTestCases} Passed)
              </span>
            )}
          </div>
        </div>

        {/* Runtime & Memory Pills */}
        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1 bg-slate-800/60 px-2 py-0.5 rounded-md border border-white/5" title="Execution Time">
            <Clock className="w-3 h-3 text-indigo-400" />
            <span>{totalExecutionTimeMs} ms</span>
          </div>
          <div className="flex items-center gap-1 bg-slate-800/60 px-2 py-0.5 rounded-md border border-white/5" title="Peak Memory">
            <Cpu className="w-3 h-3 text-cyan-400" />
            <span>{peakMemoryKb} KB</span>
          </div>
        </div>
      </div>

      {/* Compilation Error View */}
      {compilationError && (
        <div className="p-4 bg-rose-950/20 border-b border-rose-500/20 text-rose-300 font-mono text-xs overflow-auto max-h-48">
          <p className="font-semibold text-rose-400 mb-1">Diagnostic Output:</p>
          <pre className="whitespace-pre-wrap">{compilationError}</pre>
        </div>
      )}

      {/* Test Case Tabs */}
      {details && details.length > 0 && (
        <div className="flex items-center gap-1.5 px-4 pt-2.5 bg-[#0A0E17] border-b border-white/5 overflow-x-auto">
          {details.map((tc, idx) => (
            <button
              key={tc.id || idx}
              onClick={() => setActiveCaseIndex(idx)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-t-lg text-xs font-mono transition-all ${
                activeCaseIndex === idx
                  ? 'bg-[#0D121F] text-white border-t border-x border-white/10 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {tc.passed ? (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              )}
              <span>Case {idx + 1}</span>
              {tc.isHidden && <EyeOff className="w-2.5 h-2.5 text-slate-500" />}
            </button>
          ))}
        </div>
      )}

      {/* Selected Test Case Details */}
      {currentCase && (
        <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-xs bg-[#0D121F]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Input */}
            <div className="bg-[#090D16] p-2.5 rounded-xl border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">Input</span>
              <pre className="text-slate-200 whitespace-pre-wrap">{currentCase.input || '(no stdin input)'}</pre>
            </div>

            {/* Expected Output */}
            <div className="bg-[#090D16] p-2.5 rounded-xl border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">Expected Output</span>
              <pre className="text-slate-200 whitespace-pre-wrap">{currentCase.expectedOutput}</pre>
            </div>
          </div>

          {/* Actual Output */}
          <div className={`p-2.5 rounded-xl border ${currentCase.passed ? 'bg-emerald-950/20 border-emerald-500/20' : 'bg-rose-950/20 border-rose-500/20'}`}>
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[10px] uppercase font-bold tracking-wider ${currentCase.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                Actual Output
              </span>
              <span className="text-[10px] text-slate-400">
                {currentCase.executionTimeMs} ms &bull; {currentCase.memoryKb} KB
              </span>
            </div>
            <pre className={`whitespace-pre-wrap ${currentCase.passed ? 'text-emerald-200' : 'text-rose-200'}`}>
              {currentCase.actualOutput || (currentCase.passed ? '(matched)' : '(empty output)')}
            </pre>
            {currentCase.error && (
              <div className="mt-2 pt-2 border-t border-rose-500/20 text-rose-400 text-[11px]">
                {currentCase.error}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
