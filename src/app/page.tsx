'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

function Logo() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#1e3a5f"/>
      <path d="M12 20C12 15.5817 15.5817 12 20 12C24.4183 12 28 15.5817 28 20" stroke="#4a9eff" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="20" cy="24" r="4" fill="#4a9eff"/>
      <path d="M20 12V8" stroke="#4a9eff" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}

function BrainIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0 1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 5.28.55 2.5 2.5 0 0 0 1.98-3 2.5 2.5 0 0 0-1.32-4.24 3 3 0 0 0-.34-5.58 2.5 2.5 0 0 0-.46-.55z" fill="#4a9eff"/>
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="#e8f4ff"/>
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="5" width="14" height="14" rx="2" fill="#e8f4ff"/>
      <path d="M16 10l6-4v12l-6-4z" fill="#4a9eff"/>
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 20V10M12 20V4M6 20v-6" stroke="#4a9eff" strokeLinecap="round"/>
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#e8f4ff"/>
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" fill="#e8f4ff"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" fill="#e8f4ff"/>
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  );
}

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
      <div className="min-h-screen bg-[#f5f7fa] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#1e3a5f] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="text-xl font-semibold text-[#1e3a5f]">MindWell</span>
          </div>
          <nav className="flex items-center gap-6">
            <a href="/dashboard" className="text-gray-600 hover:text-[#1e3a5f] transition">Dashboard</a>
            <a href="/chat" className="text-gray-600 hover:text-[#1e3a5f] transition">Chat</a>
            <a href="/sign-in" className="text-gray-600 hover:text-[#1e3a5f] transition">Sign In</a>
            <a href="/sign-up" className="px-5 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2a4a73] transition">
              Get Started
            </a>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-2 bg-[#e8f4ff] text-[#1e3a5f] rounded-full text-sm mb-6">
              AI-Powered Mental Wellness
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-[#1e3a5f] mb-6 leading-tight">
              Your Mind.<br />
              <span className="text-[#4a9eff]">Our Priority.</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Experience emotional support like never before. Track moods, chat with AI, and feel better every day with our comprehensive mental wellness platform.
            </p>
            <div className="flex gap-4 justify-center">
              <a href="/sign-up" className="px-8 py-3 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2a4a73] transition flex items-center gap-2">
                Start Free <ArrowIcon />
              </a>
              <a href="/chat" className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                Try AI Chat
              </a>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-center text-[#1e3a5f] mb-4">
            Complete Mental Wellness
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Everything you need to maintain good mental health in one place.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
              <div className="w-14 h-14 bg-[#e8f4ff] rounded-xl flex items-center justify-center mb-5">
                <ChatIcon />
              </div>
              <h3 className="text-xl font-semibold text-[#1e3a5f] mb-3">AI Chat Support</h3>
              <p className="text-gray-600">Chat with a compassionate AI that listens without judgment and provides thoughtful emotional support.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
              <div className="w-14 h-14 bg-[#e8f4ff] rounded-xl flex items-center justify-center mb-5">
                <ChartIcon />
              </div>
              <h3 className="text-xl font-semibold text-[#1e3a5f] mb-3">Mood Tracking</h3>
              <p className="text-gray-600">Track daily moods with simple check-ins and discover patterns in your emotional wellbeing.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
              <div className="w-14 h-14 bg-[#e8f4ff] rounded-xl flex items-center justify-center mb-5">
                <VideoIcon />
              </div>
              <h3 className="text-xl font-semibold text-[#1e3a5f] mb-3">Video Sessions</h3>
              <p className="text-gray-600">Face-to-face support through secure, private video calls for more personal interactions.</p>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-[#e8f4ff] rounded-lg flex items-center justify-center">
                <ShieldIcon />
              </div>
              <div>
                <h4 className="font-semibold text-[#1e3a5f]">Private & Secure</h4>
                <p className="text-sm text-gray-500">Your data stays confidential</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-[#e8f4ff] rounded-lg flex items-center justify-center">
                <UsersIcon />
              </div>
              <div>
                <h4 className="font-semibold text-[#1e3a5f]">24/7 Available</h4>
                <p className="text-sm text-gray-500">Support whenever you need</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-[#e8f4ff] rounded-lg flex items-center justify-center">
                <BrainIcon />
              </div>
              <div>
                <h4 className="font-semibold text-[#1e3a5f]">Smart AI</h4>
                <p className="text-sm text-gray-500">Personalized conversations</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-[#1e3a5f] mb-4">
            Take Control of Your Mental Wellness
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Join thousands who have found a safe, supportive space to express themselves and grow.
          </p>
          <a href="/sign-up" className="inline-block px-10 py-4 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2a4a73] transition font-semibold">
            Create Your Free Account
          </a>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-500">© 2026 MindWell. All rights reserved.</p>
          <p className="mt-2 text-sm text-gray-400">MindWell is not a substitute for professional medical advice.</p>
        </div>
      </footer>
    </div>
  );
}
