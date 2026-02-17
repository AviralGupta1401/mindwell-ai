'use client';

import { useState, useEffect, useRef } from 'react';
import { Video, VideoOff, Mic, MicOff, PhoneOff, Copy, Check } from 'lucide-react';
import { Peer } from 'peerjs';

export default function VideoPage() {
  const [peerId, setPeerId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [inCall, setInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState('Initializing...');

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<Peer | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    initPeer();
    return () => {
      peerRef.current?.destroy();
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const initPeer = async () => {
    setStatus('Getting media...');
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      setStatus('Connecting to network...');
      const peer = new Peer();
      
      peer.on('open', (id) => {
        setPeerId(id);
        setStatus('Ready to connect');
      });

      peer.on('call', (call) => {
        call.answer(stream);
        call.on('stream', (remoteStream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
          setInCall(true);
        });
      });

      peerRef.current = peer;
    } catch (err) {
      setStatus('Error accessing camera/mic');
      console.error(err);
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
    });

    call.on('close', () => {
      setInCall(false);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
    });
  };

  const endCall = () => {
    setInCall(false);
    setTargetId('');
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
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
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="font-semibold">Video Session</h1>
          <span className="text-sm text-gray-400">{status}</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="relative bg-gray-800 rounded-xl overflow-hidden aspect-video">
            <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
            <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-sm">You</div>
            {!isVideoOn && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
                <VideoOff className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>

          <div className="relative bg-gray-800 rounded-xl overflow-hidden aspect-video">
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
          <div className="bg-gray-800 rounded-xl p-4 mb-4">
            <h3 className="font-medium mb-3">Start a Call</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={peerId}
                  readOnly
                  placeholder="Your ID (copy and share)"
                  className="flex-1 bg-gray-700 border-none rounded-lg px-3 py-2 text-sm"
                />
                <button
                  onClick={copyId}
                  className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
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
                  className="flex-1 bg-gray-700 border-none rounded-lg px-3 py-2 text-sm"
                />
                <button
                  onClick={startCall}
                  disabled={!targetId || !peerId}
                  className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
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
            className={`p-4 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-700'} hover:opacity-80 transition`}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
          
          <button
            onClick={toggleVideo}
            className={`p-4 rounded-full ${!isVideoOn ? 'bg-red-500' : 'bg-gray-700'} hover:opacity-80 transition`}
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
