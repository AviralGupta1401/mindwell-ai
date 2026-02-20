import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('GEMINI_API_KEY is not set');
}

const genAI = new GoogleGenerativeAI(API_KEY);

const systemPrompt = `You are MindWell, a compassionate AI mental health companion. 
Your role is to:
- Listen empathetically
- Provide emotional support
- Offer coping strategies
- Never diagnose or replace professional help
- Be warm, understanding, and non-judgmental

Remember to check in on the user's wellbeing and encourage professional help when needed.`;

export async function getAIResponse(userMessage: string, chatHistory: { role: string; content: string }[]): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: systemPrompt
    });
    
    // Filter to only include user messages and valid history
    const validHistory = chatHistory
      .filter(msg => msg.role && msg.content)
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }));

    // Ensure first message is from user, remove any leading model messages
    while (validHistory.length > 0 && validHistory[0].role === 'model') {
      validHistory.shift();
    }

    const chat = model.startChat({
      history: validHistory,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    });

    const result = await chat.sendMessage(userMessage);
    const response = result.response.text();
    
    return response || "I'm here for you. Could you tell me more about how you're feeling?";
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    throw new Error(error.message || 'Failed to get AI response');
  }
}
