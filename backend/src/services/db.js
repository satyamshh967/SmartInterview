import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../../data');
const STORE_PATH = path.resolve(DATA_DIR, 'store.json');
const PROBLEMS_PATH = path.resolve(__dirname, '../data/problems.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed data
const initialCandidates = [
  {
    id: "cand-101",
    name: "Alex Morgan",
    email: "alex.morgan@university.edu",
    role: "Fullstack Engineer",
    experienceLevel: "Entry Level",
    targetTrack: "Software Engineering",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString()
  },
  {
    id: "cand-102",
    name: "Samantha Reed",
    email: "samantha.r@cs.institute.org",
    role: "Backend Specialist",
    experienceLevel: "Junior",
    targetTrack: "Distributed Systems",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
  }
];

class Database {
  constructor() {
    this.store = {
      candidates: [],
      interviews: [],
      submissions: [],
      scores: [],
      problems: []
    };
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(PROBLEMS_PATH)) {
        this.store.problems = JSON.parse(fs.readFileSync(PROBLEMS_PATH, 'utf-8'));
      }
    } catch (e) {
      console.error('Failed to load problems:', e);
      this.store.problems = [];
    }

    if (fs.existsSync(STORE_PATH)) {
      try {
        const raw = fs.readFileSync(STORE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        this.store.candidates = parsed.candidates || initialCandidates;
        this.store.interviews = parsed.interviews || [];
        this.store.submissions = parsed.submissions || [];
        this.store.scores = parsed.scores || [];
      } catch (e) {
        console.error('Failed reading store.json, reinitializing:', e);
        this.store.candidates = initialCandidates;
        this.save();
      }
    } else {
      this.store.candidates = initialCandidates;
      this.save();
    }
  }

  save() {
    try {
      fs.writeFileSync(STORE_PATH, JSON.stringify({
        candidates: this.store.candidates,
        interviews: this.store.interviews,
        submissions: this.store.submissions,
        scores: this.store.scores
      }, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write store.json:', e);
    }
  }

  // Candidates
  getCandidates() {
    return this.store.candidates;
  }

  getCandidateById(id) {
    return this.store.candidates.find(c => c.id === id);
  }

  addCandidate(cand) {
    this.store.candidates.push(cand);
    this.save();
    return cand;
  }

  // Problems
  getProblems() {
    return this.store.problems;
  }

  getProblemById(id) {
    return this.store.problems.find(p => p.id === id || p.slug === id);
  }

  // Interviews
  getInterviews() {
    return this.store.interviews;
  }

  getInterviewById(id) {
    return this.store.interviews.find(i => i.id === id);
  }

  createInterview(interview) {
    this.store.interviews.push(interview);
    this.save();
    return interview;
  }

  updateInterview(id, updates) {
    const idx = this.store.interviews.findIndex(i => i.id === id);
    if (idx !== -1) {
      this.store.interviews[idx] = { ...this.store.interviews[idx], ...updates };
      this.save();
      return this.store.interviews[idx];
    }
    return null;
  }

  // Submissions
  getSubmissions(filter = {}) {
    let result = this.store.submissions;
    if (filter.interviewId) {
      result = result.filter(s => s.interviewId === filter.interviewId);
    }
    if (filter.problemId) {
      result = result.filter(s => s.problemId === filter.problemId);
    }
    return result;
  }

  addSubmission(submission) {
    this.store.submissions.push(submission);
    this.save();
    return submission;
  }

  // Scores
  getScores(filter = {}) {
    let result = this.store.scores;
    if (filter.interviewId) {
      result = result.filter(sc => sc.interviewId === filter.interviewId);
    }
    if (filter.candidateId) {
      result = result.filter(sc => sc.candidateId === filter.candidateId);
    }
    return result;
  }

  saveScore(score) {
    const existingIndex = this.store.scores.findIndex(s => s.interviewId === score.interviewId);
    if (existingIndex !== -1) {
      this.store.scores[existingIndex] = score;
    } else {
      this.store.scores.push(score);
    }
    this.save();
    return score;
  }
}

export const db = new Database();
