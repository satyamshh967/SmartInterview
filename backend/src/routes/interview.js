import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../services/db.js';
import { evaluateCommunication } from '../services/nlpClient.js';

const router = express.Router();

/**
 * POST /api/interview/start
 * Initiates an interview session for a candidate.
 */
router.post('/start', (req, res) => {
  try {
    const {
      candidateId = 'cand-101',
      title = 'Technical Software Engineering Interview',
      difficulty = 'Medium',
      track = 'Fullstack / DSA',
      problemCount = 2
    } = req.body;

    const candidate = db.getCandidateById(candidateId) || db.getCandidates()[0];
    const allProblems = db.getProblems();

    // Select problems based on difficulty or pick first few
    let selectedProblems = allProblems.filter(p => p.difficulty === difficulty);
    if (selectedProblems.length < problemCount) {
      selectedProblems = allProblems.slice(0, problemCount);
    } else {
      selectedProblems = selectedProblems.slice(0, problemCount);
    }

    const totalTimeMinutes = selectedProblems.reduce((sum, p) => sum + (p.timeLimitMinutes || 20), 0);

    const interview = {
      id: `int-${uuidv4().slice(0, 8)}`,
      candidateId: candidate.id,
      candidateName: candidate.name,
      title,
      difficulty,
      track,
      timeLimitMinutes: totalTimeMinutes,
      status: 'in_progress',
      startedAt: new Date().toISOString(),
      completedAt: null,
      problemIds: selectedProblems.map(p => p.id),
      communicationTranscript: '',
      recordingUrl: null
    };

    db.createInterview(interview);

    // Return interview with problem statements (without hidden test cases)
    const sanitizedProblems = selectedProblems.map(p => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      difficulty: p.difficulty,
      category: p.category,
      timeLimitMinutes: p.timeLimitMinutes,
      description: p.description,
      examples: p.examples,
      constraints: p.constraints,
      starterCode: p.starterCode,
      sampleTestCases: p.sampleTestCases
    }));

    return res.status(201).json({
      interview,
      problems: sanitizedProblems,
      candidate
    });
  } catch (error) {
    console.error('Error starting interview:', error);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/interview/:id
 * Fetch active interview session state
 */
router.get('/:id', (req, res) => {
  const interview = db.getInterviewById(req.params.id);
  if (!interview) {
    return res.status(404).json({ error: 'Interview session not found' });
  }

  const problems = db.getProblems().filter(p => interview.problemIds.includes(p.id));
  const submissions = db.getSubmissions({ interviewId: interview.id });
  const score = db.getScores({ interviewId: interview.id })[0] || null;

  return res.json({
    interview,
    problems,
    submissions,
    score
  });
});

/**
 * POST /api/interview/communication-feedback
 * Send verbal explanation / audio transcript to Python NLP feedback engine
 */
router.post('/communication-feedback', async (req, res) => {
  try {
    const { interviewId, transcript, problemId, code, timeTakenSeconds } = req.body;

    if (!transcript) {
      return res.status(400).json({ error: 'Transcript is required for communication feedback' });
    }

    let problemTitle = '';
    if (problemId) {
      const prob = db.getProblemById(problemId);
      if (prob) problemTitle = prob.title;
    }

    const nlpResult = await evaluateCommunication({
      transcript,
      problemContext: problemTitle,
      code: code || '',
      timeTakenSeconds: timeTakenSeconds || 0
    });

    if (interviewId) {
      db.updateInterview(interviewId, {
        communicationTranscript: transcript
      });
    }

    return res.json(nlpResult);
  } catch (err) {
    console.error('Error generating communication feedback:', err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/interview/finish
 * Concludes the interview, computes composite score, and produces evaluation report.
 */
router.post('/finish', async (req, res) => {
  try {
    const {
      interviewId,
      recordingUrl,
      communicationTranscript = '',
      timeTakenSeconds = 0
    } = req.body;

    const interview = db.getInterviewById(interviewId);
    if (!interview) {
      return res.status(404).json({ error: 'Interview session not found' });
    }

    const completedAt = new Date().toISOString();
    db.updateInterview(interviewId, {
      status: 'completed',
      completedAt,
      recordingUrl: recordingUrl || interview.recordingUrl,
      communicationTranscript: communicationTranscript || interview.communicationTranscript
    });

    // Fetch all submissions for this interview
    const submissions = db.getSubmissions({ interviewId });
    const problems = db.getProblems().filter(p => interview.problemIds.includes(p.id));

    // Calculate Code Correctness Score
    let totalPossibleTests = 0;
    let totalPassedTests = 0;
    let avgRuntimeMs = 0;

    for (const prob of problems) {
      const probSubmissions = submissions.filter(s => s.problemId === prob.id);
      if (probSubmissions.length > 0) {
        // take best submission
        const best = probSubmissions.sort((a, b) => (b.testCasesPassed || 0) - (a.testCasesPassed || 0))[0];
        totalPassedTests += best.testCasesPassed || 0;
        totalPossibleTests += best.testCasesTotal || (prob.sampleTestCases.length + prob.hiddenTestCases.length);
        avgRuntimeMs += best.executionTimeMs || 0;
      } else {
        totalPossibleTests += (prob.sampleTestCases.length + prob.hiddenTestCases.length);
      }
    }

    const codeCorrectnessScore = totalPossibleTests > 0
      ? Math.round((totalPassedTests / totalPossibleTests) * 100)
      : 0;

    // Code Efficiency Score (penalize runtime > 200ms)
    let codeEfficiencyScore = 90;
    if (avgRuntimeMs > 300) codeEfficiencyScore = 70;
    else if (avgRuntimeMs > 100) codeEfficiencyScore = 82;
    if (totalPassedTests === 0) codeEfficiencyScore = 30;

    // Time Management Score
    const allowedSeconds = interview.timeLimitMinutes * 60;
    let timeManagementScore = 85;
    if (timeTakenSeconds > 0 && allowedSeconds > 0) {
      const usageRatio = timeTakenSeconds / allowedSeconds;
      if (usageRatio <= 0.75) timeManagementScore = 95;
      else if (usageRatio <= 1.0) timeManagementScore = 85;
      else timeManagementScore = Math.max(40, 85 - Math.round((usageRatio - 1.0) * 100));
    }

    // Call Python NLP Feedback Engine for communication scoring
    const fullTranscript = communicationTranscript || interview.communicationTranscript || '';
    const nlpFeedback = await evaluateCommunication({
      transcript: fullTranscript,
      problemContext: problems.map(p => p.title).join(', '),
      timeTakenSeconds
    });

    const communicationScore = nlpFeedback.overallScore || 70;

    // Weighted Overall Score:
    // 45% Code Correctness, 20% Code Efficiency, 20% Verbal Communication, 15% Time Management
    const overallScore = Math.round(
      (codeCorrectnessScore * 0.45) +
      (codeEfficiencyScore * 0.20) +
      (communicationScore * 0.20) +
      (timeManagementScore * 0.15)
    );

    // Merge strengths & improvements
    const strengths = [...nlpFeedback.strengths];
    const improvements = [...nlpFeedback.improvements];

    if (codeCorrectnessScore >= 90) {
      strengths.unshift('Flawless test case suite execution; passed edge cases and hidden test suites.');
    } else if (codeCorrectnessScore >= 60) {
      strengths.unshift('Strong foundational logic, passed primary test cases.');
      improvements.unshift('Address hidden edge cases and boundary conditions in test submissions.');
    } else {
      improvements.unshift('Focus on baseline algorithmic correctness and syntax validation before submission.');
    }

    const scoreRecord = {
      id: `score-${uuidv4().slice(0, 8)}`,
      interviewId,
      candidateId: interview.candidateId,
      overallScore,
      codeCorrectnessScore,
      codeEfficiencyScore,
      communicationScore,
      timeManagementScore,
      totalTestCases: totalPossibleTests,
      passedTestCases: totalPassedTests,
      strengths,
      improvements,
      nlpDetails: nlpFeedback,
      competencies: {
        algorithms: Math.round((codeCorrectnessScore * 0.7) + (codeEfficiencyScore * 0.3)),
        problemSolving: Math.round((codeCorrectnessScore * 0.6) + (communicationScore * 0.4)),
        codeQuality: codeEfficiencyScore,
        verbalArticulation: communicationScore,
        speedAndTime: timeManagementScore
      },
      createdAt: completedAt
    };

    db.saveScore(scoreRecord);

    return res.json({
      interview: db.getInterviewById(interviewId),
      score: scoreRecord
    });
  } catch (err) {
    console.error('Error completing interview:', err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
