import { Router } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../lib/auth.js';
import connectDB from '../lib/db.js';
import MoodEntry from '../models/MoodEntry.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });

    if (!session) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    await connectDB();

    const { mood, note } = req.body;

    const entry = await MoodEntry.create({
      userId: session.user.id,
      mood,
      note,
    });

    res.json(entry);
  } catch (error) {
    console.error('Mood entry error:', error);
    res.status(500).json({ error: 'Failed to save mood' });
  }
});

router.get('/', async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });

    if (!session) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    await connectDB();

    const entries = await MoodEntry.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(30);

    res.json(entries);
  } catch (error) {
    console.error('Get mood error:', error);
    res.status(500).json({ error: 'Failed to get moods' });
  }
});

export default router;
