'use client';

import { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MessageCircle, Video, TrendingUp, Calendar, LogOut, Home, Menu, Brain } from 'lucide-react';

interface MoodEntry {
  _id: string;
  mood: number;
  note: string;
  createdAt: string;
}

function Sidebar({ currentPage, sidebarOpen, onClose, onSignOut, session }: {
  currentPage: string;
  sidebarOpen: boolean;
  onClose: () => void;
  onSignOut: () => void;
  session: any;
}) {
  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/chat', label: 'AI Chat', icon: MessageCircle },
    { href: '/video', label: 'Video Session', icon: Video },
    { href: '/ai-session', label: 'AI Session', icon: Brain },
  ];

  return (
    <>
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 border-r border-zinc-800 transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="flex flex-col h-full p-5">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10 px-1">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold text-black">M</span>
            </div>
            <span className="text-xl font-bold text-green-500">MindWell</span>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === `/${currentPage}`;
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

          {/* User */}
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
              onClick={onSignOut}
              className="flex items-center gap-3 px-4 py-3 w-full text-zinc-400 hover:bg-zinc-800 hover:text-red-400 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
}

export default function Dashboard() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data } = await authClient.getSession();
      if (!data?.session) {
        router.push('/sign-in');
        return;
      }
      setSession(data);
      fetchMoods();
    } catch (error) {
      console.error('Session error:', error);
      router.push('/sign-in');
    } finally {
      setLoading(false);
    }
  };

  const fetchMoods = async () => {
    try {
      const response = await fetch('/api/mood');
      if (response.ok) {
        const data = await response.json();
        setMoodEntries(data);
      }
    } catch (error) {
      console.error('Failed to fetch moods:', error);
    }
  };

  const handleSignOut = async () => {
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
      <Sidebar
        currentPage="dashboard"
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSignOut={handleSignOut}
        session={session}
      />

      {/* Main content - offset by sidebar width on desktop */}
      <div className="md:pl-64">
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
        <header className="hidden md:flex items-center justify-end border-b border-zinc-800 px-8 py-4">
          <span className="text-zinc-400">
            Welcome back, <span className="text-white font-medium">{session.user?.name}</span>
          </span>
        </header>

        {/* Page content */}
        <div className="p-6 md:p-8 max-w-6xl">
          <h1 className="text-3xl font-bold mb-2">Your Dashboard</h1>
          <p className="text-zinc-400 mb-8">Track your wellness journey</p>

          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            <Link
              href="/chat"
              className="block bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-green-500/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.1)] transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-green-500" />
                </div>
                <span className="text-xl text-green-500 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all">&rarr;</span>
              </div>
              <h3 className="text-lg font-semibold mb-1">AI Chat</h3>
              <p className="text-sm text-zinc-400">Talk to your AI companion</p>
            </Link>

            <Link
              href="/video"
              className="block bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                  <Video className="w-6 h-6 text-cyan-500" />
                </div>
                <span className="text-xl text-cyan-500 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all">&rarr;</span>
              </div>
              <h3 className="text-lg font-semibold mb-1">Video Session</h3>
              <p className="text-sm text-zinc-400">Face-to-face with AI</p>
            </Link>

            <Link
              href="/ai-session"
              className="block bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-amber-500" />
                </div>
                <span className="text-xl text-amber-500 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all">&rarr;</span>
              </div>
              <h3 className="text-lg font-semibold mb-1">AI Session</h3>
              <p className="text-sm text-zinc-400">Face-to-face AI therapy</p>
            </Link>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <div className="mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-500" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-1">Mood Score</h3>
              <p className="text-sm text-zinc-400">
                {moodEntries.length > 0
                  ? `Latest: ${moodEntries[0].mood}/10`
                  : 'Track your wellbeing'}
              </p>
            </div>
          </div>

          {/* Mood tracker + activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MoodTracker onMoodSaved={fetchMoods} />

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Recent Activity
              </h2>
              {moodEntries.length > 0 ? (
                <div className="space-y-3">
                  {moodEntries.slice(0, 5).map((entry) => (
                    <div
                      key={entry._id}
                      className="flex items-center gap-3 text-sm p-3 bg-black/30 rounded-xl"
                    >
                      <TrendingUp className="w-4 h-4 text-green-500 shrink-0" />
                      <span className="text-zinc-300 shrink-0">Mood: {entry.mood}/10</span>
                      <span className="text-zinc-600">-</span>
                      <span className="text-zinc-400 truncate">{entry.note || 'No note'}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-zinc-500">
                  <p>No recent activity yet.</p>
                  <p className="text-sm mt-1">Start by checking in with your mood!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MoodTracker({ onMoodSaved }: { onMoodSaved: () => void }) {
  const [mood, setMood] = useState(7);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, note }),
      });

      if (response.ok) {
        setMessage('Mood saved successfully!');
        setNote('');
        setMood(7);
        onMoodSaved();
      } else {
        const data = await response.json();
        setMessage(data.error || 'Failed to save mood');
      }
    } catch (error) {
      setMessage('Failed to save mood');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-green-500" />
        Quick Mood Check-in
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm text-zinc-400 mb-3">
            How are you feeling today?{' '}
            <span className="text-green-500 font-semibold text-lg">{mood}/10</span>
          </label>
          <input
            type="range"
            value={mood}
            onChange={(e) => setMood(Number(e.target.value))}
            min="1"
            max="10"
            className="w-full accent-green-500 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-zinc-600 mt-2">
            <span>Struggling</span>
            <span>Great</span>
          </div>
        </div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note about how you're feeling..."
          className="w-full p-4 bg-black border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-green-500 transition-colors resize-none"
          rows={4}
        />
        <button
          type="submit"
          disabled={saving}
          className="w-full py-4 bg-green-500 text-black font-semibold rounded-xl hover:bg-green-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] transition-all disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Check-in'}
        </button>
        {message && (
          <p className={`text-sm text-center ${message.includes('success') ? 'text-green-500' : 'text-red-400'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
