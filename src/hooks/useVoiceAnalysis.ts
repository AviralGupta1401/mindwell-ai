'use client';

import { useState, useRef, useCallback } from 'react';
import type { VoiceMetrics } from '@/types/ai-session';

export function useVoiceAnalysis() {
  const [metrics, setMetrics] = useState<VoiceMetrics>({
    volume: 0,
    pace: 'normal',
    isSpeaking: false,
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const wordCountRef = useRef(0);
  const startTimeRef = useRef(0);

  const startAnalysis = useCallback((stream: MediaStream) => {
    try {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);

      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      startTimeRef.current = Date.now();

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const analyze = () => {
        if (!analyserRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArray);

        // Calculate RMS volume (0-100)
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i] * dataArray[i];
        }
        const rms = Math.sqrt(sum / dataArray.length);
        const volume = Math.min(100, Math.round((rms / 128) * 100));

        const isSpeaking = volume > 15;

        setMetrics((prev) => ({
          ...prev,
          volume,
          isSpeaking,
        }));

        animFrameRef.current = requestAnimationFrame(analyze);
      };

      analyze();
    } catch (err) {
      console.error('Voice analysis error:', err);
    }
  }, []);

  const updatePace = useCallback((wordCount: number) => {
    wordCountRef.current = wordCount;
    const elapsed = (Date.now() - startTimeRef.current) / 1000 / 60; // minutes
    if (elapsed < 0.05) return; // need at least 3 seconds

    const wpm = wordCount / elapsed;
    let pace: 'slow' | 'normal' | 'fast' = 'normal';
    if (wpm < 100) pace = 'slow';
    else if (wpm > 160) pace = 'fast';

    setMetrics((prev) => ({ ...prev, pace }));
  }, []);

  const stopAnalysis = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    analyserRef.current = null;
  }, []);

  return { metrics, startAnalysis, stopAnalysis, updatePace };
}
