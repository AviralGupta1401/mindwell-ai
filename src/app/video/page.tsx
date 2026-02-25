'use client';

import { useState, useEffect, useRef } from 'react';
import { Video, VideoOff, Mic, MicOff, PhoneOff, Copy, Check, AlertCircle, Home, MessageCircle, Brain, LogOut, Menu } from 'lucide-react';
import Peer from 'peerjs';
import Link from 'next/link';

export default function VideoPage() {
  const [peerId, setPeerId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [inCall, setInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState('Initializing...');
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<Peer | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    initPeer();
    return () => {
      if (peerRef.current) peerRef.current.destroy();
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    };
  }, []);

  const initPeer = async () => {
    setStatus('Requesting camera access...');
    setError('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: true
      });
      streamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      setStatus('Connecting to server...');
      const peer = new Peer({ debug: 2 });

      peer.on('open', (id) => {
        setPeerId(id);
        setStatus('Ready to connect');
      });

      peer.on('call', (call) => {
        call.answer(stream);
        call.on('stream', (remoteStream) => {
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
          setInCall(true);
        });
        call.on('error', () => setError('Call failed'));
      });

      peer.on('error', () => {
        setError('Connection failed. Please refresh and try again.');
        setStatus('Error');
      });

      peerRef.current = peer;
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        setError('Camera/mic access denied. Please allow permissions and try again.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera or microphone found. Please connect a device.');
      } else {
        setError('Failed to access camera/microphone.');
      }
      setStatus('Error');
    }
  };

  const startCall = () => {
    if (!peerRef.current || !targetId || !streamRef.current) return;
    setStatus('Calling...');
    const call = peerRef.current.call(targetId, streamRef.current);
    call.on('stream', (remoteStream) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
      setInCall(true);
      setStatus('Connected');
    });
    call.on('error', () => {
      setError('Call failed. Check the ID and try again.');
      setStatus('Error');
    });
    setTimeout(() => { if (!inCall) setStatus('Ready to connect'); }, 10000);
  };

  const endCall = () => {
    setInCall(false);
    setTargetId('');
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    setStatus('Ready to connect');
  };

  const toggleMute = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(t => { t.enabled = !t.enabled; });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(t => { t.enabled = !t.enabled; });
      setIsVideoOn(!isVideoOn);
    }
  };

  const copyId = () => {
    navigator.clipboard.writeText(peerId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/chat', label: 'AI Chat', icon: MessageCircle },
    { href: '/video', label: 'Video Session', icon: Video },
    { href: '/ai-session', label: 'AI Session', icon: Brain },
  ];

  return (
    <div className="min-h-screen">
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
              const isActive = item.href === '/video';
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
      <div className="md:pl-64">
        {/* Header */}
        <header className="border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-zinc-800 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="font-semibold text-lg">Video Session</h1>
          </div>
          <span className={`text-sm ${status === 'Error' ? 'text-red-400' : 'text-zinc-400'}`}>
            {status}
          </span>
        </header>

        <div className="p-4 md:p-8 max-w-4xl mx-auto">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Video grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden aspect-video">
              <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
              <div className="absolute bottom-3 left-3 bg-black/60 px-3 py-1.5 rounded-lg text-sm font-medium">You</div>
              {!isVideoOn && (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                  <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center">
                    <VideoOff className="w-10 h-10 text-zinc-500" />
                  </div>
                </div>
              )}
            </div>

            <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden aspect-video">
              {inCall ? (
                <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Video className="w-8 h-8 text-zinc-500" />
                    </div>
                    <p className="text-zinc-500">Waiting for connection...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Call controls */}
          {!inCall && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
              <h3 className="font-medium mb-4">Start a call</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={peerId}
                    readOnly
                    placeholder="Your ID (copy and share)"
                    className="flex-1 bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm placeholder-zinc-500"
                  />
                  <button
                    onClick={copyId}
                    className="p-3 bg-zinc-800 border border-zinc-700 rounded-xl hover:border-green-500 transition-colors"
                  >
                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-zinc-400" />}
                  </button>
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={targetId}
                    onChange={(e) => setTargetId(e.target.value)}
                    placeholder="Enter friend's ID to call"
                    className="flex-1 bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm placeholder-zinc-500 focus:outline-none focus:border-green-500 transition-colors"
                  />
                  <button
                    onClick={startCall}
                    disabled={!targetId || !peerId || status === 'Error'}
                    className="px-6 py-3 bg-green-500 text-black font-semibold rounded-xl hover:bg-green-400 disabled:opacity-50 transition-colors"
                  >
                    Call
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Media controls */}
          <div className="flex justify-center gap-4">
            <button
              onClick={toggleMute}
              className={`p-4 rounded-2xl transition-colors ${isMuted ? 'bg-red-500 text-white' : 'bg-zinc-800 border border-zinc-700 hover:border-green-500'}`}
            >
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>
            <button
              onClick={toggleVideo}
              className={`p-4 rounded-2xl transition-colors ${!isVideoOn ? 'bg-red-500 text-white' : 'bg-zinc-800 border border-zinc-700 hover:border-green-500'}`}
            >
              {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </button>
            {inCall && (
              <button onClick={endCall} className="p-4 rounded-2xl bg-red-500 hover:bg-red-600 transition-colors">
                <PhoneOff className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
