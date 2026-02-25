import { GoogleGenerativeAI } from '@google/generative-ai';
import type { EmotionSnapshot, VoiceMetrics, SessionExchange } from '@/types/ai-session';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('GEMINI_API_KEY is not set');
}

const genAI = new GoogleGenerativeAI(API_KEY);

const sessionSystemPrompt = `You are MindWell, a compassionate AI therapist conducting a face-to-face video session. You can see the user through their camera and hear their voice.

Your capabilities:
- You receive the user's spoken words along with their detected facial expressions and voice characteristics
- You use these emotional cues to provide deeper, more empathetic responses

Guidelines:
- Reference emotions naturally: "I notice you seem a bit down right now..." or "Your voice sounds a little shaky..."
- If words and expressions don't match (e.g., saying "I'm fine" while looking sad), gently acknowledge it: "You say you're fine, but I sense there might be more going on..."
- Keep responses SHORT — 2-4 sentences maximum, since they will be spoken aloud
- Speak warmly and conversationally, as if sitting across from the person
- Ask ONE follow-up question per response to keep the conversation flowing
- Never mention technical data like percentages or detection scores
- Never diagnose conditions — you are a supportive companion, not a clinician
- If someone is in crisis, encourage them to reach out to a professional or crisis helpline
- Use natural pauses and empathetic language

Remember: You are having a real-time spoken conversation. Be natural, warm, and present.`;

function buildEmotionContext(
  emotions: EmotionSnapshot[],
  voiceMetrics: VoiceMetrics
): string {
  if (emotions.length === 0) {
    return '';
  }

  // Count emotion occurrences to find dominant pattern
  const emotionCounts: Record<string, number> = {};
  let totalConfidence: Record<string, number> = {};

  for (const snap of emotions) {
    emotionCounts[snap.dominant] = (emotionCounts[snap.dominant] || 0) + 1;
    totalConfidence[snap.dominant] = (totalConfidence[snap.dominant] || 0) + snap.confidence;
  }

  // Sort by frequency
  const sorted = Object.entries(emotionCounts)
    .sort(([, a], [, b]) => b - a);

  const primary = sorted[0];
  const secondary = sorted[1];

  let context = `[Emotional context — do NOT quote this to the user]\n`;
  context += `Primary expression: ${primary[0]} (observed ${primary[1]}/${emotions.length} times)`;

  if (secondary && secondary[1] > 1) {
    context += `\nSecondary expression: ${secondary[0]} (observed ${secondary[1]}/${emotions.length} times)`;
  }

  // Voice characteristics
  const volumeDesc = voiceMetrics.volume < 30 ? 'quiet' : voiceMetrics.volume > 70 ? 'loud' : 'normal';
  context += `\nVoice: ${volumeDesc} volume, ${voiceMetrics.pace} pace`;

  if (voiceMetrics.volume < 30 && voiceMetrics.pace === 'slow') {
    context += '\nNote: Low voice and slow pace may indicate sadness or withdrawal';
  } else if (voiceMetrics.volume > 70 && voiceMetrics.pace === 'fast') {
    context += '\nNote: Loud voice and fast pace may indicate agitation or excitement';
  }

  return context;
}

export async function getEmotionAwareAIResponse(
  transcript: string,
  emotions: EmotionSnapshot[],
  voiceMetrics: VoiceMetrics,
  history: SessionExchange[]
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: sessionSystemPrompt,
    });

    // Build chat history from previous exchanges
    const chatHistory = history.flatMap((exchange) => [
      {
        role: 'user' as const,
        parts: [{ text: exchange.userTranscript }],
      },
      {
        role: 'model' as const,
        parts: [{ text: exchange.aiResponse }],
      },
    ]);

    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 300,
      },
    });

    // Build the message with emotion context
    const emotionContext = buildEmotionContext(emotions, voiceMetrics);
    let message = '';

    if (emotionContext) {
      message = `${emotionContext}\n\n[User says]: "${transcript}"`;
    } else {
      message = transcript;
    }

    const result = await chat.sendMessage(message);
    const response = result.response.text();

    return response || "I'm here with you. Take your time — what's on your mind?";
  } catch (error: any) {
    console.error('AI Session Error:', error);
    throw new Error(error.message || 'Failed to get AI response');
  }
}
