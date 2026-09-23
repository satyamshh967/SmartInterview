import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../services/db.js';

const router = express.Router();

/**
 * GET /api/candidates
 */
router.get('/', (req, res) => {
  return res.json(db.getCandidates());
});

/**
 * POST /api/candidates
 */
router.post('/', (req, res) => {
  const { name, email, role, targetTrack, experienceLevel } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const newCand = {
    id: `cand-${uuidv4().slice(0, 8)}`,
    name,
    email,
    role: role || 'Software Engineer',
    targetTrack: targetTrack || 'General SWE',
    experienceLevel: experienceLevel || 'Entry Level',
    avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
    createdAt: new Date().toISOString()
  };

  db.addCandidate(newCand);
  return res.status(201).json(newCand);
});

export default router;
