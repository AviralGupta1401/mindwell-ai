'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm MindWell, your AI companion. How are you feeling today? I'm here to listen and support you." }
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
      console.log('Response:', data);
      
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

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex flex-col">
      <header className="bg-[#16213e] shadow-lg px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link href="/" className="p-2 hover:bg-white/10 rounded-lg transition">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#e94560] to-[#0f3460] flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-white">MindWell AI</span>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full p-4 overflow-y-auto">
        <div className="space-y-4 pb-24">
          {messages.map((message, index) => (
            <div key={index} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#e94560] to-[#0f3460] flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              <div className={`max-w-[70%] p-4 rounded-2xl ${
                message.role === 'user' 
                  ? 'bg-gradient-to-r from-[#e94560] to-[#0f3460] text-white' 
                  : 'bg-[#16213e] text-gray-200 shadow-[4px_4px_8px_#0f1425,-4px_-4px_8px_#1e2a4a]'
              }`}>
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-gray-300" />
                </div>
              )}
            </div>
          ))}
          
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#e94560] to-[#0f3460] flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-[#16213e] p-4 rounded-2xl shadow-[4px_4px_8px_#0f1425,-4px_-4px_8px_#1e2a4a]">
                <Loader2 className="w-5 h-5 text-[#e94560] animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="bg-[#16213e] border-t border-gray-800 p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Share your thoughts..."
            className="flex-1 p-3 bg-[#1a1a2e] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#e94560] transition"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-3 bg-gradient-to-r from-[#e94560] to-[#0f3460] text-white rounded-xl hover:shadow-lg hover:shadow-[#e94560]/30 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        {error && (
          <p className="text-red-400 text-sm text-center mt-2">{error}</p>
        )}
      </footer>
    </div>
  );
}
