'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Home,
  MessageCircle,
  Video,
  Brain,
  LogOut,
  Menu,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Square,
  Play,
  Loader2,
} from 'lucide-react';
import { useFaceDetection } from '@/hooks/useFaceDetection';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useVoiceAnalysis } from '@/hooks/useVoiceAnalysis';
import type { SessionStatus, SessionExchange, EmotionSnapshot, VoiceMetrics } from '@/types/ai-session';

const emotionEmojis: Record<string, string> = {
  neutral: '😐',
  happy: '😊',
  sad: '😢',
  angry: '😠',
  fearful: '😨',
  disgusted: '🤢',
  surprised: '😲',
};

const emotionColors: Record<string, string> = {
  neutral: 'bg-zinc-500',
  happy: 'bg-green-500',
  sad: 'bg-blue-500',
  angry: 'bg-red-500',
  fearful: 'bg-purple-500',
  disgusted: 'bg-yellow-600',
  surprised: 'bg-amber-500',
};

export default function AISession() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  // Session state
  const [status, setStatus] = useState<SessionStatus>('idle');
  const [exchanges, setExchanges] = useState<SessionExchange[]>([]);
  const [aiResponse, setAiResponse] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(0);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTranscriptRef = useRef('');
  const emotionsBufferRef = useRef<EmotionSnapshot[]>([]);
  const exchangesRef = useRef<SessionExchange[]>([]);

  // Hooks
  const faceDetection = useFaceDetection();
  const speech = useSpeechRecognition();
  const tts = useSpeechSynthesis();
  const voiceAnalysis = useVoiceAnalysis();

  // Keep exchangesRef in sync
  useEffect(() => {
    exchangesRef.current = exchanges;
  }, [exchanges]);

  // Auth check
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await authClient.getSession();
        if (!data?.session) {
          router.push('/sign-in');
          return;
        }
        setSession(data);
      } catch {
        router.push('/sign-in');
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, [router]);

  // Buffer emotion snapshots for sending to API
  useEffect(() => {
    if (faceDetection.currentEmotion && status === 'active') {
      emotionsBufferRef.current.push(faceDetection.currentEmotion);
      // Keep last 20 snapshots in buffer
      if (emotionsBufferRef.current.length > 20) {
        emotionsBufferRef.current = emotionsBufferRef.current.slice(-20);
      }
    }
  }, [faceDetection.currentEmotion, status]);

  // Silence detection — when user stops talking for 2s, process their input
  useEffect(() => {
    if (status !== 'active') return;

    const currentTranscript = speech.transcript;
    if (!currentTranscript || currentTranscript === lastTranscriptRef.current) return;

    // Transcript changed — user is speaking, reset timer
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }

    silenceTimerRef.current = setTimeout(() => {
      // 2 seconds of silence — process the input
      const newText = currentTranscript.slice(lastTranscriptRef.current.length).trim();
      if (newText) {
        processUserInput(newText);
      }
    }, 2000);

    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, [speech.transcript, status]);

  // Update voice pace based on word count
  useEffect(() => {
    if (speech.transcript) {
      const wordCount = speech.transcript.split(/\s+/).filter(Boolean).length;
      voiceAnalysis.updatePace(wordCount);
    }
  }, [speech.transcript]);

  const processUserInput = useCallback(async (text: string) => {
    if (!text.trim()) return;

    setStatus('processing');
    speech.stopListening();

    const emotions = [...emotionsBufferRef.current];
    const currentVoiceMetrics: VoiceMetrics = { ...voiceAnalysis.metrics };

    try {
      const res = await fetch('/api/ai-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: text,
          emotions,
          voiceMetrics: currentVoiceMetrics,
          history: exchangesRef.current.slice(-5), // last 5 exchanges for context
        }),
      });

      if (!res.ok) throw new Error('Failed to get AI response');

      const data = await res.json();
      const responseText = data.response;

      setAiResponse(responseText);

      const exchange: SessionExchange = {
        userTranscript: text,
        detectedEmotions: emotions,
        voiceMetrics: currentVoiceMetrics,
        aiResponse: responseText,
        timestamp: Date.now(),
      };
      setExchanges((prev) => [...prev, exchange]);

      // Speak the response
      setStatus('speaking');
      lastTranscriptRef.current = speech.transcript;
      emotionsBufferRef.current = [];

      await tts.speak(responseText);

      // Resume listening after AI finishes speaking
      setStatus('active');
      speech.startListening();
    } catch (err) {
      console.error('Process error:', err);
      setAiResponse("I'm sorry, I had trouble processing that. Could you try again?");
      setStatus('active');
      speech.startListening();
    }
  }, [speech, tts, voiceAnalysis.metrics]);

  // When the video element mounts/updates, attach the stream
  useEffect(() => {
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [status]);

  const startSession = useCallback(async () => {
    setStatus('loading');

    try {
      // Request camera + mic
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;

      // Load face detection models
      await faceDetection.loadModels();

      // Set to ready — this renders the video element
      setStatus('ready');
    } catch (err: any) {
      console.error('Failed to start session:', err);
      setStatus('idle');
      alert('Could not access camera/microphone. Please grant permissions and try again.');
    }
  }, [faceDetection]);

  // Once status becomes 'ready', the video element is in the DOM — attach stream and start detection
  useEffect(() => {
    if (status !== 'ready') return;

    const timer = setTimeout(() => {
      if (videoRef.current && streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
        faceDetection.startDetection(videoRef.current);
      }
      if (streamRef.current) {
        voiceAnalysis.startAnalysis(streamRef.current);
      }
      speech.startListening();
      setStatus('active');
      setSessionStartTime(Date.now());
      lastTranscriptRef.current = '';
      emotionsBufferRef.current = [];
    }, 500);

    return () => clearTimeout(timer);
  }, [status]);

  const endSession = useCallback(() => {
    // Stop everything
    speech.stopListening();
    tts.stop();
    faceDetection.stopDetection();
    voiceAnalysis.stopAnalysis();

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }

    // Stop media stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setStatus('ended');
  }, [speech, tts, faceDetection, voiceAnalysis]);

  const toggleMute = useCallback(() => {
    if (isMuted) {
      speech.startListening();
    } else {
      speech.stopListening();
    }
    setIsMuted(!isMuted);
  }, [isMuted, speech]);

  const toggleCamera = useCallback(() => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCamOff(!videoTrack.enabled);
      }
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/chat', label: 'AI Chat', icon: MessageCircle },
    { href: '/video', label: 'Video Session', icon: Video },
    { href: '/ai-session', label: 'AI Session', icon: Brain },
  ];

  const handleSignOut = async () => {
    endSession();
    await authClient.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 border-r border-zinc-800 transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="flex flex-col h-full p-5">
          <div className="flex items-center gap-3 mb-10 px-1">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold text-black">M</span>
            </div>
            <span className="text-xl font-bold text-green-500">MindWell</span>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === '/ai-session';
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-green-500/10 text-green-500'
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-zinc-800 pt-4">
            {session && (
              <div className="flex items-center gap-3 px-4 py-3 mb-1">
                <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center text-sm font-medium">
                  {session.user?.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{session.user?.name}</p>
                  <p className="text-xs text-zinc-500 truncate">{session.user?.email}</p>
                </div>
              </div>
            )}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-3 w-full text-zinc-400 hover:bg-zinc-800 hover:text-red-400 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="md:pl-64 h-screen flex flex-col">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between border-b border-zinc-800 px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-zinc-800 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="text-green-500 font-bold text-lg">MindWell</span>
          <div className="w-10" />
        </header>

        {/* Desktop header */}
        <header className="hidden md:flex items-center justify-between border-b border-zinc-800 px-8 py-4">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-amber-500" />
            <h1 className="text-lg font-semibold">AI Session</h1>
            {status === 'active' && (
              <span className="flex items-center gap-2 text-sm text-green-500">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Live
              </span>
            )}
            {status === 'processing' && (
              <span className="flex items-center gap-2 text-sm text-amber-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Thinking...
              </span>
            )}
            {status === 'speaking' && (
              <span className="flex items-center gap-2 text-sm text-blue-500">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                Speaking
              </span>
            )}
          </div>
          {sessionStartTime > 0 && status !== 'ended' && status !== 'idle' && (
            <SessionTimer startTime={sessionStartTime} />
          )}
        </header>

        {/* Session content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {status === 'idle' && (
            <div className="flex flex-col items-center justify-center h-full text-center max-w-lg mx-auto">
              <div className="w-20 h-20 bg-amber-500/20 rounded-2xl flex items-center justify-center mb-6">
                <Brain className="w-10 h-10 text-amber-500" />
              </div>
              <h2 className="text-2xl font-bold mb-3">AI Therapy Session</h2>
              <p className="text-zinc-400 mb-2">
                Have a face-to-face conversation with your AI companion. It will observe your facial expressions and listen to your voice to provide empathetic, emotionally-aware responses.
              </p>
              <p className="text-zinc-500 text-sm mb-8">
                You will need to allow camera and microphone access. Works best in Chrome or Edge.
              </p>
              <button
                onClick={startSession}
                className="flex items-center gap-3 px-8 py-4 bg-amber-500 text-black font-semibold rounded-xl hover:bg-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all"
              >
                <Play className="w-5 h-5" />
                Start Session
              </button>
              {!speech.isSupported && (
                <p className="mt-4 text-sm text-red-400">
                  Speech recognition is not supported in your browser. Please use Chrome or Edge.
                </p>
              )}
            </div>
          )}

          {status === 'loading' && (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
              <p className="text-zinc-400">Setting up your session...</p>
              <p className="text-zinc-500 text-sm mt-1">Loading face detection models & camera</p>
            </div>
          )}

          {(status === 'ready' || status === 'active' || status === 'processing' || status === 'speaking') && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
              {/* Left column: Camera + Emotion */}
              <div className="lg:col-span-1 space-y-4">
                {/* Camera feed */}
                <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full aspect-video object-cover ${isCamOff ? 'opacity-0' : ''}`}
                  />
                  {isCamOff && (
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                      <CameraOff className="w-12 h-12 text-zinc-600" />
                    </div>
                  )}
                  {/* Volume indicator */}
                  {status === 'active' && (
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="h-1 bg-zinc-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full transition-all duration-100"
                          style={{ width: `${voiceAnalysis.metrics.volume}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Emotion panel */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                  <h3 className="text-sm font-medium text-zinc-400 mb-3">Detected Emotions</h3>
                  {faceDetection.currentEmotion ? (
                    <div className="space-y-2">
                      {Object.entries(faceDetection.currentEmotion.all)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 4)
                        .map(([emotion, value]) => (
                          <div key={emotion} className="flex items-center gap-2">
                            <span className="text-sm w-6">{emotionEmojis[emotion]}</span>
                            <span className="text-xs text-zinc-400 w-20 capitalize">{emotion}</span>
                            <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${emotionColors[emotion]}`}
                                style={{ width: `${Math.round(value * 100)}%` }}
                              />
                            </div>
                            <span className="text-xs text-zinc-500 w-10 text-right">
                              {Math.round(value * 100)}%
                            </span>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-500">
                      {faceDetection.isDetecting ? 'Looking for face...' : 'Not detecting'}
                    </p>
                  )}
                </div>

                {/* Voice metrics */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                  <h3 className="text-sm font-medium text-zinc-400 mb-3">Voice Analysis</h3>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-lg font-semibold">{voiceAnalysis.metrics.volume}</p>
                      <p className="text-xs text-zinc-500">Volume</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold capitalize">{voiceAnalysis.metrics.pace}</p>
                      <p className="text-xs text-zinc-500">Pace</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold">
                        {voiceAnalysis.metrics.isSpeaking ? (
                          <span className="text-green-500">Active</span>
                        ) : (
                          <span className="text-zinc-500">Silent</span>
                        )}
                      </p>
                      <p className="text-xs text-zinc-500">Status</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column: Transcript + AI Response */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                {/* AI Response */}
                {aiResponse && (
                  <div className="bg-zinc-900 border border-amber-500/30 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                        <Brain className="w-4 h-4 text-amber-500" />
                      </div>
                      <span className="text-sm font-medium text-amber-500">MindWell</span>
                      {status === 'speaking' && (
                        <span className="text-xs text-blue-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                          Speaking
                        </span>
                      )}
                    </div>
                    <p className="text-zinc-200 leading-relaxed">{aiResponse}</p>
                  </div>
                )}

                {/* Live transcript */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Mic className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-zinc-400">Your Words</span>
                    {speech.isListening && (
                      <span className="text-xs text-green-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        Listening
                      </span>
                    )}
                  </div>
                  <div className="text-zinc-300 leading-relaxed min-h-[60px]">
                    {speech.transcript ? (
                      <>
                        <span>{speech.transcript}</span>
                        {speech.interimTranscript && (
                          <span className="text-zinc-500">{speech.interimTranscript}</span>
                        )}
                      </>
                    ) : (
                      <p className="text-zinc-500 italic">
                        {speech.isListening
                          ? 'Start speaking — I\'m listening...'
                          : 'Microphone paused'}
                      </p>
                    )}
                  </div>
                  {speech.error && (
                    <p className="text-sm text-red-400 mt-2">{speech.error}</p>
                  )}
                </div>

                {/* Conversation history */}
                {exchanges.length > 0 && (
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 max-h-64 overflow-y-auto">
                    <h3 className="text-sm font-medium text-zinc-400 mb-3">Conversation</h3>
                    <div className="space-y-4">
                      {exchanges.map((ex, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex gap-2">
                            <span className="text-xs text-zinc-500 shrink-0 mt-0.5">You:</span>
                            <p className="text-sm text-zinc-300">{ex.userTranscript}</p>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-xs text-amber-500 shrink-0 mt-0.5">AI:</span>
                            <p className="text-sm text-zinc-400">{ex.aiResponse}</p>
                          </div>
                          {i < exchanges.length - 1 && <hr className="border-zinc-800" />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {status === 'ended' && (
            <div className="max-w-lg mx-auto text-center py-12">
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Brain className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Session Complete</h2>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6 text-left">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-zinc-500">Duration</p>
                    <p className="text-lg font-semibold">
                      {formatDuration(Date.now() - sessionStartTime)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Exchanges</p>
                    <p className="text-lg font-semibold">{exchanges.length}</p>
                  </div>
                </div>
                {exchanges.length > 0 && (
                  <div>
                    <p className="text-xs text-zinc-500 mb-2">Dominant Emotions</p>
                    <div className="flex flex-wrap gap-2">
                      {getDominantEmotions(exchanges).map(([emotion, count]) => (
                        <span
                          key={emotion}
                          className="px-3 py-1 bg-zinc-800 rounded-full text-sm flex items-center gap-1"
                        >
                          {emotionEmojis[emotion]} {emotion}
                          <span className="text-zinc-500">({count})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setStatus('idle');
                    setExchanges([]);
                    setAiResponse('');
                    speech.resetTranscript();
                    faceDetection.clearHistory();
                    setSessionStartTime(0);
                  }}
                  className="px-6 py-3 bg-amber-500 text-black font-semibold rounded-xl hover:bg-amber-400 transition-colors"
                >
                  New Session
                </button>
                <Link
                  href="/dashboard"
                  className="px-6 py-3 bg-zinc-800 text-white font-semibold rounded-xl hover:bg-zinc-700 transition-colors"
                >
                  Dashboard
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Controls bar */}
        {(status === 'active' || status === 'processing' || status === 'speaking') && (
          <div className="border-t border-zinc-800 px-6 py-4 flex items-center justify-center gap-4">
            <button
              onClick={toggleMute}
              className={`p-3 rounded-xl transition-colors ${
                isMuted
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  : 'bg-zinc-800 text-white hover:bg-zinc-700'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <button
              onClick={toggleCamera}
              className={`p-3 rounded-xl transition-colors ${
                isCamOff
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  : 'bg-zinc-800 text-white hover:bg-zinc-700'
              }`}
              title={isCamOff ? 'Turn on camera' : 'Turn off camera'}
            >
              {isCamOff ? <CameraOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
            </button>
            <button
              onClick={endSession}
              className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
              title="End session"
            >
              <Square className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SessionTimer({ startTime }: { startTime: number }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Date.now() - startTime);
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const mins = Math.floor(elapsed / 60000);
  const secs = Math.floor((elapsed % 60000) / 1000);

  return (
    <span className="text-sm text-zinc-400 font-mono">
      {mins}:{secs.toString().padStart(2, '0')}
    </span>
  );
}

function getDominantEmotions(exchanges: SessionExchange[]): [string, number][] {
  const counts: Record<string, number> = {};
  for (const ex of exchanges) {
    for (const emo of ex.detectedEmotions) {
      counts[emo.dominant] = (counts[emo.dominant] || 0) + 1;
    }
  }
  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);
}
