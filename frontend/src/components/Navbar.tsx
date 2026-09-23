import React, { useEffect, useState } from 'react';
import { 
  Terminal, 
  BarChart3, 
  History, 
  Building2, 
  BookOpen, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { fetchHealth } from '../services/api';

interface NavbarProps {
  activeTab: 'room' | 'analytics' | 'history' | 'recruiter';
  setActiveTab: (tab: 'room' | 'analytics' | 'history' | 'recruiter') => void;
  isInterviewActive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isInterviewActive
}) => {
  const [isSystemHealthy, setIsSystemHealthy] = useState<boolean>(true);

  useEffect(() => {
    const checkServices = async () => {
      try {
        const data = await fetchHealth();
        setIsSystemHealthy(
          data.services?.backendGateway?.status === 'UP' &&
          data.services?.cppCodeEvaluator?.status === 'UP' &&
          data.services?.pythonNlpEngine?.status === 'UP'
        );
      } catch {
        setIsSystemHealthy(false);
      }
    };
    checkServices();
    const interval = setInterval(checkServices, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#090D16]/80 backdrop-blur-xl border-b border-white/[0.06] transition-all">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-8">
        
        {/* Brand / Logo */}
        <div 
          onClick={() => setActiveTab('room')}
          className="flex items-center gap-3 cursor-pointer group select-none flex-shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 border border-indigo-500/30 flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm shadow-indigo-500/10">
            <Terminal className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-base tracking-tight text-white group-hover:text-slate-200 transition-colors">
              SmartInterview
            </span>
            <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              AI
            </span>
          </div>
        </div>

        {/* Center: Spacious, Minimalist Navigation Bar */}
        <nav className="flex items-center bg-slate-900/50 p-1.5 rounded-2xl border border-white/[0.06]">
          <button
            onClick={() => setActiveTab('room')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'room'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Interview</span>
            {isInterviewActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'analytics'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Scorecard</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>History</span>
          </button>

          <button
            onClick={() => setActiveTab('recruiter')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'recruiter'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Institutes</span>
          </button>
        </nav>

        {/* Right Section: System Health Status & Documentation Link */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Subtle Live Status Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 border border-white/[0.06] text-xs text-slate-400">
            <span className={`w-2 h-2 rounded-full ${isSystemHealthy ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} />
            <span className="text-[11px] font-medium text-slate-300">
              {isSystemHealthy ? 'All Systems Online' : 'Connecting Services...'}
            </span>
          </div>

          {/* Clean API Docs Link */}
          <a
            href="http://localhost:5000/api/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-xl hover:bg-white/[0.04] transition-colors font-medium border border-transparent hover:border-white/[0.05]"
            title="Open Interactive OpenAPI Swagger Docs"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">API Docs</span>
          </a>
        </div>

      </div>
    </header>
  );
};
