import { NextRequest, NextResponse } from 'next/server';
import { getEmotionAwareAIResponse } from '@/lib/ai-session';
import type { EmotionSnapshot, VoiceMetrics, SessionExchange } from '@/types/ai-session';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transcript, emotions, voiceMetrics, history } = body as {
      transcript: string;
      emotions: EmotionSnapshot[];
      voiceMetrics: VoiceMetrics;
      history: SessionExchange[];
    };

    if (!transcript || !transcript.trim()) {
      return NextResponse.json(
        { error: 'No transcript provided' },
        { status: 400 }
      );
    }

    const response = await getEmotionAwareAIResponse(
      transcript,
      emotions || [],
      voiceMetrics || { volume: 0, pace: 'normal', isSpeaking: false },
      history || []
    );

    return NextResponse.json({ response });
  } catch (error: any) {
    console.error('AI Session API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
