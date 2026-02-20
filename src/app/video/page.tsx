'use client';

import { useState, useEffect, useRef } from 'react';
import { Video, VideoOff, Mic, MicOff, PhoneOff, Copy, Check, ArrowLeft, AlertCircle } from 'lucide-react';
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

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<Peer | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    initPeer();
    return () => {
      if (peerRef.current) {
        peerRef.current.destroy();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
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
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      setStatus('Connecting to server...');
      
      const peer = new Peer({
        debug: 2
      });

      peer.on('open', (id) => {
        console.log('Peer connected with ID:', id);
        setPeerId(id);
        setStatus('Ready to connect');
      });

      peer.on('call', (call) => {
        console.log('Incoming call:', call);
        call.answer(stream);
        call.on('stream', (remoteStream) => {
          console.log('Received remote stream');
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
          setInCall(true);
        });
        call.on('error', (err) => {
          console.error('Call error:', err);
          setError('Call failed');
        });
      });

      peer.on('error', (err) => {
        console.error('Peer error:', err);
        setError('Connection failed. Please refresh and try again.');
        setStatus('Error');
      });

      peerRef.current = peer;
    } catch (err: any) {
      console.error('Media error:', err);
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
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
      setInCall(true);
      setStatus('Connected');
    });

    call.on('error', (err) => {
      console.error('Call error:', err);
      setError('Call failed. Check the ID and try again.');
      setStatus('Error');
    });

    setTimeout(() => {
      if (!inCall) {
        setStatus('Ready to connect');
      }
    }, 10000);
  };

  const endCall = () => {
    setInCall(false);
    setTargetId('');
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    setStatus('Ready to connect');
  };

  const toggleMute = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOn(!isVideoOn);
    }
  };

  const copyId = () => {
    navigator.clipboard.writeText(peerId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white">
      <header className="bg-[#16213e] border-b border-gray-800 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 hover:bg-white/10 rounded-lg transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-semibold">Video Session</h1>
          </div>
          <span className={`text-sm ${status === 'Error' ? 'text-red-400' : 'text-gray-400'}`}>
            {status}
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="relative bg-[#16213e] rounded-xl overflow-hidden aspect-video shadow-[8px_8px_16px_#0f1425,-8px_-8px_16px_#1e2a4a]">
            <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
            <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-sm">You</div>
            {!isVideoOn && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#0f1425]">
                <VideoOff className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>

          <div className="relative bg-[#16213e] rounded-xl overflow-hidden aspect-video shadow-[8px_8px_16px_#0f1425,-8px_-8px_16px_#1e2a4a]">
            {inCall ? (
              <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-400">Waiting for connection...</p>
              </div>
            )}
          </div>
        </div>

        {!inCall && (
          <div className="bg-[#16213e] rounded-xl p-5 mb-4 shadow-[8px_8px_16px_#0f1425,-8px_-8px_16px_#1e2a4a]">
            <h3 className="font-medium mb-4 text-white">Start a Call</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={peerId}
                  readOnly
                  placeholder="Your ID (copy and share)"
                  className="flex-1 bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
                />
                <button
                  onClick={copyId}
                  className="p-2 bg-[#1a1a2e] border border-gray-700 rounded-lg hover:bg-[#0f1425] transition"
                >
                  {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  placeholder="Enter friend's ID to call"
                  className="flex-1 bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
                />
                <button
                  onClick={startCall}
                  disabled={!targetId || !peerId || status === 'Error'}
                  className="px-4 py-2 bg-gradient-to-r from-[#e94560] to-[#0f3460] rounded-lg hover:shadow-lg hover:shadow-[#e94560]/30 disabled:opacity-50 transition"
                >
                  Call
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center gap-4">
          <button
            onClick={toggleMute}
            className={`p-4 rounded-full ${isMuted ? 'bg-red-500' : 'bg-[#16213e]'} hover:shadow-lg transition`}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
          
          <button
            onClick={toggleVideo}
            className={`p-4 rounded-full ${!isVideoOn ? 'bg-red-500' : 'bg-[#16213e]'} hover:shadow-lg transition`}
          >
            {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
          </button>
          
          {inCall && (
            <button
              onClick={endCall}
              className="p-4 rounded-full bg-red-500 hover:bg-red-600 transition"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
