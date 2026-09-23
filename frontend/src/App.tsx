import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { InterviewRoom } from './components/InterviewRoom';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { HistoryView } from './components/HistoryView';
import { RecruiterView } from './components/RecruiterView';
import { 
  Candidate, 
  Problem, 
  InterviewSession, 
  ScoreRecord 
} from './types';
import { 
  fetchCandidates, 
  startInterviewSession, 
  finishInterviewSession, 
  getInterviewSession 
} from './services/api';

export function App() {
  const [activeTab, setActiveTab] = useState<'room' | 'analytics' | 'history' | 'recruiter'>('room');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // Active Interview Session
  const [currentInterview, setCurrentInterview] = useState<InterviewSession | null>(null);
  const [currentProblems, setCurrentProblems] = useState<Problem[]>([]);
  const [latestScore, setLatestScore] = useState<ScoreRecord | null>(null);
  const [isStarting, setIsStarting] = useState<boolean>(false);

  useEffect(() => {
    const init = async () => {
      try {
        const cands = await fetchCandidates();
        setCandidates(cands);
        if (cands.length > 0) {
          setSelectedCandidate(cands[0]);
        }
      } catch (err) {
        console.error('Initialization error:', err);
      }
    };
    init();
  }, []);

  const handleStartNewSession = async (difficulty: string, track: string) => {
    setIsStarting(true);
    try {
      const data = await startInterviewSession({
        candidateId: selectedCandidate?.id || 'cand-101',
        difficulty,
        track,
        problemCount: 2
      });
      setCurrentInterview(data.interview);
      setCurrentProblems(data.problems);
      setLatestScore(null);
      setActiveTab('room');
    } catch (err) {
      console.error('Error starting session:', err);
    } finally {
      setIsStarting(false);
    }
  };

  const handleFinishInterview = async (transcript: string, timeTakenSec: number) => {
    if (!currentInterview) return;
    try {
      const res = await finishInterviewSession({
        interviewId: currentInterview.id,
        communicationTranscript: transcript,
        timeTakenSeconds: timeTakenSec
      });
      setCurrentInterview(res.interview);
      setLatestScore(res.score);
      setActiveTab('analytics');
    } catch (err) {
      console.error('Failed to finish interview:', err);
    }
  };

  const handleInspectHistoricalInterview = async (interviewId: string) => {
    try {
      const res = await getInterviewSession(interviewId);
      setCurrentInterview(res.interview);
      setCurrentProblems(res.problems);
      setLatestScore(res.score);
      setActiveTab('analytics');
    } catch (err) {
      console.error('Failed to fetch interview session:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isInterviewActive={currentInterview?.status === 'in_progress'}
      />

      <main className="flex-1">
        {activeTab === 'room' && (
          <InterviewRoom
            interview={currentInterview}
            problems={currentProblems}
            onStartNewSession={handleStartNewSession}
            onFinishInterview={handleFinishInterview}
            isStarting={isStarting}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            score={latestScore}
            interview={currentInterview}
            onRetake={() => {
              setCurrentInterview(null);
              setActiveTab('room');
            }}
            onViewHistory={() => setActiveTab('history')}
          />
        )}

        {activeTab === 'history' && (
          <HistoryView
            onSelectInterview={handleInspectHistoricalInterview}
          />
        )}

        {activeTab === 'recruiter' && (
          <RecruiterView
            onSelectCandidateInterview={handleInspectHistoricalInterview}
          />
        )}
      </main>
    </div>
  );
}

export default App;
