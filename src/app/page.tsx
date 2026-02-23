'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Brain, Video, Heart, MessageCircle, ArrowRight, Sparkles, Shield, Users } from 'lucide-react';
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
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[var(--accent)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="bg-[var(--card-bg)] shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e94560] to-[#0f3460] flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-[var(--foreground)]">MindWell</span>
          </div>
          <nav className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/dashboard" className="text-[var(--muted)] hover:text-[var(--foreground)] transition duration-300">Dashboard</Link>
            <Link href="/chat" className="text-[var(--muted)] hover:text-[var(--foreground)] transition duration-300">Chat</Link>
            <Link href="/sign-in" className="px-5 py-2 text-[var(--muted)] hover:text-[var(--foreground)] transition duration-300">Sign In</Link>
            <Link href="/sign-up" className="px-5 py-2 bg-gradient-to-r from-[#e94560] to-[#0f3460] text-white rounded-lg hover:shadow-lg hover:shadow-[#e94560]/30 transition duration-300">
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="max-w-6xl mx-auto px-6 py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-[var(--card-bg)] px-5 py-2 rounded-full mb-8 shadow-[var(--card-shadow)]">
            <Sparkles className="w-4 h-4 text-[var(--accent)]" />
            <span className="text-[var(--muted)] text-sm">AI-Powered Mental Wellness</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--foreground)] mb-6 leading-tight">
            Find Peace of Mind<br />
            <span className="bg-gradient-to-r from-[#e94560] to-[#ff6b6b] bg-clip-text text-transparent">With AI Support</span>
          </h1>
          <p className="text-xl text-[var(--muted)] mb-10 max-w-2xl mx-auto leading-relaxed">
            Your personal mental wellness companion. Track moods, chat with AI, and connect through secure video sessions.
          </p>
          <div className="flex gap-5 justify-center flex-wrap">
            <Link href="/sign-up" className="px-8 py-4 bg-gradient-to-r from-[#e94560] to-[#0f3460] text-white rounded-xl text-lg hover:shadow-xl hover:shadow-[#e94560]/30 transition duration-300 flex items-center gap-2 font-semibold">
              Start Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/chat" className="px-8 py-4 bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--foreground)] rounded-xl text-lg hover:bg-[var(--card-shadow-light)] transition duration-300">
              Try AI Chat
            </Link>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[var(--card-bg)] p-8 rounded-2xl shadow-[8px_8px_16px_var(--card-shadow),-8px_-8px_16px_var(--card-shadow-light)]">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#e94560] to-[#ff6b6b] flex items-center justify-center mb-5 shadow-lg">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-3">AI Chat Support</h3>
              <p className="text-[var(--muted)]">Chat with a compassionate AI that listens without judgment and provides thoughtful emotional support.</p>
            </div>

            <div className="bg-[var(--card-bg)] p-8 rounded-2xl shadow-[8px_8px_16px_var(--card-shadow),-8px_-8px_16px_var(--card-shadow-light)]">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0f3460] to-[#16213e] flex items-center justify-center mb-5 shadow-lg border border-[var(--border-color)]">
                <Heart className="w-7 h-7 text-[#e94560]" />
              </div>
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-3">Mood Tracking</h3>
              <p className="text-[var(--muted)]">Track daily moods with simple check-ins and discover patterns in your emotional wellbeing over time.</p>
            </div>

            <div className="bg-[var(--card-bg)] p-8 rounded-2xl shadow-[8px_8px_16px_var(--card-shadow),-8px_-8px_16px_var(--card-shadow-light)]">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#533483] to-[#0f3460] flex items-center justify-center mb-5 shadow-lg">
                <Video className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-3">Video Sessions</h3>
              <p className="text-[var(--muted)]">Connect face-to-face through secure, private video calls for more personal support when you need it.</p>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[var(--card-bg)] p-6 rounded-xl shadow-[5px_5px_10px_var(--card-shadow),-5px_-5px_10px_var(--card-shadow-light)] flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#e94560] to-[#0f3460] flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-[var(--foreground)] font-semibold">Private & Secure</h4>
                <p className="text-[var(--muted-dark)] text-sm">Your data stays confidential</p>
              </div>
            </div>
            <div className="bg-[var(--card-bg)] p-6 rounded-xl shadow-[5px_5px_10px_var(--card-shadow),-5px_-5px_10px_var(--card-shadow-light)] flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#533483] to-[#0f3460] flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-[var(--foreground)] font-semibold">24/7 Available</h4>
                <p className="text-[var(--muted-dark)] text-sm">Support whenever you need</p>
              </div>
            </div>
            <div className="bg-[var(--card-bg)] p-6 rounded-xl shadow-[5px_5px_10px_var(--card-shadow),-5px_-5px_10px_var(--card-shadow-light)] flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#0f3460] to-[#16213e] flex items-center justify-center border border-[var(--border-color)]">
                <Brain className="w-6 h-6 text-[#e94560]" />
              </div>
              <div>
                <h4 className="text-[var(--foreground)] font-semibold">Smart AI</h4>
                <p className="text-[var(--muted-dark)] text-sm">Personalized conversations</p>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-6">
            Take Control of Your Mental Wellness
          </h2>
          <p className="text-[var(--muted)] text-lg mb-8 max-w-xl mx-auto">
            Join thousands who have found a safe, supportive space to express themselves and grow.
          </p>
          <Link href="/sign-up" className="inline-block px-10 py-4 bg-gradient-to-r from-[#e94560] to-[#0f3460] text-white rounded-xl text-lg hover:shadow-xl hover:shadow-[#e94560]/30 transition duration-300 font-bold">
            Create Your Free Account
          </Link>
        </section>
      </main>

      <footer className="bg-[var(--card-shadow)] border-t border-[var(--border-color)] py-8 mt-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-[var(--muted)]">© 2026 MindWell AI. All rights reserved.</p>
          <p className="mt-2 text-sm text-[var(--muted-dark)]">MindWell AI is not a substitute for professional medical advice.</p>
        </div>
      </footer>
    </div>
  );
}
