import {
  Candidate,
  InterviewSession,
  Problem,
  EvaluationResult,
  Submission,
  NLPFeedback,
  ScoreRecord,
  InterviewHistoryItem
} from '../types';

const API_BASE = '/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function fetchCandidates(): Promise<Candidate[]> {
  const res = await fetch(`${API_BASE}/candidates`);
  return res.json();
}

export async function fetchQuestions(): Promise<Problem[]> {
  const res = await fetch(`${API_BASE}/questions`);
  return res.json();
}

export async function startInterviewSession(params: {
  candidateId: string;
  difficulty: string;
  track: string;
  problemCount?: number;
}): Promise<{
  interview: InterviewSession;
  problems: Problem[];
  candidate: Candidate;
}> {
  const res = await fetch(`${API_BASE}/interview/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  if (!res.ok) {
    throw new Error(`Failed to start interview: ${res.statusText}`);
  }
  return res.json();
}

export async function getInterviewSession(id: string): Promise<{
  interview: InterviewSession;
  problems: Problem[];
  submissions: Submission[];
  score: ScoreRecord | null;
}> {
  const res = await fetch(`${API_BASE}/interview/${id}`);
  return res.json();
}

export async function evaluateCodeSubmission(params: {
  interviewId?: string;
  problemId: string;
  language: string;
  code: string;
  isSampleOnly: boolean;
}): Promise<{
  evaluation: EvaluationResult;
  submission?: Submission;
  isSampleOnly: boolean;
}> {
  const res = await fetch(`${API_BASE}/submission/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  if (!res.ok) {
    throw new Error(`Evaluation request failed: ${res.statusText}`);
  }
  return res.json();
}

export async function getCommunicationFeedback(params: {
  interviewId?: string;
  transcript: string;
  problemId?: string;
  code?: string;
  timeTakenSeconds?: number;
}): Promise<NLPFeedback> {
  const res = await fetch(`${API_BASE}/interview/communication-feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  if (!res.ok) {
    throw new Error(`NLP feedback request failed: ${res.statusText}`);
  }
  return res.json();
}

export async function finishInterviewSession(params: {
  interviewId: string;
  recordingUrl?: string;
  communicationTranscript?: string;
  timeTakenSeconds?: number;
}): Promise<{
  interview: InterviewSession;
  score: ScoreRecord;
}> {
  const res = await fetch(`${API_BASE}/interview/finish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  if (!res.ok) {
    throw new Error(`Failed to conclude interview: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchInterviewHistory(candidateId?: string): Promise<{
  history: InterviewHistoryItem[];
  analytics: {
    totalInterviews: number;
    completedCount: number;
    avgOverallScore: number;
    avgCodeCorrectness: number;
    avgCommunication: number;
    avgCompetencies: {
      algorithms: number;
      problemSolving: number;
      codeQuality: number;
      verbalArticulation: number;
      speedAndTime: number;
    };
  };
}> {
  const url = candidateId
    ? `${API_BASE}/results/history?candidateId=${encodeURIComponent(candidateId)}`
    : `${API_BASE}/results/history`;
  const res = await fetch(url);
  return res.json();
}
