import React, { useState } from 'react';
import { 
  Sliders, 
  Cpu, 
  Brain, 
  Mic, 
  Video, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  BookOpen,
  Volume2
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [savedAlert, setSavedAlert] = useState<boolean>(false);
  const [timeLimit, setTimeLimit] = useState<number>(30);
  const [sandboxTimeout, setSandboxTimeout] = useState<number>(3500);
  const [memoryLimit, setMemoryLimit] = useState<number>(128);
  const [nlpStrictness, setNlpStrictness] = useState<string>('balanced');
  const [requireWebcam, setRequireWebcam] = useState<boolean>(true);
  const [autoSubmit, setAutoSubmit] = useState<boolean>(true);

  const handleSave = () => {
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200/80 dark:border-white/5 shadow-soft transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-teal-600 dark:text-teal-400">System Preferences</span>
            <span className="text-slate-300 dark:text-slate-700">&bull;</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Platform Configuration</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Settings & Engine Parameters</h1>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 transition-all shadow-md shadow-teal-500/20 active:scale-95"
        >
          {savedAlert ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{savedAlert ? 'Settings Saved' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Interview Session Configuration */}
        <div className="bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200/80 dark:border-white/5 shadow-soft space-y-4 transition-colors">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
            <Sliders className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Interview Session Rules</span>
          </div>

          <div className="space-y-3.5 pt-1">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Default Duration (Minutes)
              </label>
              <select
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-[#090D16] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500"
              >
                <option value={15}>15 Minutes (Express Screening)</option>
                <option value={30}>30 Minutes (Standard Interview)</option>
                <option value={45}>45 Minutes (Full Deep Dive)</option>
                <option value={60}>60 Minutes (Comprehensive)</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Require Live Webcam</span>
                <span className="text-[11px] text-slate-400">Stream candidate video during simulation</span>
              </div>
              <input
                type="checkbox"
                checked={requireWebcam}
                onChange={(e) => setRequireWebcam(e.target.checked)}
                className="w-4 h-4 accent-teal-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Auto-Submit on Timer Expiry</span>
                <span className="text-[11px] text-slate-400">Evaluate current code state automatically</span>
              </div>
              <input
                type="checkbox"
                checked={autoSubmit}
                onChange={(e) => setAutoSubmit(e.target.checked)}
                className="w-4 h-4 accent-teal-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 2. C++ Process Sandbox Config */}
        <div className="bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200/80 dark:border-white/5 shadow-soft space-y-4 transition-colors">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
            <Cpu className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>C++ Code Evaluator Engine (:8082)</span>
          </div>

          <div className="space-y-4 pt-1">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Process Timeout Limit</span>
                <span className="font-mono text-teal-600 dark:text-teal-400 font-bold">{sandboxTimeout} ms</span>
              </div>
              <input
                type="range"
                min="1000"
                max="8000"
                step="500"
                value={sandboxTimeout}
                onChange={(e) => setSandboxTimeout(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Maximum allowed execution time before TLE signal</span>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Memory Cap per Process</span>
                <span className="font-mono text-teal-600 dark:text-teal-400 font-bold">{memoryLimit} MB</span>
              </div>
              <input
                type="range"
                min="64"
                max="512"
                step="32"
                value={memoryLimit}
                onChange={(e) => setMemoryLimit(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Windows WorkingSet ceiling enforced on user code</span>
            </div>
          </div>
        </div>

        {/* 3. Python NLP Feedback Engine Config */}
        <div className="bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200/80 dark:border-white/5 shadow-soft space-y-4 transition-colors">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
            <Brain className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Python NLP Scoring Engine (:8081)</span>
          </div>

          <div className="space-y-3 pt-1">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Linguistic Evaluation Strictness
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['lenient', 'balanced', 'strict'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setNlpStrictness(lvl)}
                    className={`py-2 text-xs font-bold capitalize rounded-xl border transition-all ${
                      nlpStrictness === lvl
                        ? 'bg-teal-50 dark:bg-teal-500/10 border-teal-500 text-teal-700 dark:text-teal-400'
                        : 'border-slate-200 dark:border-white/10 text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
              Controls the weighting of algorithmic vocabulary density, Big-O identification, and structural STAR method markers.
            </p>
          </div>
        </div>

        {/* 4. Connected Services Status & API Docs */}
        <div className="bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200/80 dark:border-white/5 shadow-soft space-y-4 transition-colors">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Microservice Infrastructure</span>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-[#090D16] rounded-xl border border-slate-200 dark:border-white/5">
              <span className="text-slate-600 dark:text-slate-300">C++ Evaluator Service</span>
              <span className="text-teal-600 dark:text-teal-400 font-bold">PORT 8082 (Active)</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-[#090D16] rounded-xl border border-slate-200 dark:border-white/5">
              <span className="text-slate-600 dark:text-slate-300">Python NLP Engine</span>
              <span className="text-teal-600 dark:text-teal-400 font-bold">PORT 8081 (Active)</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-[#090D16] rounded-xl border border-slate-200 dark:border-white/5">
              <span className="text-slate-600 dark:text-slate-300">Node API Gateway</span>
              <span className="text-teal-600 dark:text-teal-400 font-bold">PORT 5000 (Active)</span>
            </div>
          </div>

          <div className="pt-2">
            <a
              href="http://localhost:5000/api/docs"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Explore Interactive OpenAPI / Swagger Docs &rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
