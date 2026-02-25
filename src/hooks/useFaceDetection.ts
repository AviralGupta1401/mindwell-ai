'use client';

import { useState, useRef, useCallback } from 'react';
import type { EmotionSnapshot, FacialExpression } from '@/types/ai-session';

const MODEL_URL = '/models';
const DETECTION_INTERVAL = 500;
const MAX_HISTORY = 60;

export function useFaceDetection() {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionSnapshot | null>(null);
  const [emotionHistory, setEmotionHistory] = useState<EmotionSnapshot[]>([]);
  const [error, setError] = useState<string | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const faceapiRef = useRef<any>(null);

  const loadModels = useCallback(async () => {
    try {
      if (faceapiRef.current) {
        setModelsLoaded(true);
        return;
      }

      const faceapi = await import('face-api.js');
      faceapiRef.current = faceapi;

      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);

      setModelsLoaded(true);
    } catch (err) {
      console.error('Failed to load face-api models:', err);
      setError('Failed to load face detection models');
    }
  }, []);

  const startDetection = useCallback(
    (videoElement: HTMLVideoElement) => {
      if (!faceapiRef.current || intervalRef.current) return;

      const faceapi = faceapiRef.current;
      setIsDetecting(true);

      intervalRef.current = setInterval(async () => {
        if (videoElement.paused || videoElement.ended) return;

        try {
          const detection = await faceapi
            .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions();

          if (detection) {
            const expressions = detection.expressions as Record<FacialExpression, number>;
            const entries = Object.entries(expressions) as [FacialExpression, number][];
            const sorted = entries.sort(([, a], [, b]) => b - a);
            const [dominant, confidence] = sorted[0];

            const snapshot: EmotionSnapshot = {
              dominant,
              confidence,
              all: expressions,
              timestamp: Date.now(),
            };

            setCurrentEmotion(snapshot);
            setEmotionHistory((prev) => {
              const updated = [...prev, snapshot];
              return updated.length > MAX_HISTORY ? updated.slice(-MAX_HISTORY) : updated;
            });
          }
        } catch {
          // Detection can fail on some frames, silently continue
        }
      }, DETECTION_INTERVAL);
    },
    []
  );

  const stopDetection = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsDetecting(false);
  }, []);

  const clearHistory = useCallback(() => {
    setEmotionHistory([]);
    setCurrentEmotion(null);
  }, []);

  return {
    modelsLoaded,
    isDetecting,
    currentEmotion,
    emotionHistory,
    loadModels,
    startDetection,
    stopDetection,
    clearHistory,
    error,
  };
}
