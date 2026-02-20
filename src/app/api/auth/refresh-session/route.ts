import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    return NextResponse.json({
      user: session.user,
      expiresAt: session.session.expiresAt,
    });
  } catch (error) {
    console.error('Refresh session error:', error);
    return NextResponse.json({ error: 'Failed to refresh session' }, { status: 500 });
  }
}
