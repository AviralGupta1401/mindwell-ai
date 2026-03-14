import { Router } from 'express';
import { getAIResponse } from '../lib/ai.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const response = await getAIResponse(message, history || []);
    res.json({ response });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message || 'Failed to get response' });
  }
});

export default router;
