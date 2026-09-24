import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { CandidateListCard, CandidateItem } from './components/CandidateListCard';
import { VideoStage } from './components/VideoStage';
import { TeamFeedbackCard } from './components/TeamFeedbackCard';
import { QuestionRoadmapCard } from './components/QuestionRoadmapCard';
import { AIScoreSummaryCard } from './components/AIScoreSummaryCard';
import { MetricDonutCard } from './components/MetricDonutCard';
import { CodeModal } from './components/CodeModal';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { HistoryView } from './components/HistoryView';
import { RecruiterView } from './components/RecruiterView';
import { Problem, InterviewSession, ScoreRecord } from './types';
import { fetchQuestions, fetchCandidates } from './services/api';

const INITIAL_CANDIDATES: CandidateItem[] = [
  {
    id: 'cand-1',
    name: 'Seo Jan Im',
    role: 'Fullstack Talent',
    status: 'Approved',
    score: 85,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'cand-2',
    name: 'Devon Lane',
    role: 'Backend Specialist',
    status: 'Rejected',
    score: 55,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'cand-3',
    name: 'Arlene McCoy',
    role: 'Algorithms Engineer',
    status: 'Approved',
    score: 95,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'cand-4',
    name: 'Esther Howard',
    role: 'System Architect',
    status: 'Rejected',
    score: 48,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'cand-5',
    name: 'Jane Coper',
    role: 'Fullstack Developer',
    status: 'Approved',
    score: 78,
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&auto=format&fit=crop&q=80'
  }
];

