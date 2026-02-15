# 🧠 MindWell AI - Complete Development Guide

> **Project:** AI-Powered Mental Health Support Platform  
> **Developer:** Aviral Gupta (B.Tech CS-AIML Student)  
> **Started:** February 15, 2026  
> **Status:** Starting Fresh

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Why We Use Each Technology](#why-we-use-each-technology)
5. [How Video Calls Work](#how-video-calls-work)
6. [How Real-Time Chat Works](#how-real-time-chat-works)
7. [How AI Integration Works](#how-ai-integration-works)
8. [Database Schema](#database-schema)
9. [Project Structure](#project-structure)
10. [Phase-by-Phase Roadmap](#phase-by-phase-roadmap)
11. [Commands Reference](#commands-reference)
12. [Environment Variables](#environment-variables)
13. [Troubleshooting](#troubleshooting)

---

## Project Overview

### What is MindWell AI?

MindWell AI is an AI-powered mental health support platform that provides:
- 🤖 **AI Chat** - Text-based emotional support
- 📹 **Video Sessions** - Face-to-face AI conversations
- 📊 **Mood Tracking** - Daily mood monitoring
- 📓 **AI Journaling** - AI-analyzed journal entries
- 🧘 **Meditation** - Guided AI meditation

### Problem It Solves

| Problem | Solution |
|---------|----------|
| Expensive therapy | Free AI support 24/7 |
| No one to talk to | AI companion always available |
| Hard to track emotions | Daily mood tracking |
| No privacy concerns | Anonymous support option |

---

## Features

### Core Features (Must Build)

| Feature | Technology | Description |
|---------|------------|-------------|
| AI Chat | Gemini API | Text conversation with AI |
| Video Sessions | WebRTC | Face-to-face calls |
| Mood Tracking | MongoDB | Track emotions |
| User Auth | BetterAuth | Login/Signup |
| Journal | Gemini API | AI-analyzed entries |

### Advanced Features (Nice to Have)

| Feature | Description |
|---------|-------------|
| Crisis Detection | Alert system for distress |
| Progress Analytics | Visual improvement charts |
| Meditation | Guided relaxation |
| Community | Anonymous peer support |

---

## Technology Stack

### Complete Stack

| Technology | Purpose | Free? |
|------------|---------|-------|
| **Next.js 15** | Framework | ✅ |
| **React 19** | UI Library | ✅ |
| **TypeScript** | Language | ✅ |
| **MongoDB Atlas** | Database | ✅ (512MB) |
| **Mongoose** | ORM | ✅ |
| **Gemini API** | AI | ✅ (15/min) |
| **Socket.io** | WebSockets | ✅ |
| **PeerJS** | WebRTC | ✅ |
| **BetterAuth** | Auth | ✅ |
| **Tailwind CSS** | Styling | ✅ |
| **Zod** | Validation | ✅ |

---

## Why We Use Each Technology

### 1. Next.js 15

**What it does:** Full-stack framework for React

**Why we use it:**
- Frontend + Backend in one project
- Industry standard (most React jobs)
- Easy deployment to Vercel
- Great for SEO

### 2. React 19

**What it does:** UI library for building interfaces

**Why we use it:**
- Most popular frontend library
- Component-based (reusable code)
- Large community and tutorials
- Job demand

### 3. TypeScript

**What it does:** JavaScript with type safety

**Why we use it:**
- Catches bugs before running
- Better autocomplete
- Industry standard

### 4. MongoDB Atlas

**What it does:** Cloud database

**Why we use it:**
- Free tier (512MB)
- Flexible (NoSQL)
- Part of MERN stack
- Easy to learn

### 5. Gemini API

**What it does:** Google's AI for generating responses

**Why we use it:**
- Free tier available
- Good for conversations
- Fast responses

### 6. Socket.io

**What it does:** Real-time bidirectional communication

**Why we use it:**
- Enables instant messaging
- WebSocket abstraction
- Free and open-source

### 7. PeerJS

**What it does:** WebRTC made simple

**Why we use it:**
- Simplifies video calls
- Free STUN/TURN servers
- Easy to implement

### 8. BetterAuth

**What it does:** Authentication solution

**Why we use it:**
- TypeScript-first
- Built-in security
- Easy setup

---

## How Video Calls Work

### What is WebRTC?

**WebRTC** = Web Real-Time Communication

It enables direct video/audio communication between browsers without plugins!

### Step-by-Step Process

```
┌─────────────────────────────────────────────────────────────────┐
│                    VIDEO CALL FLOW                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. PERMISSION                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  navigator.mediaDevices.getUserMedia({                 │   │
│  │    video: true,                                        │   │
│  │    audio: true                                         │   │
│  │  })                                                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│  │                                                           │
│  │  Browser asks: "Allow camera and microphone?"           │
│  │                                                           │
│  ▼                                                           │
│                                                                  │
│  2. CREATE STREAM                                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  const stream = await getUserMedia(...)               │   │
│  │                                                           │
│  │  stream now contains:                                   │
│  │  ├── Video track (camera)                              │
│  │  └── Audio track (microphone)                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           │                                     │
│                           ▼                                     │
│                                                                  │
│  3. PEER CONNECTION                                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  const peer = new Peer();                              │   │
│  │                                                           │
│  │  peer.on('call', (call) => {                          │   │
│  │    call.answer(stream);  // Answer with our stream   │   │
│  │    call.on('stream', (remoteStream) => {              │   │
│  │      // Show remote video                             │   │
│  │    });                                                 │   │
│  │  });                                                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           │                                     │
│                           ▼                                     │
│                                                                  │
│  4. VIDEO ELEMENTS                                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  <video srcObject={localStream} autoplay />           │   │
│  │  <video srcObject={remoteStream} autoplay />          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Key Terms

| Term | Meaning |
|------|---------|
| **STUN Server** | Helps find your public IP address |
| **ICE Candidate** | Network path options for connection |
| **Peer** | Each user in a video call |
| **Stream** | Combined video + audio data |

### Free STUN Servers We Can Use

```javascript
const iceServers = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' }
];
```

---

## How Real-Time Chat Works

### What are WebSockets?

**WebSockets** = Real-time, bidirectional communication

Unlike HTTP (request-response), WebSockets allow continuous connection!

### How Socket.io Works

```
┌─────────────────────────────────────────────────────────────────┐
│                    SOCKET.IO FLOW                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  CLIENT                                                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  const socket = io('http://localhost:3000');           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           │                                     │
│                           ▼                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  // Send message                                        │   │
│  │  socket.emit('message', 'Hello AI!');                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           │                                     │
│                           ▼                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  SERVER                                                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  io.on('connection', (socket) => {                    │   │
│  │                                                           │   │
│  │    socket.on('message', (msg) => {                    │   │
│  │      // Process message                                 │   │
│  │      // Get AI response                                 │   │
│  │      socket.emit('message', aiResponse);              │   │
│  │    });                                                  │   │
│  │                                                           │   │
│  │  });                                                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           │                                     │
│                           ▼                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  // Client receives                                      │   │
│  │  socket.on('message', (response) => {                 │   │
│  │    console.log(response);  // AI response!            │   │
│  │  });                                                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Socket.io Events

| Event | When |
|-------|------|
| `connection` | User connects |
| `disconnect` | User disconnects |
| `message` | Send/receive messages |
| `typing` | User is typing |
| `video-signal` | WebRTC signaling |

---

## How AI Integration Works

### Gemini API Integration

```
┌─────────────────────────────────────────────────────────────────┐
│                    AI CHAT FLOW                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  USER                                                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  "I'm feeling stressed today"                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           │                                     │
│                           ▼                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  // Send to API                                         │   │
│  │  fetch('/api/chat', {                                  │   │
│  │    method: 'POST',                                     │   │
│  │    body: JSON.stringify({ message: userMessage })     │   │
│  │  })                                                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           │                                     │
│                           ▼                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  // Backend processes                                   │   │
│  │  const prompt = `                                      │   │
│  │    You are a compassionate mental health support AI.  │   │
│  │    The user says: "${userMessage}".                  │   │
│  │    Respond with empathy and helpful advice.           │   │
│  │  `;                                                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           │                                     │
│                           ▼                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  // Call Gemini API                                     │   │
│  │  const result = await model.generateContent(prompt);   │   │
│  │  const response = result.response.text();              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           │                                     │
│                           ▼                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  // Response back to user                                │   │
│  │  "I understand. Feeling stressed is normal. Here are   │   │
│  │  some techniques that might help..."                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Sample Prompt

```typescript
const systemPrompt = `You are MindWell, a compassionate AI mental health 
support companion. Your role is to:

1. Listen empathetically to the user
2. Provide emotional support
3. Offer practical coping strategies
4. Encourage professional help when needed
5. Never diagnose or prescribe medication
6. Maintain a warm, understanding tone

Remember: You're not a replacement for professional therapy. 
Always encourage users to seek professional help for serious concerns.`;
```

---

## Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  email: String,
  name: String,
  image: String,
  createdAt: Date,
  preferences: {
    theme: String,
    notifications: Boolean
  }
}
```

### Sessions Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  type: 'chat' | 'video',
  startedAt: Date,
  endedAt: Date,
  transcript: [{
    role: 'user' | 'ai',
    message: String,
    timestamp: Date
  }],
  feedback: {
    rating: Number,
    comment: String
  }
}
```

### Moods Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  mood: Number (1-10),
  emotions: [String],
  notes: String,
  date: Date
}
```

### Journals Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  content: String,
  aiAnalysis: {
    sentiment: String,
    themes: [String],
    suggestions: [String]
  },
  createdAt: Date
}
```

---

## Project Structure

```
mindwell-ai/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Home (/)
│   │   ├── layout.tsx         # Root layout
│   │   ├── globals.css        # Global styles
│   │   ├── chat/
│   │   │   └── page.tsx      # Chat page
│   │   ├── video/
│   │   │   └── page.tsx      # Video session
│   │   ├── journal/
│   │   │   └── page.tsx      # Journal page
│   │   ├── dashboard/
│   │   │   └── page.tsx      # User dashboard
│   │   └── api/
│   │       ├── chat/
│   │       │   └── route.ts  # Chat API
│   │       ├── mood/
│   │       │   └── route.ts   # Mood API
│   │       └── auth/          # Auth routes
│   │
│   ├── components/            # React components
│   │   ├── Chat/
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── Message.tsx
│   │   │   └── TypingIndicator.tsx
│   │   ├── Video/
│   │   │   ├── VideoCall.tsx
│   │   │   ├── LocalVideo.tsx
│   │   │   └── RemoteVideo.tsx
│   │   ├── Journal/
│   │   │   ├── Entry.tsx
│   │   │   └── Analysis.tsx
│   │   ├── Mood/
│   │   │   ├── Tracker.tsx
│   │   │   └── Chart.tsx
│   │   └── UI/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       └── Navbar.tsx
│   │
│   ├── lib/                  # Utilities
│   │   ├── db.ts             # MongoDB connection
│   │   ├── auth.ts           # BetterAuth config
│   │   ├── ai.ts             # Gemini API
│   │   └── socket.ts         # Socket.io client
│   │
│   ├── models/               # Mongoose models
│   │   ├── User.ts
│   │   ├── Session.ts
│   │   ├── Mood.ts
│   │   └── Journal.ts
│   │
│   └── types/               # TypeScript types
│       └── index.ts
│
├── public/                   # Static files
├── .env                     # Environment variables
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

---

## Phase-by-Phase Roadmap

### Phase 1: Foundation (Week 1)

**Goal:** Set up project and basics

| Task | Description |
|------|-------------|
| 1.1 | Install dependencies |
| 1.2 | Set up MongoDB Atlas |
| 1.3 | Configure BetterAuth |
| 1.4 | Create project structure |
| 1.5 | Set up environment variables |

### Phase 2: Frontend (Week 2)

**Goal:** Build user interface

| Task | Description |
|------|-------------|
| 2.1 | Build layout and navigation |
| 2.2 | Create home page |
| 2.3 | Build chat interface |
| 2.4 | Build video call interface |
| 2.5 | Build journal page |

### Phase 3: Backend (Week 3)

**Goal:** Connect database and APIs

| Task | Description |
|------|-------------|
| 3.1 | Create Mongoose models |
| 3.2 | Build API routes |
| 3.3 | Connect MongoDB |
| 3.4 | Test API endpoints |

### Phase 4: AI Integration (Week 4)

**Goal:** Add AI features

| Task | Description |
|------|-------------|
| 4.1 | Set up Gemini API |
| 4.2 | Build chat logic |
| 4.3 | Build journal analysis |
| 4.4 | Handle AI responses |

### Phase 5: Real-Time Features (Week 5)

**Goal:** Add WebSocket and WebRTC

| Task | Description |
|------|-------------|
| 5.1 | Set up Socket.io |
| 5.2 | Implement chat |
| 5.3 | Set up PeerJS |
| 5.4 | Implement video calls |

### Phase 6: Features (Week 6)

**Goal:** Complete all features

| Task | Description |
|------|-------------|
| 6.1 | Mood tracking |
| 6.2 | User dashboard |
| 6.3 | Session history |
| 6.4 | Polish UI |

### Phase 7: Testing (Week 7)

**Goal:** Ensure quality

| Task | Description |
|------|-------------|
| 7.1 | Write unit tests |
| 7.2 | Write E2E tests |
| 7.3 | Fix bugs |
| 7.4 | Optimize performance |

### Phase 8: Deployment (Week 8)

**Goal:** Launch app

| Task | Description |
|------|-------------|
| 8.1 | Deploy to Vercel |
| 8.2 | Deploy backend |
| 8.3 | Configure domain |
| 8.4 | Launch! |

---

## Commands Reference

### Git Commands

```bash
# Check status
git status

# Add files
git add .
git add filename.ts

# Commit
git commit -m "message"

# Create branch
git checkout -b branch-name

# Switch branch
git checkout branch-name

# Merge branch
git merge branch-name

# Push to GitHub
git push origin main

# Pull from GitHub
git pull origin main
```

### NPM Commands

```bash
# Install packages
npm install

# Install specific package
npm install package-name

# Run development
npm run dev

# Build for production
npm run build

# Start production
npm start

# Run tests
npm run test
```

---

## Environment Variables

Create `.env` file:

```env
# Authentication
BETTER_AUTH_SECRET=your-secret-key-min-32-chars
BETTER_AUTH_URL=http://localhost:3000

# OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mindwell

# AI
GEMINI_API_KEY=your-gemini-api-key

# Socket.io
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

---

## Troubleshooting

### Common Issues

| Error | Solution |
|-------|----------|
| npm not found | Restart terminal |
| MongoDB connection failed | Check connection string |
| Camera not working | Check browser permissions |
| WebRTC not connecting | Check firewall settings |
| GitHub push rejected | Pull first, then push |

---

## Progress Tracker

| Phase | Status |
|-------|--------|
| Phase 1: Foundation | ⬜ |
| Phase 2: Frontend | ⬜ |
| Phase 3: Backend | ⬜ |
| Phase 4: AI Integration | ⬜ |
| Phase 5: Real-Time | ⬜ |
| Phase 6: Features | ⬜ |
| Phase 7: Testing | ⬜ |
| Phase 8: Deployment | ⬜ |

---

## Resources

### Official Docs
- [Next.js](https://nextjs.org/docs)
- [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [MongoDB](https://www.mongodb.com/docs)
- [Gemini API](https://ai.google.dev/docs)
- [Socket.io](https://socket.io/docs)
- [PeerJS](https://peerjs.com/docs)
- [BetterAuth](https://www.better-auth.com)

### Learning
- [freeCodeCamp](https://freecodecamp.org)
- [The Odin Project](https://theodinproject.com)

---

*Last Updated: February 15, 2026*
*Project: MindWell AI*
*Developer: Aviral Gupta*
