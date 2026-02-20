'use client';

import { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Brain, MessageCircle, Video, TrendingUp, Calendar, LogOut, Loader2 } from 'lucide-react';

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
      <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#e94560] animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <header className="bg-[#16213e] shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e94560] to-[#0f3460] flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">MindWell</span>
          </Link>
          <div className="flex items-center gap-6">
            <span className="text-gray-400">Welcome, <span className="text-white font-medium">{session.user.name}</span></span>
            <button onClick={handleSignOut} className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition duration-300">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-white mb-8">Your Wellness Dashboard</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link href="/chat" className="bg-[#16213e] p-6 rounded-2xl shadow-[8px_8px_16px_#0f1425,-8px_-8px_16px_#1e2a4a] hover:shadow-[12px_12px_24px_#0f1425,-12px_-12px_24px_#1e2a4a] transition duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#e94560] to-[#ff6b6b] flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">AI Chat</h3>
                <p className="text-sm text-gray-500">Talk to your AI companion</p>
              </div>
            </div>
          </Link>

          <Link href="/video" className="bg-[#16213e] p-6 rounded-2xl shadow-[8px_8px_16px_#0f1425,-8px_-8px_16px_#1e2a4a] hover:shadow-[12px_12px_24px_#0f1425,-12px_-12px_24px_#1e2a4a] transition duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0f3460] to-[#533483] flex items-center justify-center">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Video Session</h3>
                <p className="text-sm text-gray-500">Start a video call</p>
              </div>
            </div>
          </Link>

          <div className="bg-[#16213e] p-6 rounded-2xl shadow-[8px_8px_16px_#0f1425,-8px_-8px_16px_#1e2a4a]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#533483] to-[#0f3460] flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Mood Score</h3>
                <p className="text-sm text-gray-500">
                  {moodEntries.length > 0 ? `Latest: ${moodEntries[0].mood}/10` : 'Track your wellbeing'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <MoodTracker onMoodSaved={fetchMoods} />

          <div className="bg-[#16213e] p-6 rounded-2xl shadow-[8px_8px_16px_#0f1425,-8px_-8px_16px_#1e2a4a]">
            <h2 className="text-xl font-semibold text-white mb-5">Recent Activity</h2>
            {moodEntries.length > 0 ? (
              <div className="space-y-4">
                {moodEntries.slice(0, 3).map((entry) => (
                  <div key={entry._id} className="flex items-center gap-3 text-gray-400">
                    <TrendingUp className="w-5 h-5 text-[#e94560]" />
                    <span>Mood: {entry.mood}/10 - {entry.note || 'No note'}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4 text-gray-500">
                <p>No recent activity yet.</p>
                <p className="text-sm">Start by checking in with your mood!</p>
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
    <div className="bg-[#16213e] p-6 rounded-2xl shadow-[8px_8px_16px_#0f1425,-8px_-8px_16px_#1e2a4a]">
      <h2 className="text-xl font-semibold text-white mb-5 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-[#e94560]" />
        Quick Mood Check-in
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-3">How are you feeling today? <span className="text-[#e94560]">{mood}/10</span></label>
          <input 
            type="range" 
            value={mood}
            onChange={(e) => setMood(Number(e.target.value))}
            min="1" 
            max="10" 
            className="w-full accent-[#e94560]"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Struggling</span>
            <span>Great</span>
          </div>
        </div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note about how you're feeling..."
          className="w-full p-4 bg-[#1a1a2e] border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#e94560] transition duration-300"
          rows={3}
        />
        <button 
          type="submit" 
          disabled={saving}
          className="w-full py-3 bg-gradient-to-r from-[#e94560] to-[#0f3460] text-white rounded-lg hover:shadow-lg hover:shadow-[#e94560]/30 transition duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Check-in'}
        </button>
        {message && (
          <p className={`text-sm text-center ${message.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
