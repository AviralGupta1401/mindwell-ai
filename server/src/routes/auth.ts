import { Router } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../lib/auth.js';

const router = Router();

router.post('/refresh-session', async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });

    if (!session) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    res.json({
      user: session.user,
      expiresAt: session.session.expiresAt,
    });
  } catch (error) {
    console.error('Refresh session error:', error);
    res.status(500).json({ error: 'Failed to refresh session' });
  }
});

export default router;
