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
import { CandidatesView } from './components/CandidatesView';
import { QuestionBankView } from './components/QuestionBankView';
import { SettingsView } from './components/SettingsView';
import { InterviewRoom } from './components/InterviewRoom';
import { TakeInterviewBanner } from './components/TakeInterviewBanner';
import { TakeInterviewModal } from './components/TakeInterviewModal';
import { ThemeSelectorModal, ThemeMode, AccentColor } from './components/ThemeSelectorModal';
import { Problem, InterviewSession, ScoreRecord } from './types';
import { fetchQuestions, fetchCandidates, startInterviewSession } from './services/api';

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
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'
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

const ACCENT_MAP: Record<AccentColor, { [shade: number]: string }> = {
  blue: {
    50: '239 246 255',
    100: '219 234 254',
    200: '191 219 254',
    300: '147 197 253',
    400: '96 165 250',
    500: '59 130 246',
    600: '37 99 235',
    700: '29 78 216',
    800: '30 64 175',
    900: '30 58 138',
    950: '23 37 84'
  },
  teal: {
    50: '240 253 250',
    100: '204 251 241',
    200: '153 246 228',
    300: '94 234 212',
    400: '45 212 191',
    500: '20 184 166',
    600: '13 148 136',
    700: '15 118 110',
    800: '17 94 89',
    900: '19 78 74',
    950: '4 47 46'
  },
  emerald: {
    50: '236 253 245',
    100: '209 250 229',
    200: '167 243 208',
    300: '110 231 183',
    400: '52 211 153',
    500: '16 185 129',
    600: '5 150 105',
    700: '4 120 87',
    800: '6 95 70',
    900: '6 78 59',
    950: '2 44 34'
  },
  cyan: {
    50: '236 254 255',
    100: '207 250 254',
    200: '165 243 252',
    300: '103 232 249',
    400: '34 211 238',
    500: '6 182 212',
    600: '8 145 178',
    700: '14 116 144',
    800: '21 94 117',
    900: '22 78 99',
    950: '8 51 68'
  },
  amber: {
    50: '255 251 235',
    100: '254 243 199',
    200: '253 230 138',
    300: '252 211 77',
    400: '251 191 36',
    500: '245 158 11',
    600: '217 119 6',
    700: '180 83 9',
    800: '146 64 14',
    900: '120 53 15',
    950: '69 26 3'
  },
  slate: {
    50: '248 250 252',
    100: '241 245 249',
    200: '226 232 240',
    300: '203 213 225',
    400: '148 163 184',
    500: '100 116 139',
    600: '71 85 105',
    700: '51 65 85',
    800: '30 41 59',
    900: '15 23 42',
    950: '2 6 23'
  }
};

