'use client';

import { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MessageCircle, Video, TrendingUp, Calendar, LogOut, Loader2 } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

interface MoodEntry {
  _id: string;
  mood: number;
  note: string;
  createdAt: string;
}

export default function Dashboard() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
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
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#00ff88] animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0d0d0d]/80 backdrop-blur-md border-b border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00ff88] flex items-center justify-center shadow-[0_0_20px_rgba(0,255,136,0.4)]">
              <span className="text-xl font-bold text-black">M</span>
            </div>
            <span className="text-xl font-bold tracking-tight">mindwell</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-[#666]">hey, <span className="text-white font-medium">{session.user.name}</span></span>
            <ThemeToggle />
            <button onClick={handleSignOut} className="flex items-center gap-2 px-4 py-2 text-[#666] hover:text-white transition duration-300">
              <LogOut className="w-4 h-4" />
              <span className="text-sm">sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="pt-24 max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-white mb-2">your dashboard</h1>
        <p className="text-[#666] mb-8">track your wellness journey</p>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link href="/chat" className="bg-[#111] p-6 rounded-2xl border border-[#222] hover:border-[#00ff88] transition duration-300 group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#00ff88] flex items-center justify-center shadow-[0_0_15px_rgba(0,255,136,0.3)] group-hover:shadow-[0_0_25px_rgba(0,255,136,0.5)] transition duration-300">
                <MessageCircle className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="font-bold text-white">AI Chat</h3>
                <p className="text-sm text-[#666]">talk to your AI companion</p>
              </div>
            </div>
          </Link>

          <Link href="/video" className="bg-[#111] p-6 rounded-2xl border border-[#222] hover:border-[#00d4ff] transition duration-300 group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#00d4ff] flex items-center justify-center shadow-[0_0_15px_rgba(0,212,255,0.3)] group-hover:shadow-[0_0_25px_rgba(0,212,255,0.5)] transition duration-300">
                <Video className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="font-bold text-white">Video Session</h3>
                <p className="text-sm text-[#666]">face-to-face with AI</p>
              </div>
            </div>
          </Link>

          <div className="bg-[#111] p-6 rounded-2xl border border-[#222]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#ff6b6b] flex items-center justify-center shadow-[0_0_15px_rgba(255,107,107,0.3)]">
                <TrendingUp className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="font-bold text-white">Mood Score</h3>
                <p className="text-sm text-[#666]">
                  {moodEntries.length > 0 ? `latest: ${moodEntries[0].mood}/10` : 'track your wellbeing'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <MoodTracker onMoodSaved={fetchMoods} />

          <div className="bg-[#111] p-6 rounded-2xl border border-[#222]">
            <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#00ff88]" />
              recent activity
            </h2>
            {moodEntries.length > 0 ? (
              <div className="space-y-4">
                {moodEntries.slice(0, 3).map((entry) => (
                  <div key={entry._id} className="flex items-center gap-3 text-[#666]">
                    <TrendingUp className="w-4 h-4 text-[#00ff88]" />
                    <span>mood: {entry.mood}/10 - {entry.note || 'no note'}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4 text-[#444]">
                <p>no recent activity yet.</p>
                <p className="text-sm">start by checking in with your mood!</p>
              </div>
            )}
          </div>
        </div>
      </main>
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
        setMessage('mood saved successfully!');
        setNote('');
        setMood(7);
        onMoodSaved();
      } else {
        const data = await response.json();
        setMessage(data.error || 'failed to save mood');
      }
    } catch (error) {
      setMessage('failed to save mood');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[#111] p-6 rounded-2xl border border-[#222]">
      <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-[#00ff88]" />
        quick mood check-in
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#666] mb-3">
            how are you feeling today? <span className="text-[#00ff88]">{mood}/10</span>
          </label>
          <input 
            type="range" 
            value={mood}
            onChange={(e) => setMood(Number(e.target.value))}
            min="1" 
            max="10" 
            className="w-full accent-[#00ff88]"
          />
          <div className="flex justify-between text-xs text-[#444] mt-2">
            <span>struggling</span>
            <span>great</span>
          </div>
        </div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="add a note about how you're feeling..."
          className="w-full p-4 bg-[#0d0d0d] border border-[#222] rounded-lg text-white placeholder-[#444] focus:outline-none focus:border-[#00ff88] transition duration-300"
          rows={3}
        />
        <button 
          type="submit" 
          disabled={saving}
          className="w-full py-3 bg-[#00ff88] text-black rounded-lg font-bold hover:shadow-[0_0_20px_rgba(0,255,136,0.5)] transition duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'save check-in'}
        </button>
        {message && (
          <p className={`text-sm text-center ${message.includes('success') ? 'text-[#00ff88]' : 'text-[#ff6b6b]'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
