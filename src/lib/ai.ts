import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const systemPrompt = `You are MindWell, a compassionate AI mental health companion. 
Your role is to:
- Listen empathetically
- Provide emotional support
- Offer coping strategies
- Never diagnose or replace professional help
- Be warm, understanding, and non-judgmental

Remember to check in on the user's wellbeing and encourage professional help when needed.`;

export async function getAIResponse(userMessage: string, chatHistory: { role: string; content: string }[]): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  
  const chat = model.startChat({
    history: chatHistory.map(msg => ({
      role: msg.role as 'user' | 'model',
      parts: [{ text: msg.content }],
    })),
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1000,
    },
  });

  const result = await chat.sendMessage(userMessage);
  return result.response.text();
}
