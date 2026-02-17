import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getAIResponse } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, history } = await req.json();
    
    const response = await getAIResponse(message, history || []);
    
    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'Failed to get response' }, { status: 500 });
  }
}
