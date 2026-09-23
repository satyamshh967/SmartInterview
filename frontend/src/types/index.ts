export interface Candidate {
  id: string;
  name: string;
  email: string;
  role: string;
  targetTrack: string;
  experienceLevel: string;
  avatar: string;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

export interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  timeLimitMinutes: number;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  starterCode: {
    python?: string;
    javascript?: string;
    cpp?: string;
    c?: string;
  };
  sampleTestCases: TestCase[];
}

export interface TestCaseResult {
  id: string;
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  executionTimeMs: number;
  memoryKb: number;
  error?: string;
  isHidden?: boolean;
}

export interface EvaluationResult {
  status: 'ACCEPTED' | 'WRONG_ANSWER' | 'TIME_LIMIT_EXCEEDED' | 'COMPILATION_ERROR' | 'RUNTIME_ERROR';
  totalTestCases: number;
  passedTestCases: number;
  totalExecutionTimeMs: number;
  peakMemoryKb: number;
  compilationError?: string;
  details: TestCaseResult[];
}

export interface Submission {
  id: string;
  interviewId: string;
  problemId: string;
  problemTitle: string;
  language: string;
  code: string;
  status: string;
  executionTimeMs: number;
  memoryKb: number;
  testCasesPassed: number;
  testCasesTotal: number;
  compilationError?: string;
  submittedAt: string;
}

export interface NLPFeedback {
  overallScore: number;
  technicalClarityScore: number;
  complexityAwarenessScore: number;
  structuralCoherenceScore: number;
  verbalConfidenceScore: number;
  detectedKeywords: string[];
  complexityIdentified: boolean;
  wordCount: number;
  fillerCount: number;
  strengths: string[];
  improvements: string[];
  summary: string;
}

export interface Competencies {
  algorithms: number;
  problemSolving: number;
  codeQuality: number;
  verbalArticulation: number;
  speedAndTime: number;
}

export interface ScoreRecord {
  id: string;
  interviewId: string;
  candidateId: string;
  overallScore: number;
  codeCorrectnessScore: number;
  codeEfficiencyScore: number;
  communicationScore: number;
  timeManagementScore: number;
  totalTestCases: number;
  passedTestCases: number;
  strengths: string[];
  improvements: string[];
  nlpDetails?: NLPFeedback;
  competencies: Competencies;
  createdAt: string;
}

export interface InterviewSession {
  id: string;
  candidateId: string;
  candidateName: string;
  title: string;
  difficulty: string;
  track: string;
  timeLimitMinutes: number;
  status: 'in_progress' | 'completed';
  startedAt: string;
  completedAt?: string | null;
  problemIds: string[];
  communicationTranscript?: string;
  recordingUrl?: string | null;
}

export interface InterviewHistoryItem {
  interviewId: string;
  candidateId: string;
  candidateName: string;
  candidateRole: string;
  title: string;
  track: string;
  difficulty: string;
  status: string;
  startedAt: string;
  completedAt?: string;
  score?: ScoreRecord;
  submissionsCount: number;
  recordingUrl?: string;
}
