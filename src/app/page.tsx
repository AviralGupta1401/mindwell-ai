'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { MessageCircle, TrendingUp, Video, Brain, ArrowRight } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data } = await authClient.getSession();
      if (data?.session) {
        router.push('/dashboard');
        return;
      }
    } catch (error) {
      console.error('Session check error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Glow Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold text-black">M</span>
            </div>
            <span className="text-2xl font-bold text-green-500">MindWell</span>
          </div>
          <nav className="flex items-center gap-4 sm:gap-8">
            <a href="/sign-in" className="text-zinc-400 hover:text-green-500 transition-colors font-medium">
              Sign In
            </a>
            <a href="/sign-up" className="px-5 py-2.5 bg-green-500 text-black font-semibold rounded-xl hover:bg-green-400 transition-colors">
              Get Started
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <div className="inline-block px-4 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 text-sm mb-8">
              Your mental wellness journey starts here
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Your AI Mental<br />
              <span className="text-green-500">Health Companion</span>
            </h1>
            <p className="text-xl text-zinc-400 mb-10 max-w-xl mx-auto leading-relaxed">
              Chat with AI, track your mood, and get emotional support.
              A safe space to express yourself.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/sign-up"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-500 text-black text-lg font-semibold rounded-2xl hover:bg-green-400 transition-colors"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="/chat"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-zinc-700 text-lg font-semibold rounded-2xl hover:border-green-500 hover:text-green-500 transition-colors"
              >
                Try Chat Demo
              </a>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl hover:border-green-500/50 transition-colors group text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="font-semibold text-xl mb-3">AI Chat</h3>
              <p className="text-zinc-400">Talk to a compassionate AI anytime, anywhere</p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl hover:border-amber-500/50 transition-colors group text-center">
              <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                <Brain className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="font-semibold text-xl mb-3">AI Session</h3>
              <p className="text-zinc-400">Face-to-face AI therapy with emotion detection</p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl hover:border-cyan-500/50 transition-colors group text-center">
              <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-8 h-8 text-cyan-500" />
              </div>
              <h3 className="font-semibold text-xl mb-3">Mood Tracking</h3>
              <p className="text-zinc-400">Track your emotional wellbeing daily</p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl hover:border-purple-500/50 transition-colors group text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                <Video className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="font-semibold text-xl mb-3">Video Sessions</h3>
              <p className="text-zinc-400">Connect face-to-face through video calls</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-800 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-zinc-500 text-sm">
          &copy; 2026 MindWell. Not a substitute for professional medical advice.
        </div>
      </footer>
    </div>
  );
}
