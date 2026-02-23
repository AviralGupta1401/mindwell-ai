'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

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
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#00ff88] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0d0d0d]/80 backdrop-blur-md border-b border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00ff88] flex items-center justify-center shadow-[0_0_20px_rgba(0,255,136,0.4)]">
              <span className="text-xl font-bold text-black">M</span>
            </div>
            <span className="text-xl font-bold tracking-tight">mindwell</span>
          </div>
          <nav className="flex items-center gap-6">
            <ThemeToggle />
            <Link href="/sign-in" className="text-[#888] hover:text-white transition duration-300 text-sm font-medium">sign in</Link>
            <Link href="/sign-up" className="px-6 py-2 bg-[#00ff88] text-black rounded-lg text-sm font-bold hover:shadow-[0_0_20px_rgba(0,255,136,0.5)] transition duration-300">
              get started
            </Link>
          </nav>
        </div>
      </header>

      <main className="pt-24">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-[#1a1a1a] rounded-full mb-6 border border-[#333]">
                <span className="text-[#00ff88] text-sm font-medium">✨ AI-Powered Wellness</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-6">
                your mind.<br />
                <span className="text-[#00ff88]">our priority.</span>
              </h1>
              <p className="text-xl text-[#888] mb-8 max-w-lg">
                experience emotional support like never before. track moods, chat with AI, and feel better every day.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link href="/sign-up" className="px-8 py-4 bg-[#00ff88] text-black rounded-xl text-lg font-bold hover:shadow-[0_0_30px_rgba(0,255,136,0.5)] transition duration-300">
                  start free
                </Link>
                <Link href="/chat" className="px-8 py-4 bg-[#1a1a1a] border border-[#333] text-white rounded-xl text-lg font-medium hover:border-[#00ff88] transition duration-300">
                  try ai chat
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-[400px] md:h-[500px] bg-gradient-to-br from-[#00ff88]/20 to-[#00d4ff]/20 rounded-3xl border border-[#222] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-4">🧠</div>
                  <p className="text-[#00ff88] text-2xl font-bold">AI Companion</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            not just <span className="text-[#00ff88]">another</span> app.
          </h2>
          <p className="text-[#888] text-xl mb-12 max-w-2xl">
            a complete mental wellness ecosystem designed for you.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#111] p-8 rounded-2xl border border-[#222] hover:border-[#00ff88] transition duration-300 group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition duration-300">💬</div>
              <h3 className="text-xl font-bold mb-2">AI Chat</h3>
              <p className="text-[#666]">talk to an AI that actually understands. compassionate, non-judgmental, available 24/7.</p>
            </div>

            <div className="bg-[#111] p-8 rounded-2xl border border-[#222] hover:border-[#00d4ff] transition duration-300 group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition duration-300">📊</div>
              <h3 className="text-xl font-bold mb-2">Mood Tracking</h3>
              <p className="text-[#666]">track your emotional journey. discover patterns. understand yourself better.</p>
            </div>

            <div className="bg-[#111] p-8 rounded-2xl border border-[#222] hover:border-[#ff6b6b] transition duration-300 group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition duration-300">🎥</div>
              <h3 className="text-xl font-bold mb-2">Video Sessions</h3>
              <p className="text-[#666]">face-to-face support. connect deeper with AI-powered video interactions.</p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#00ff88] mb-2">24/7</div>
              <div className="text-[#666]">AI Available</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#00d4ff] mb-2">100%</div>
              <div className="text-[#666]">Private</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#ff6b6b] mb-2">Free</div>
              <div className="text-[#666]">To Start</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#ffd93d] mb-2">∞</div>
              <div className="text-[#666]">Possibilities</div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            ready to feel <span className="text-[#00ff88]">better?</span>
          </h2>
          <p className="text-[#888] text-xl mb-8 max-w-xl mx-auto">
            join thousands who have found their emotional support companion.
          </p>
          <Link href="/sign-up" className="inline-block px-12 py-5 bg-[#00ff88] text-black rounded-xl text-xl font-bold hover:shadow-[0_0_40px_rgba(0,255,136,0.6)] transition duration-300">
            create free account
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1a1a1a] py-12 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center gap-2 justify-center mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#00ff88] flex items-center justify-center">
              <span className="font-bold text-black">M</span>
            </div>
            <span className="font-bold">mindwell</span>
          </div>
          <p className="text-[#444] text-sm">© 2026 mindwell. made with ❤️ for your mental health.</p>
          <p className="text-[#333] text-xs mt-2">mindwell AI is not a substitute for professional medical advice.</p>
        </div>
      </footer>
    </div>
  );
}