export function App() {
  // Theme state: default to 'light' as shown in the reference screenshot
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('app-theme') as 'light' | 'dark') || 'light';
  });

  const [activeView, setActiveView] = useState<string>('interview');
  const [candidatesList, setCandidatesList] = useState<CandidateItem[]>(INITIAL_CANDIDATES);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateItem>(INITIAL_CANDIDATES[0]);
  const [activeStep, setActiveStep] = useState<number>(2);

  // Question & Code sandbox states
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState<boolean>(false);
  const [activeInterview, setActiveInterview] = useState<InterviewSession | null>(null);

  // Sync theme with DOM
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const loadProblems = async () => {
      try {
        const data = await fetchQuestions();
        if (data && data.length > 0) {
          setProblems(data);
        }
      } catch (e) {
        console.error('Error fetching questions:', e);
      }
    };
    loadProblems();
  }, []);

  const activeProblem = problems[0] || {
    id: 'prob-001',
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    category: 'Arrays & Hash Tables',
    timeLimitMinutes: 15,
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0, 1]' }],
    constraints: ['2 <= nums.length <= 10^4'],
    starterCode: { python: 'import sys, json\n# Two Sum solution' },
    sampleTestCases: [{ id: 'tc-1', input: '[2,7,11,15]\n9', expectedOutput: '[0, 1]' }]
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-theme-bg dark:bg-theme-darkBg font-sans transition-colors">
      {/* 1. Left Icon Rail Sidebar */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* 2. Top Header Bar */}
        <TopHeader
          theme={theme}
          toggleTheme={toggleTheme}
          roleTitle="Assistant Project Manager / SWE"
          onOpenCodeEditor={() => setIsCodeModalOpen(true)}
        />

        {/* 3. Main Stage Content */}
        <main className="flex-1 p-5 md:p-6 lg:p-7 overflow-y-auto space-y-6">
          {activeView === 'interview' && (
            <>
              {/* Top Tier: All Candidates Panel (Left) & Video Stage (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                {/* Left: All Candidates Panel (4 cols) */}
                <div className="lg:col-span-4 h-full min-h-[380px]">
                  <CandidateListCard
                    candidates={candidatesList}
                    selectedId={selectedCandidate.id}
                    onSelectCandidate={(cand) => setSelectedCandidate(cand)}
                  />
                </div>

                {/* Right: Main Video Player Stage (8 cols) */}
                <div className="lg:col-span-8 h-full">
                  <VideoStage
                    candidate={selectedCandidate}
                    questionNumber={activeStep}
                    questionTitle={
                      activeStep === 2
                        ? "Question 2: Why do you think you are good at technical problem solving and sales?"
                        : "Question 1: Tell us about your background and engineering projects?"
                    }
                    transcript="I'm an extremely ambitious person which motivates me in my professional life. In this problem, my approach uses a hash map to achieve O(n) linear time complexity and avoids the O(n^2) brute-force nested loop."
                    onOpenCodeEditor={() => setIsCodeModalOpen(true)}
                  />
                </div>
              </div>

              {/* Bottom Tier: 4 Metric & Feedback Cards in a Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
                {/* 1. Team Feedback */}
                <TeamFeedbackCard />

                {/* 2. Question List / Roadmap */}
                <QuestionRoadmapCard
                  activeStep={activeStep}
                  onSelectStep={(step) => {
                    setActiveStep(step);
                    if (step === 2 || step === 3) {
                      setIsCodeModalOpen(true);
                    }
                  }}
                />

                {/* 3. AI Score Summary */}
                <AIScoreSummaryCard
                  score={selectedCandidate.score}
                  summaryText="The presentation of talent is good. Algorithmic trade-offs and Big-O complexity are articulated cleanly."
                  onHireTalent={() => setActiveView('analytics')}
                />

                {/* 4. AI Video Score Detail (4 Donut Rings) */}
                <MetricDonutCard
                  metrics={{
                    correctness: 80,
                    complexity: 90,
                    communication: 65,
                    speed: 85
                  }}
                  onRefresh={() => {
                    setSelectedCandidate(prev => ({
                      ...prev,
                      score: Math.min(99, prev.score + 1)
                    }));
                  }}
                  onExpand={() => setActiveView('analytics')}
                />
              </div>
            </>
          )}

          {activeView === 'analytics' && (
            <AnalyticsDashboard
              score={{
                id: 'score-1',
                interviewId: 'int-1',
                candidateId: selectedCandidate.id,
                overallScore: selectedCandidate.score,
                codeCorrectnessScore: 88,
                codeEfficiencyScore: 92,
                communicationScore: 78,
                timeManagementScore: 85,
                totalTestCases: 4,
                passedTestCases: 4,
                strengths: [
                  'Strong algorithmic reasoning with explicit O(n) linear time complexity analysis.',
                  'Clear and structured problem-solving approach.'
                ],
                improvements: [
                  'Elaborate more on negative and duplicate integer edge cases.'
                ],
                competencies: {
                  algorithms: 85,
                  problemSolving: 90,
                  codeQuality: 88,
                  verbalArticulation: 78,
                  speedAndTime: 85
                },
                createdAt: new Date().toISOString()
              }}
              interview={activeInterview}
              onRetake={() => setActiveView('interview')}
              onViewHistory={() => setActiveView('history')}
            />
          )}

          {activeView === 'history' && (
            <HistoryView
              onSelectInterview={() => setActiveView('analytics')}
            />
          )}

          {activeView === 'settings' && (
            <div className="max-w-2xl mx-auto py-12 text-center bg-white dark:bg-[#111827] rounded-3xl p-8 border border-slate-200 dark:border-white/5 shadow-soft">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Platform Settings & Service APIs</h2>
              <p className="text-xs text-slate-500 mb-6">Explore the multi-language backend architecture and interactive documentation.</p>
              <div className="flex justify-center gap-4">
                <a
                  href="http://localhost:5000/api/docs"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold"
                >
                  Open Swagger API Docs
                </a>
                <button
                  onClick={() => setActiveView('interview')}
                  className="px-4 py-2 border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Back to Interview Stage
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Code Sandbox Modal (C++ Evaluation Engine) */}
      <CodeModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        problem={activeProblem}
        interview={activeInterview}
        onTestResultsUpdated={(res) => {
          if (res.status === 'ACCEPTED') {
            setSelectedCandidate(prev => ({ ...prev, score: Math.min(99, prev.score + 5) }));
          }
        }}
      />
    </div>
  );
}

export default App;
