import { NextRequest, NextResponse } from 'next/server';
import { getAIResponse } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }
    
    const response = await getAIResponse(message, history || []);
    
    return NextResponse.json({ response });
  } catch (error: any) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: error.message || 'Failed to get response' }, { status: 500 });
  }
}
