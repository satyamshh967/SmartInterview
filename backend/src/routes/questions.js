import express from 'express';
import { db } from '../services/db.js';

const router = express.Router();

/**
 * GET /api/questions
 * List all available problems in the question bank
 */
router.get('/', (req, res) => {
  const problems = db.getProblems();
  const sanitized = problems.map(p => ({
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
  return res.json(sanitized);
});

/**
 * GET /api/questions/:id
 */
router.get('/:id', (req, res) => {
  const problem = db.getProblemById(req.params.id);
  if (!problem) {
    return res.status(404).json({ error: 'Question not found' });
  }
  return res.json({
    id: problem.id,
    title: problem.title,
    slug: problem.slug,
    difficulty: problem.difficulty,
    category: problem.category,
    timeLimitMinutes: problem.timeLimitMinutes,
    description: problem.description,
    examples: problem.examples,
    constraints: problem.constraints,
    starterCode: problem.starterCode,
    sampleTestCases: problem.sampleTestCases
  });
});

export default router;
