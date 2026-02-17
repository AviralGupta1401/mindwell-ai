import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Brain, MessageCircle, Video, TrendingUp, Calendar } from 'lucide-react';

export default async function Dashboard() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect('/api/auth/sign-in');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">MindWell AI</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {session.user.name}</span>
            <Link href="/api/auth/sign-out" className="px-4 py-2 text-gray-600 hover:text-indigo-600 transition">
              Sign Out
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Wellness Dashboard</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link href="/chat" className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AI Chat</h3>
                <p className="text-sm text-gray-500">Talk to your AI companion</p>
              </div>
            </div>
          </Link>

          <Link href="/video" className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Video className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Video Session</h3>
                <p className="text-sm text-gray-500">Start a video call</p>
              </div>
            </div>
          </Link>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Mood Score</h3>
                <p className="text-sm text-gray-500">Track your wellbeing</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              Quick Mood Check-in
            </h2>
            <MoodTracker />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <MessageCircle className="w-5 h-5" />
                <span>You had a chat session yesterday</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <TrendingUp className="w-5 h-5" />
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
    <form action="/api/mood" method="POST" className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">How are you feeling today?</label>
        <input type="range" name="mood" min="1" max="10" defaultValue="7" className="w-full" />
        <div className="flex justify-between text-sm text-gray-500">
          <span>Struggling</span>
          <span>Great</span>
        </div>
      </div>
      <textarea
        name="note"
        placeholder="Add a note about how you're feeling..."
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        rows={3}
      />
      <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
        Save Check-in
      </button>
    </form>
  );
}