export function App() {
  // Theme state: default strictly to 'light' (Clean All-White)
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [accentColor, setAccentColor] = useState<AccentColor>(() => {
    const saved = localStorage.getItem('app-accent-color');
    if (saved && ['blue', 'teal', 'emerald', 'cyan', 'amber', 'slate'].includes(saved)) {
      return saved as AccentColor;
    }
    return 'blue';
  });

  const [activeView, setActiveView] = useState<string>('dashboard');
  const [candidatesList, setCandidatesList] = useState<CandidateItem[]>(INITIAL_CANDIDATES);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateItem>(INITIAL_CANDIDATES[0]);
  const [activeStep, setActiveStep] = useState<number>(2);

  // Question & Code sandbox states
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState<boolean>(false);
  const [activeInterview, setActiveInterview] = useState<InterviewSession | null>(null);

  // Modals
  const [isTakeInterviewModalOpen, setIsTakeInterviewModalOpen] = useState<boolean>(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false);
  const [isStartingInterview, setIsStartingInterview] = useState<boolean>(false);

  // Sync theme with DOM
  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('app-theme-mode', themeMode);
  }, [themeMode]);

  // Apply accent directly to DOM root style & attribute
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-accent', accentColor);
    const shades = ACCENT_MAP[accentColor] || ACCENT_MAP.blue;
    Object.entries(shades).forEach(([shade, rgb]) => {
      root.style.setProperty(`--color-accent-${shade}`, rgb);
    });
    localStorage.setItem('app-accent-color', accentColor);
  }, [accentColor]);

  const toggleTheme = () => {
    setThemeMode(prev => prev === 'dark' ? 'light' : 'dark');
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

  const handleStartInterview = async (track: string, difficulty: string) => {
    setIsStartingInterview(true);
    try {
      const data = await startInterviewSession({
        candidateId: selectedCandidate.id,
        difficulty,
        track
      });
      if (data?.interview) {
        setActiveInterview(data.interview);
        if (data.problems?.length) {
          setProblems(data.problems);
        }
      }
    } catch (err) {
      console.warn('Backend interview start failed, using local simulation session:', err);
      // Fallback interview session
      setActiveInterview({
        id: `int-${Date.now()}`,
        candidateId: selectedCandidate.id,
        candidateName: selectedCandidate.name,
        title: `${track} Interview Assessment`,
        track,
        difficulty,
        status: 'in_progress',
        startedAt: new Date().toISOString(),
        timeLimitMinutes: difficulty === 'Hard' ? 45 : difficulty === 'Easy' ? 15 : 30,
        problemIds: problems.map(p => p.id),
        currentProblemIndex: 0
      });
    } finally {
      setIsStartingInterview(false);
      setIsTakeInterviewModalOpen(false);
      setActiveView('interview');
    }
  };

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

  const bgCanvasClass = themeMode === 'dark'
    ? 'bg-[#090D16]'
    : themeMode === 'contrast'
    ? 'bg-[#F1F3F7]'
    : 'bg-[#FFFFFF]'; // All white!

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${bgCanvasClass} font-sans transition-colors`}>
      {/* 1. Left Icon Rail Sidebar */}
      <Sidebar
        activeView={activeView}
        setActiveView={(view) => setActiveView(view)}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* 2. Top Header Bar */}
        <TopHeader
          theme={themeMode}
          toggleTheme={toggleTheme}
          roleTitle={
            activeView === 'candidates' ? 'Candidate Review & Profiles' :
            activeView === 'questions' ? 'Technical Problem Bank' :
            activeView === 'analytics' ? 'Evaluation Scorecard' :
            activeView === 'settings' ? 'Platform Settings & Config' :
            activeView === 'interview' ? 'Live Technical Assessment Room' :
            activeView === 'recruiter' ? 'Institutional Placement Portal' :
            'Assessment & Review Stage'
          }
          onOpenCodeEditor={() => setIsCodeModalOpen(true)}
          onOpenTakeInterview={() => setIsTakeInterviewModalOpen(true)}
          onOpenThemeModal={() => setIsThemeModalOpen(true)}
          onBack={() => setActiveView('dashboard')}
          onNavigate={(view) => setActiveView(view)}
        />

        {/* 3. Main Stage Content */}
        <main className="flex-1 p-5 md:p-6 lg:p-7 overflow-y-auto space-y-6">
          {/* Home Page: Dashboard Overview */}
          {activeView === 'dashboard' && (
            <>
              {/* Home Page Top Banner: Various Options to Take Interview */}
              <TakeInterviewBanner
                onQuickStart={handleStartInterview}
                onOpenCustomModal={() => setIsTakeInterviewModalOpen(true)}
              />

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

          {/* Live Technical Assessment Room */}
          {activeView === 'interview' && (
            <InterviewRoom
              interview={activeInterview}
              problems={problems}
              onStartNewSession={handleStartInterview}
              onFinishInterview={(_transcript, _sec) => {
                setSelectedCandidate(prev => ({
                  ...prev,
                  score: 91,
                  status: 'Approved'
                }));
                setActiveView('analytics');
              }}
              isStarting={isStartingInterview}
            />
          )}

          {activeView === 'candidates' && (
            <CandidatesView
              candidates={candidatesList}
              onSelectCandidate={(cand) => {
                setSelectedCandidate(cand);
                setActiveView('dashboard');
              }}
              onViewScorecard={(cand) => {
                setSelectedCandidate(cand);
                setActiveView('analytics');
              }}
            />
          )}

          {activeView === 'questions' && (
            <QuestionBankView
              problems={problems}
              onOpenProblem={() => {
                setIsCodeModalOpen(true);
              }}
            />
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

          {activeView === 'recruiter' && (
            <RecruiterView
              onSelectCandidateInterview={() => setActiveView('analytics')}
            />
          )}

          {activeView === 'settings' && (
            <SettingsView
              currentMode={themeMode}
              onSelectMode={setThemeMode}
              currentAccent={accentColor}
              onSelectAccent={(accent) => setAccentColor(accent as AccentColor)}
            />
          )}
        </main>
      </div>

      {/* Take Interview Custom Modal */}
      <TakeInterviewModal
        isOpen={isTakeInterviewModalOpen}
        onClose={() => setIsTakeInterviewModalOpen(false)}
        onStartInterview={handleStartInterview}
        isStarting={isStartingInterview}
      />

      {/* Theme Selector Modal */}
      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentMode={themeMode}
        onSelectMode={setThemeMode}
        currentAccent={accentColor}
        onSelectAccent={setAccentColor}
      />

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
