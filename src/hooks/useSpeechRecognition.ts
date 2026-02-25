'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const shouldListenRef = useRef(false);

  const isSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const createRecognition = useCallback(() => {
    if (!isSupported) return null;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript + ' ';
        } else {
          interim += result[0].transcript;
        }
      }

      if (final) {
        setTranscript((prev) => prev + final);
      }
      setInterimTranscript(interim);
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'no-speech' || event.error === 'aborted') {
        // These are normal, just restart
        return;
      }
      if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone permissions.');
        shouldListenRef.current = false;
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      // Auto-restart if we should still be listening
      if (shouldListenRef.current) {
        try {
          recognition.start();
        } catch {
          // Already started or other error
        }
      } else {
        setIsListening(false);
      }
    };

    return recognition;
  }, [isSupported]);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    setError(null);
    shouldListenRef.current = true;

    if (!recognitionRef.current) {
      recognitionRef.current = createRecognition();
    }

    try {
      recognitionRef.current?.start();
      setIsListening(true);
    } catch {
      // Already started
    }
  }, [isSupported, createRecognition]);

  const stopListening = useCallback(() => {
    shouldListenRef.current = false;
    try {
      recognitionRef.current?.stop();
    } catch {
      // Already stopped
    }
    setIsListening(false);
    setInterimTranscript('');
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      shouldListenRef.current = false;
      try {
        recognitionRef.current?.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    };
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    error,
  };
}
