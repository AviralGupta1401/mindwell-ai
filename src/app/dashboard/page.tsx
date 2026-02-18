import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Brain, MessageCircle, Video, TrendingUp, Calendar, LogOut } from 'lucide-react';

export default async function Dashboard() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <header className="bg-[#16213e] shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e94560] to-[#0f3460] flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">MindWell</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-gray-400">Welcome, <span className="text-white font-medium">{session.user.name}</span></span>
            <Link href="/api/auth/sign-out" className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition duration-300">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Link>
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
                <p className="text-sm text-gray-500">Track your wellbeing</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#16213e] p-6 rounded-2xl shadow-[8px_8px_16px_#0f1425,-8px_-8px_16px_#1e2a4a]">
            <h2 className="text-xl font-semibold text-white mb-5 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#e94560]" />
              Quick Mood Check-in
            </h2>
            <MoodTracker />
          </div>

          <div className="bg-[#16213e] p-6 rounded-2xl shadow-[8px_8px_16px_#0f1425,-8px_-8px_16px_#1e2a4a]">
            <h2 className="text-xl font-semibold text-white mb-5">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-400">
                <MessageCircle className="w-5 h-5 text-[#e94560]" />
                <span>You had a chat session yesterday</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span>Mood: 7/10 - Feeling good!</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function MoodTracker() {
  return (
    <form action="/api/mood" method="POST" className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-3">How are you feeling today?</label>
        <input 
          type="range" 
          name="mood" 
          min="1" 
          max="10" 
          defaultValue="7" 
          className="w-full accent-[#e94560]"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Struggling</span>
          <span>Great</span>
        </div>
      </div>
      <textarea
        name="note"
        placeholder="Add a note about how you're feeling..."
        className="w-full p-4 bg-[#1a1a2e] border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#e94560] transition duration-300"
        rows={3}
      />
      <button 
        type="submit" 
        className="w-full py-3 bg-gradient-to-r from-[#e94560] to-[#0f3460] text-white rounded-lg hover:shadow-lg hover:shadow-[#e94560]/30 transition duration-300"
      >
        Save Check-in
      </button>
    </form>
  );
}
