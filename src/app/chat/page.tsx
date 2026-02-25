'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Menu, Home, MessageCircle, Video, Brain, LogOut } from 'lucide-react';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hey! I'm MindWell, your AI companion. How are you feeling today? I'm here to listen and support you." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setError('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history }),
      });

      const data = await response.json();

      const aiMessage = data.response || data.message || data;
      if (aiMessage) {
        const messageContent = typeof aiMessage === 'string' ? aiMessage : aiMessage.content || JSON.stringify(aiMessage);
        setMessages(prev => [...prev, { role: 'assistant', content: messageContent }]);
      } else if (data.error) {
        setError(data.error);
        setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I encountered an error. Please try again." }]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setError('Failed to connect. Please check your internet connection.');
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting right now. Please try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/chat', label: 'AI Chat', icon: MessageCircle },
    { href: '/video', label: 'Video Session', icon: Video },
    { href: '/ai-session', label: 'AI Session', icon: Brain },
  ];

  return (
    <div className="h-screen flex flex-col">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 border-r border-zinc-800 transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="flex flex-col h-full p-5">
          <div className="flex items-center gap-3 mb-10 px-1">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold text-black">M</span>
            </div>
            <span className="text-xl font-bold text-green-500">MindWell</span>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === '/chat';
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

          <div className="border-t border-zinc-800 pt-4">
            <button
              onClick={() => {
                fetch('/api/auth/sign-out', { method: 'POST' }).then(() => {
                  window.location.href = '/';
                });
              }}
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
        <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col md:pl-64 min-h-0">
        {/* Header */}
        <header className="shrink-0 border-b border-zinc-800 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 hover:bg-zinc-800 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center justify-center">
            <Bot className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h1 className="font-semibold">MindWell AI</h1>
            <p className="text-xs text-zinc-500">Always here to listen</p>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.role === 'assistant' && (
                <div className="w-9 h-9 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-green-500" />
                </div>
              )}
              <div className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-green-500 text-black'
                  : 'bg-zinc-900 border border-zinc-800'
              }`}>
                <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
              </div>
              {message.role === 'user' && (
                <div className="w-9 h-9 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-zinc-400" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-9 h-9 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-green-500" />
              </div>
              <div className="bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-2xl">
                <Loader2 className="w-5 h-5 text-green-500 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="shrink-0 border-t border-zinc-800 p-4">
          <form onSubmit={handleSubmit} className="flex gap-3 max-w-4xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Share your thoughts..."
              className="flex-1 px-5 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-white placeholder-zinc-500 focus:outline-none focus:border-green-500 transition-colors"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-3 bg-green-500 text-black rounded-2xl hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          {error && (
            <p className="text-red-400 text-sm text-center mt-2">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
