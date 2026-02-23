'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "hey! i'm mindwell, your AI companion. how are you feeling today? i'm here to listen and support you." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
        setMessages(prev => [...prev, { role: 'assistant', content: "i'm sorry, i encountered an error. please try again." }]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setError('Failed to connect. Please check your internet connection.');
      setMessages(prev => [...prev, { role: 'assistant', content: "i'm having trouble connecting right now. please try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0d0d0d]/80 backdrop-blur-md border-b border-[#1a1a1a]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 hover:bg-[#111] rounded-lg transition">
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <div className="w-8 h-8 rounded-lg bg-[#00ff88] flex items-center justify-center shadow-[0_0_15px_rgba(0,255,136,0.4)]">
              <Bot className="w-5 h-5 text-black" />
            </div>
            <span className="font-semibold text-white">mindwell AI</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full p-4 pt-20 overflow-y-auto">
        <div className="space-y-4 pb-28">
          {messages.map((message, index) => (
            <div key={index} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-[#00ff88] flex items-center justify-center flex-shrink-0 shadow-[0_0_10px_rgba(0,255,136,0.3)]">
                  <Bot className="w-5 h-5 text-black" />
                </div>
              )}
              <div className={`max-w-[70%] p-4 rounded-2xl ${
                message.role === 'user' 
                  ? 'bg-[#111] text-white border border-[#222]' 
                  : 'bg-[#111] text-[#ccc] border border-[#222]'
              }`}>
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 bg-[#222] rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-[#666]" />
                </div>
              )}
            </div>
          ))}
          
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#00ff88] flex items-center justify-center shadow-[0_0_10px_rgba(0,255,136,0.3)]">
                <Bot className="w-5 h-5 text-black" />
              </div>
              <div className="bg-[#111] p-4 rounded-2xl border border-[#222]">
                <Loader2 className="w-5 h-5 text-[#00ff88] animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-[#0d0d0d]/80 backdrop-blur-md border-t border-[#1a1a1a] p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="share your thoughts..."
            className="flex-1 p-3 bg-[#111] border border-[#222] rounded-xl text-white placeholder-[#444] focus:outline-none focus:border-[#00ff88] transition"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-3 bg-[#00ff88] text-black rounded-xl hover:shadow-[0_0_20px_rgba(0,255,136,0.5)] disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        {error && (
          <p className="text-[#ff6b6b] text-sm text-center mt-2">{error}</p>
        )}
      </footer>
    </div>
  );
}
