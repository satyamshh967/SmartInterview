import express from 'express';
import { db } from '../services/db.js';

const router = express.Router();

/**
 * GET /api/results/history
 * Returns interview evaluation history, aggregated metrics, and progress trends.
 */
router.get('/history', (req, res) => {
  try {
    const { candidateId } = req.query;

    let interviews = db.getInterviews();
    if (candidateId) {
      interviews = interviews.filter(i => i.candidateId === candidateId);
    }

    const allScores = db.getScores();
    const allSubmissions = db.getSubmissions();

    // Map each interview with its corresponding score
    const history = interviews.map(interview => {
      const score = allScores.find(s => s.interviewId === interview.id) || null;
      const submissions = allSubmissions.filter(sub => sub.interviewId === interview.id);
      const candidate = db.getCandidateById(interview.candidateId) || { name: interview.candidateName || 'Candidate' };

      return {
        interviewId: interview.id,
        candidateId: interview.candidateId,
        candidateName: candidate.name,
        candidateRole: candidate.role,
        title: interview.title,
        track: interview.track,
        difficulty: interview.difficulty,
        status: interview.status,
        startedAt: interview.startedAt,
        completedAt: interview.completedAt,
        score,
        submissionsCount: submissions.length,
        recordingUrl: interview.recordingUrl
      };
    }).sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());

    // Compute aggregated analytics
    const completedScores = allScores.filter(s => s.overallScore !== undefined);
    const avgOverall = completedScores.length > 0
      ? Math.round(completedScores.reduce((sum, s) => sum + s.overallScore, 0) / completedScores.length)
      : 0;
    const avgCode = completedScores.length > 0
      ? Math.round(completedScores.reduce((sum, s) => sum + (s.codeCorrectnessScore || 0), 0) / completedScores.length)
      : 0;
    const avgComm = completedScores.length > 0
      ? Math.round(completedScores.reduce((sum, s) => sum + (s.communicationScore || 0), 0) / completedScores.length)
      : 0;

    // Average competencies for Radar chart
    const avgCompetencies = {
      algorithms: completedScores.length > 0
        ? Math.round(completedScores.reduce((sum, s) => sum + (s.competencies?.algorithms || 70), 0) / completedScores.length)
        : 75,
      problemSolving: completedScores.length > 0
        ? Math.round(completedScores.reduce((sum, s) => sum + (s.competencies?.problemSolving || 70), 0) / completedScores.length)
        : 78,
      codeQuality: completedScores.length > 0
        ? Math.round(completedScores.reduce((sum, s) => sum + (s.competencies?.codeQuality || 70), 0) / completedScores.length)
        : 82,
      verbalArticulation: completedScores.length > 0
        ? Math.round(completedScores.reduce((sum, s) => sum + (s.competencies?.verbalArticulation || 70), 0) / completedScores.length)
        : 74,
      speedAndTime: completedScores.length > 0
        ? Math.round(completedScores.reduce((sum, s) => sum + (s.competencies?.speedAndTime || 70), 0) / completedScores.length)
        : 80
    };

    return res.json({
      history,
      analytics: {
        totalInterviews: interviews.length,
        completedCount: completedScores.length,
        avgOverallScore: avgOverall,
        avgCodeCorrectness: avgCode,
        avgCommunication: avgComm,
        avgCompetencies
      }
    });
  } catch (err) {
    console.error('Error fetching history:', err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/results/:interviewId
 * Complete detailed scorecard for a specific interview
 */
router.get('/:interviewId', (req, res) => {
  const { interviewId } = req.params;
  const interview = db.getInterviewById(interviewId);
  if (!interview) {
    return res.status(404).json({ error: 'Interview not found' });
  }

  const score = db.getScores({ interviewId })[0] || null;
  const submissions = db.getSubmissions({ interviewId });
  const problems = db.getProblems().filter(p => interview.problemIds.includes(p.id));
  const candidate = db.getCandidateById(interview.candidateId);

  return res.json({
    interview,
    score,
    submissions,
    problems,
    candidate
  });
});

export default router;
