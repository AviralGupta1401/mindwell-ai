import Link from 'next/link';
import { Brain, Video, Heart, MessageCircle, ArrowRight, Star } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">MindWell AI</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-indigo-600 transition">Dashboard</Link>
            <Link href="/chat" className="text-gray-600 hover:text-indigo-600 transition">Chat</Link>
            <Link href="/api/auth/sign-in" className="px-4 py-2 text-gray-600 hover:text-indigo-600 transition">Sign In</Link>
            <Link href="/api/auth/sign-up" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">Get Started</Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="max-w-6xl mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Your AI-Powered Mental Health Companion
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get instant emotional support, track your mood, and connect with AI designed to help you feel better.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/api/auth/sign-up" className="px-6 py-3 bg-indigo-600 text-white rounded-lg text-lg hover:bg-indigo-700 transition flex items-center gap-2">
              Start Your Journey <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/chat" className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-lg text-lg hover:bg-indigo-50 transition">
              Try AI Chat
            </Link>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How MindWell Helps You</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Chat Support</h3>
              <p className="text-gray-600">Chat with a compassionate AI that listens without judgment and provides emotional support.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Mood Tracking</h3>
              <p className="text-gray-600">Track your daily mood with simple check-ins and visualize your emotional patterns over time.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Video className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Video Sessions</h3>
              <p className="text-gray-600">Connect with others through secure, private video calls for more personal support.</p>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-gray-600 mb-4">"The AI chat feels like talking to a understanding friend. It's helped me process my thoughts."</p>
              <p className="font-medium">- Sarah K.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-gray-600 mb-4">"Mood tracking has made me more aware of my emotional patterns. Great tool for self-improvement."</p>
              <p className="font-medium">- Michael R.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-gray-600 mb-4">"Finally, a mental health app that's accessible and non-judgmental. Highly recommend!"</p>
              <p className="font-medium">- Priya S.</p>
            </div>
          </div>
        </section>

        <section className="bg-indigo-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-indigo-100 mb-8 text-lg">Join thousands of users who have found a safe space to express themselves.</p>
            <Link href="/api/auth/sign-up" className="px-8 py-3 bg-white text-indigo-600 rounded-lg text-lg hover:bg-indigo-50 transition font-medium">
              Create Free Account
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>© 2026 MindWell AI. All rights reserved.</p>
          <p className="mt-2 text-sm">Remember: MindWell AI is not a substitute for professional medical advice.</p>
        </div>
      </footer>
    </div>
  );
}
