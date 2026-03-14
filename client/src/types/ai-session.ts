export type FacialExpression =
  | 'neutral'
  | 'happy'
  | 'sad'
  | 'angry'
  | 'fearful'
  | 'disgusted'
  | 'surprised';

export interface EmotionSnapshot {
  dominant: FacialExpression;
  confidence: number;
  all: Record<FacialExpression, number>;
  timestamp: number;
}

export interface VoiceMetrics {
  volume: number;
  pace: 'slow' | 'normal' | 'fast';
  isSpeaking: boolean;
}

export interface SessionExchange {
  userTranscript: string;
  detectedEmotions: EmotionSnapshot[];
  voiceMetrics: VoiceMetrics;
  aiResponse: string;
  timestamp: number;
}

export type SessionStatus =
  | 'idle'
  | 'loading'
  | 'ready'
  | 'active'
  | 'processing'
  | 'speaking'
  | 'ended';
