import Link from 'next/link';
import { Brain, Video, Heart, MessageCircle, ArrowRight, Sparkles, Shield, Users } from 'lucide-react';

export default function Home() {
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
          <nav className="flex items-center gap-6">
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition duration-300">Dashboard</Link>
            <Link href="/chat" className="text-gray-400 hover:text-white transition duration-300">Chat</Link>
            <Link href="/sign-in" className="px-5 py-2 text-gray-300 hover:text-white transition duration-300">Sign In</Link>
            <Link href="/sign-up" className="px-5 py-2 bg-gradient-to-r from-[#e94560] to-[#0f3460] text-white rounded-lg hover:shadow-lg hover:shadow-[#e94560]/30 transition duration-300">
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="max-w-6xl mx-auto px-6 py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-[#16213e] px-5 py-2 rounded-full mb-8 shadow-inner">
            <Sparkles className="w-4 h-4 text-[#e94560]" />
            <span className="text-gray-400 text-sm">AI-Powered Mental Wellness</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Find Peace of Mind<br />
            <span className="bg-gradient-to-r from-[#e94560] to-[#ff6b6b] bg-clip-text text-transparent">With AI Support</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Your personal mental wellness companion. Track moods, chat with AI, and connect through secure video sessions.
          </p>
          <div className="flex gap-5 justify-center flex-wrap">
            <Link href="/sign-up" className="px-8 py-4 bg-gradient-to-r from-[#e94560] to-[#0f3460] text-white rounded-xl text-lg hover:shadow-xl hover:shadow-[#e94560]/30 transition duration-300 flex items-center gap-2 font-semibold">
              Start Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/chat" className="px-8 py-4 bg-[#16213e] border border-gray-700 text-white rounded-xl text-lg hover:bg-[#1a1a2e] hover:border-gray-600 transition duration-300">
              Try AI Chat
            </Link>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#16213e] p-8 rounded-2xl shadow-[8px_8px_16px_#0f1425,-8px_-8px_16px_#1e2a4a]">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#e94560] to-[#ff6b6b] flex items-center justify-center mb-5 shadow-lg">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI Chat Support</h3>
              <p className="text-gray-400">Chat with a compassionate AI that listens without judgment and provides thoughtful emotional support.</p>
            </div>

            <div className="bg-[#16213e] p-8 rounded-2xl shadow-[8px_8px_16px_#0f1425,-8px_-8px_16px_#1e2a4a]">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0f3460] to-[#16213e] flex items-center justify-center mb-5 shadow-lg border border-gray-700">
                <Heart className="w-7 h-7 text-[#e94560]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Mood Tracking</h3>
              <p className="text-gray-400">Track daily moods with simple check-ins and discover patterns in your emotional wellbeing over time.</p>
            </div>

            <div className="bg-[#16213e] p-8 rounded-2xl shadow-[8px_8px_16px_#0f1425,-8px_-8px_16px_#1e2a4a]">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#533483] to-[#0f3460] flex items-center justify-center mb-5 shadow-lg">
                <Video className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Video Sessions</h3>
              <p className="text-gray-400">Connect face-to-face through secure, private video calls for more personal support when you need it.</p>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#16213e] p-6 rounded-xl shadow-[5px_5px_10px_#0f1425,-5px_-5px_10px_#1e2a4a] flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#e94560] to-[#0f3460] flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-white font-semibold">Private & Secure</h4>
                <p className="text-gray-500 text-sm">Your data stays confidential</p>
              </div>
            </div>
            <div className="bg-[#16213e] p-6 rounded-xl shadow-[5px_5px_10px_#0f1425,-5px_-5px_10px_#1e2a4a] flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#533483] to-[#0f3460] flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-white font-semibold">24/7 Available</h4>
                <p className="text-gray-500 text-sm">Support whenever you need</p>
              </div>
            </div>
            <div className="bg-[#16213e] p-6 rounded-xl shadow-[5px_5px_10px_#0f1425,-5px_-5px_10px_#1e2a4a] flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#0f3460] to-[#16213e] flex items-center justify-center border border-gray-700">
                <Brain className="w-6 h-6 text-[#e94560]" />
              </div>
              <div>
                <h4 className="text-white font-semibold">Smart AI</h4>
                <p className="text-gray-500 text-sm">Personalized conversations</p>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Take Control of Your Mental Wellness
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
            Join thousands who have found a safe, supportive space to express themselves and grow.
          </p>
          <Link href="/sign-up" className="inline-block px-10 py-4 bg-gradient-to-r from-[#e94560] to-[#0f3460] text-white rounded-xl text-lg hover:shadow-xl hover:shadow-[#e94560]/30 transition duration-300 font-bold">
            Create Your Free Account
          </Link>
        </section>
      </main>

      <footer className="bg-[#0f1425] border-t border-gray-800 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-500">© 2026 MindWell AI. All rights reserved.</p>
          <p className="mt-2 text-sm text-gray-600">MindWell AI is not a substitute for professional medical advice.</p>
        </div>
      </footer>
    </div>
  );
}
