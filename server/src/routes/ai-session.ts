import { Router } from 'express';
import { getEmotionAwareAIResponse } from '../lib/ai-session.js';
import type { EmotionSnapshot, VoiceMetrics, SessionExchange } from '../types/ai-session.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { transcript, emotions, voiceMetrics, history } = req.body as {
      transcript: string;
      emotions: EmotionSnapshot[];
      voiceMetrics: VoiceMetrics;
      history: SessionExchange[];
    };

    if (!transcript || !transcript.trim()) {
      res.status(400).json({ error: 'No transcript provided' });
      return;
    }

    const response = await getEmotionAwareAIResponse(
      transcript,
      emotions || [],
      voiceMetrics || { volume: 0, pace: 'normal', isSpeaking: false },
      history || []
    );

    res.json({ response });
  } catch (error: any) {
    console.error('AI Session API Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

export default router;
