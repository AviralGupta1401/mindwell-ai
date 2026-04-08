# MindWell AI

AI-powered mental wellness companion with chat, mood tracking, video sessions, and emotion-aware AI therapy.

## Features

- **AI Chat** - Text-based conversation with a compassionate AI therapist (Google Gemini)
- **Mood Tracking** - Daily mood check-ins (1-10 scale) with notes and history
- **AI Therapy Session** - Face-to-face video session with real-time facial emotion detection + voice analysis
- **Video Calls** - Peer-to-peer video calling between users (WebRTC/PeerJS)
- **Authentication** - Secure email/password auth with 30-day sessions
 
## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, Vite, TypeScript, Tailwind CSS v4, React Router v7 |
| **Backend** | Node.js, Express.js, TypeScript, Socket.IO |
| **Database** | MongoDB Atlas, Mongoose |
| **Auth** | better-auth (session-based, HttpOnly cookies) |
| **AI** | Google Gemini 2.5 Flash |
| **Client-Side ML** | face-api.js (emotion detection), Web Speech API, Web Audio API |
| **Video** | PeerJS (WebRTC) |

## Project Structure

``` 
mindwell-ai/
├── server/          # Express.js backend (port 3001)
│   └── src/
│       ├── lib/     # auth, db, ai, ai-session
│       ├── routes/  # chat, mood, ai-session, auth
│       ├── models/  # Message, MoodEntry
│       └── types/
├── client/          # React + Vite frontend (port 5173)
│   └── src/
│       ├── pages/   # Home, SignIn, SignUp, Dashboard, Chat, Video, AISession
│       ├── hooks/   # useFaceDetection, useSpeechRecognition, useSpeechSynthesis, useVoiceAnalysis
│       ├── components/
│       └── lib/
└── .env             # Environment variables
```

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier)
- Google AI Studio API key (free tier)
- Chrome or Edge browser (for Speech Recognition)

### Setup

```bash
# Clone and install
git clone <repo-url>
cd mindwell-ai
npm run install:all

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI and Gemini API key

# Run development servers
npm run dev
```

Open http://localhost:5173 in your browser.

### Environment Variables

```
BETTER_AUTH_SECRET=<random-32-char-string>
MONGODB_URI=<mongodb-atlas-connection-string>
GEMINI_API_KEY=<google-ai-studio-api-key>
BETTER_AUTH_URL=http://localhost:3001
CLIENT_URL=http://localhost:5173
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/sign-up` | No | Create account |
| POST | `/api/auth/sign-in/email` | No | Log in |
| GET | `/api/auth/get-session` | Cookie | Get session |
| POST | `/api/chat` | No | AI chat message |
| GET | `/api/mood` | Cookie | Get mood history (last 30) |
| POST | `/api/mood` | Cookie | Save mood entry |
| POST | `/api/ai-session` | No | Emotion-aware AI response |

## Scripts

```bash
npm run dev           # Start both servers concurrently
npm run dev:server    # Start backend only
npm run dev:client    # Start frontend only
npm run build:server  # Build server (TypeScript → dist/)
npm run build:client  # Build client (Vite → dist/)
npm run install:all   # Install all dependencies
```

## License

Private project - not for redistribution.
