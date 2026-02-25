# MindWell AI — Complete Project Guide

> This document explains **everything** about the MindWell AI project from scratch.
> If you don't know what any technology is, how data moves, or what any file does — this guide covers it all.

---

## Table of Contents

1. [What is MindWell AI?](#1-what-is-mindwell-ai)
2. [Features Overview](#2-features-overview)
3. [Technology Stack — What, Why & Where](#3-technology-stack--what-why--where)
4. [Project File Structure](#4-project-file-structure)
5. [System Architecture Diagram](#5-system-architecture-diagram)
6. [Data Flow Diagrams (DFD)](#6-data-flow-diagrams-dfd)
7. [Database Design](#7-database-design)
8. [Authentication System](#8-authentication-system)
9. [Feature Deep Dives](#9-feature-deep-dives)
10. [API Reference](#10-api-reference)
11. [How to Run the Project](#11-how-to-run-the-project)
12. [Browser Compatibility](#12-browser-compatibility)

---

## 1. What is MindWell AI?

MindWell AI is a **web-based mental health support platform**. It provides:

- A **text chat** with an AI therapist that listens and responds empathetically
- A **face-to-face AI session** where the AI watches your facial expressions, listens to your voice tone, and gives emotionally-aware responses
- **Mood tracking** to log how you feel each day (1-10 scale)
- **Video calling** to connect with a real person (peer-to-peer)

Think of it as a private, free, 24/7 mental wellness companion that lives in your browser.

**Important:** MindWell AI is NOT a replacement for professional therapy. It's a supportive companion.

---

## 2. Features Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                        MindWell AI                               │
├──────────────┬──────────────┬──────────────┬─────────────────────┤
│   AI Chat    │  AI Session  │ Mood Tracker │   Video Call        │
│              │              │              │                     │
│ Text-based   │ Face-to-face │ Daily mood   │ Peer-to-peer        │
│ conversation │ with emotion │ logging with │ video calling       │
│ with AI      │ detection &  │ notes (1-10  │ between two         │
│ therapist    │ voice analysis│ scale)      │ users via WebRTC    │
└──────────────┴──────────────┴──────────────┴─────────────────────┘
```

| Feature | What It Does | Key Tech |
|---------|-------------|----------|
| **AI Chat** | Text conversation with AI companion | Gemini 2.5 Flash |
| **AI Session** | Video session where AI reads your face + voice | face-api.js + Web Speech API + Gemini |
| **Mood Tracker** | Log daily mood (1-10) with notes | MongoDB |
| **Video Call** | P2P video call with another person | PeerJS / WebRTC |
| **Auth** | Sign up / sign in with email & password | Better Auth + MongoDB |
| **Theme** | Dark / light mode toggle | React Context + localStorage |

---

## 3. Technology Stack — What, Why & Where

### 3.1 Next.js 16 (Framework)

**What is it?**
Next.js is a framework built on top of React. Think of React as the engine and Next.js as the full car — it adds routing (pages), server-side code (API routes), build optimization, and more.

**Why do we use it?**
- We can write both the **frontend** (what users see) and **backend** (API routes, server logic) in one project
- File-based routing — create a file at `src/app/chat/page.tsx` and it automatically becomes the `/chat` URL
- Built-in performance optimizations (code splitting, image optimization)
- Server and client components — some code runs on server (secure), some in browser (interactive)

**Where to get it?**
```bash
npx create-next-app@latest    # Creates a new Next.js project
```
Website: https://nextjs.org

---

### 3.2 React 19 (UI Library)

**What is it?**
React is a JavaScript library for building user interfaces. Instead of writing raw HTML, you write **components** — reusable pieces of UI like buttons, forms, and cards.

**Why do we use it?**
- Component-based — build UI from small, reusable pieces
- State management — when data changes, the UI updates automatically
- Huge ecosystem — thousands of libraries work with React
- Next.js is built on React, so it's included automatically

**Where to get it?**
Comes with Next.js. No separate installation needed.

Website: https://react.dev

---

### 3.3 TypeScript (Programming Language)

**What is it?**
TypeScript is JavaScript with **types**. Instead of `let name = "Alice"`, you write `let name: string = "Alice"`. This catches bugs before your code even runs.

**Why do we use it?**
- Catches errors at compile time (e.g., passing a number where a string is expected)
- Better IDE support — autocomplete, refactoring, jump-to-definition
- Self-documenting — types tell you what shape data should be
- Industry standard for professional projects

**Example from our project:**
```typescript
// src/types/ai-session.ts
export interface EmotionSnapshot {
  dominant: FacialExpression;  // Must be one of 7 emotions
  confidence: number;          // Must be a number (0-1)
  timestamp: number;           // Must be a number
}
```

**Where to get it?**
Comes with Next.js when you select TypeScript during setup.

Website: https://www.typescriptlang.org

---

### 3.4 Tailwind CSS v4 (Styling)

**What is it?**
Tailwind CSS is a utility-first CSS framework. Instead of writing CSS in separate files, you add classes directly to HTML elements.

**Why do we use it?**
- No switching between HTML and CSS files
- Consistent spacing, colors, and sizing out of the box
- Dark mode support built-in
- Responsive design with simple prefixes (`md:`, `lg:`)
- No CSS naming conflicts

**Example:**
```html
<!-- Traditional CSS -->
<div class="card">...</div>
<style>.card { background: #1a1a1a; padding: 24px; border-radius: 16px; }</style>

<!-- Tailwind CSS (what we use) -->
<div className="bg-zinc-900 p-6 rounded-2xl">...</div>
```

**Where to get it?**
Comes with Next.js. Our setup in `src/app/globals.css`:
```css
@import "tailwindcss";
```

Website: https://tailwindcss.com

---

### 3.5 MongoDB Atlas (Database)

**What is it?**
MongoDB is a **NoSQL database** that stores data as JSON-like documents (not tables like SQL). MongoDB Atlas is the **cloud-hosted** version — your database lives on MongoDB's servers, not on your computer.

**Why do we use it?**
- Free tier (512MB storage) — perfect for this project
- Flexible schema — no need to define exact column types upfront
- JSON-like documents match JavaScript objects perfectly
- Easy to use with Node.js/Next.js
- Cloud-hosted — accessible from anywhere

**What data do we store?**
- User accounts (email, password hash, name)
- User sessions (login tokens)
- Mood entries (mood score 1-10, notes, timestamps)

**Where to get it?**
1. Go to https://www.mongodb.com/atlas
2. Create a free account
3. Create a free cluster (M0 tier)
4. Get your connection string (looks like: `mongodb+srv://username:password@cluster.xxxxx.mongodb.net/`)
5. Put it in your `.env` file as `MONGODB_URI`

---

### 3.6 Mongoose (MongoDB ODM)

**What is it?**
Mongoose is an **Object Document Mapper** for MongoDB. It lets you define the structure of your data (schemas) and interact with MongoDB using JavaScript objects instead of raw queries.

**Why do we use it?**
- Defines data structure with schemas (what fields, what types)
- Validates data before saving (e.g., mood must be 1-10)
- Provides easy methods: `.find()`, `.create()`, `.save()`
- Handles connection pooling (reusing database connections)

**Example from our project:**
```typescript
// src/models/MoodEntry.ts
const moodEntrySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  mood: { type: Number, required: true, min: 1, max: 10 },
  note: { type: String },
}, { timestamps: true });
```

**Where to get it?**
```bash
npm install mongoose
```

---

### 3.7 Better Auth (Authentication)

**What is it?**
Better Auth is a modern authentication library for Next.js. It handles user sign-up, sign-in, sessions, and security so you don't have to build it from scratch.

**Why do we use it?**
- Email/password authentication out of the box
- Session management with secure HTTP-only cookies
- MongoDB adapter — stores users in our existing database
- Next.js integration — works with App Router
- Handles password hashing, token generation, session expiry

**How it works in our project:**
- Server config: `src/lib/auth.ts` — sets up Better Auth with MongoDB
- Client hooks: `src/lib/auth-client.ts` — provides `signIn()`, `signOut()`, `signUp()`, `useSession()`
- API routes: `src/app/api/auth/[...all]/route.ts` — handles all auth endpoints automatically

**Where to get it?**
```bash
npm install better-auth
```
Website: https://www.better-auth.com

---

### 3.8 Google Gemini 2.5 Flash (AI Model)

**What is it?**
Gemini is Google's AI language model (like ChatGPT). The "2.5 Flash" variant is fast and optimized for quick responses. We use it to power both the text chat and the emotion-aware AI session.

**Why do we use it?**
- Free tier with generous limits
- Fast response times (important for spoken conversations)
- Supports conversation history (remembers context)
- System instructions (we tell it to act as a therapist)
- Supports temperature control (creativity vs consistency)

**How we use it:**
1. **AI Chat** (`src/lib/ai.ts`): Simple text conversation, temperature 0.7, max 1000 tokens
2. **AI Session** (`src/lib/ai-session.ts`): Emotion-aware conversation, temperature 0.8, max 300 tokens (shorter for speech)

**Where to get it?**
1. Go to https://aistudio.google.com
2. Click "Get API Key"
3. Create a new API key
4. Put it in your `.env` file as `GEMINI_API_KEY`

```bash
npm install @google/generative-ai
```

---

### 3.9 face-api.js (Facial Emotion Detection — ML)

**What is it?**
face-api.js is an open-source JavaScript library that uses **machine learning** to detect faces and recognize facial expressions in real-time. It runs entirely in the browser (no server needed).

**Why do we use it?**
- 100% free and open-source
- Runs in the browser — no API calls, no server costs, no privacy concerns
- Detects 7 emotions: neutral, happy, sad, angry, fearful, disgusted, surprised
- Pre-trained models — no need to train your own ML model
- Works with any webcam via HTML5 video element

**How it works (simplified):**
```
Camera feed (video element)
        │
        ▼
TinyFaceDetector model → finds where the face is in the frame
        │
        ▼
FaceLandmark68Net model → maps 68 points on the face (eyes, nose, mouth, jawline)
        │
        ▼
FaceExpressionNet model → analyzes the landmark positions to classify emotion
        │
        ▼
Output: { happy: 0.02, sad: 0.73, angry: 0.05, neutral: 0.15, ... }
         (each emotion gets a probability score from 0 to 1)
```

**The 3 ML models used:**

| Model | File Size | What It Does |
|-------|-----------|-------------|
| `tiny_face_detector` | ~190 KB | Finds faces in the video frame |
| `face_landmark_68` | ~350 KB | Maps 68 facial points |
| `face_expression` | ~310 KB | Classifies 7 emotions |

**Where to get it?**
```bash
npm install face-api.js
```
Model files: Download from https://github.com/justadudewhohacks/face-api.js/tree/master/weights and place in `public/models/`

---

### 3.10 PeerJS / WebRTC (Video Calling)

**What is it?**
- **WebRTC** (Web Real-Time Communication) is a browser technology for peer-to-peer video/audio/data connections — no server needed for the actual media stream.
- **PeerJS** is a library that simplifies WebRTC. It handles the complex signaling process (how two browsers find each other).

**Why do we use it?**
- Free — no video server costs (video flows directly between browsers)
- Low latency — direct connection between two users
- PeerJS simplifies WebRTC from hundreds of lines to ~20 lines
- Built-in fallback servers for signaling

**How it works:**
```
User A                         PeerJS Cloud Server                    User B
  │                                   │                                  │
  ├── Create Peer → gets ID ─────────►│                                  │
  │                                   │◄───── Create Peer → gets ID ─────┤
  │                                   │                                  │
  ├── Call(User B's ID) ─────────────►│──── Forward connection offer ────►│
  │                                   │◄──── Accept call ────────────────┤
  │                                   │                                  │
  │◄══════════ Direct P2P video/audio stream (no server) ═══════════════►│
```

**Where to get it?**
```bash
npm install peerjs
```

---

### 3.11 Web Speech API (Speech-to-Text)

**What is it?**
A **built-in browser API** that converts spoken words into text. No installation needed — it's part of Chrome and Edge browsers.

**Why do we use it?**
- 100% free — no API costs
- No installation — built into the browser
- Real-time transcription with interim results
- Continuous mode — keeps listening until stopped

**Limitation:** Only works in Chrome and Edge (not Firefox or Safari).

**How we use it:** `src/hooks/useSpeechRecognition.ts`

---

### 3.12 Web Speech Synthesis (Text-to-Speech)

**What is it?**
A **built-in browser API** that converts text into spoken words. The AI's responses are spoken aloud using this.

**Why do we use it?**
- 100% free — no API costs
- No installation — built into the browser
- Multiple voice options (we select a calm English voice)
- Controllable speed (we use rate=0.9 for a calm pace)

**How we use it:** `src/hooks/useSpeechSynthesis.ts`

---

### 3.13 Web Audio API (Voice Analysis)

**What is it?**
A **built-in browser API** for processing and analyzing audio. We use it to measure the user's voice volume and detect when they're speaking.

**Why do we use it?**
- 100% free — built into every modern browser
- Real-time audio analysis using `AnalyserNode`
- Can calculate RMS (Root Mean Square) volume
- Helps detect emotional states (quiet voice = potential sadness)

**How we use it:** `src/hooks/useVoiceAnalysis.ts`

---

### 3.14 lucide-react (Icons)

**What is it?**
A library of 1000+ clean, consistent SVG icons as React components.

**Why do we use it?**
- Clean, modern icons that match our design
- Tree-shakeable — only the icons we import are included in the bundle
- Consistent sizing and styling
- Easy to use: `<MessageCircle className="w-6 h-6" />`

**Where to get it?**
```bash
npm install lucide-react
```
Icon browser: https://lucide.dev

---

## 4. Project File Structure

```
mindwell-ai/
│
├── .env                              # Environment variables (secrets)
├── package.json                      # Dependencies & scripts
├── next.config.ts                    # Next.js configuration
├── tsconfig.json                     # TypeScript configuration
├── postcss.config.mjs                # PostCSS config (for Tailwind)
│
├── public/                           # Static files (served as-is)
│   └── models/                       # face-api.js ML model weights
│       ├── tiny_face_detector_model-weights_manifest.json
│       ├── tiny_face_detector_model-shard1
│       ├── face_landmark_68_model-weights_manifest.json
│       ├── face_landmark_68_model-shard1
│       ├── face_expression_model-weights_manifest.json
│       └── face_expression_model-shard1
│
└── src/                              # All source code
    │
    ├── app/                          # Next.js App Router (pages & API)
    │   ├── layout.tsx                # Root layout (wraps ALL pages)
    │   ├── page.tsx                  # Landing page (/)
    │   ├── globals.css               # Global styles (Tailwind import)
    │   │
    │   ├── sign-in/
    │   │   └── page.tsx              # Sign-in page (/sign-in)
    │   ├── sign-up/
    │   │   └── page.tsx              # Sign-up page (/sign-up)
    │   ├── dashboard/
    │   │   └── page.tsx              # Dashboard (/dashboard)
    │   ├── chat/
    │   │   └── page.tsx              # AI Chat (/chat)
    │   ├── video/
    │   │   └── page.tsx              # Video Call (/video)
    │   ├── ai-session/
    │   │   └── page.tsx              # AI Session (/ai-session)
    │   │
    │   └── api/                      # Backend API routes
    │       ├── auth/
    │       │   ├── [...all]/
    │       │   │   └── route.ts      # All Better Auth endpoints
    │       │   └── refresh-session/
    │       │       └── route.ts      # Session refresh endpoint
    │       ├── chat/
    │       │   └── route.ts          # POST /api/chat
    │       ├── mood/
    │       │   └── route.ts          # GET & POST /api/mood
    │       └── ai-session/
    │           └── route.ts          # POST /api/ai-session
    │
    ├── lib/                          # Shared utility modules
    │   ├── auth.ts                   # Better Auth server config
    │   ├── auth-client.ts            # Better Auth client hooks
    │   ├── db.ts                     # MongoDB connection
    │   ├── ai.ts                     # Gemini AI (text chat)
    │   └── ai-session.ts             # Gemini AI (emotion-aware)
    │
    ├── models/                       # Mongoose database schemas
    │   ├── MoodEntry.ts              # Mood entry schema
    │   └── Message.ts                # Chat message schema
    │
    ├── types/                        # TypeScript type definitions
    │   └── ai-session.ts             # Types for emotions, voice, sessions
    │
    ├── hooks/                        # Custom React hooks
    │   ├── useFaceDetection.ts       # Face emotion detection
    │   ├── useSpeechRecognition.ts   # Voice-to-text
    │   ├── useSpeechSynthesis.ts     # Text-to-voice
    │   └── useVoiceAnalysis.ts       # Voice volume & pace
    │
    └── components/                   # Reusable UI components
        ├── ThemeProvider.tsx          # Dark/light theme context
        └── ThemeToggle.tsx           # Theme toggle button
```

---

## 5. System Architecture Diagram

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            USER'S BROWSER                               │
│                                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │  Landing Page │  │  Dashboard   │  │   AI Chat    │  │  AI Session│ │
│  │    (/)        │  │ (/dashboard) │  │   (/chat)    │  │(/ai-session│ │
│  └──────────────┘  └──────────────┘  └──────┬───────┘  └─────┬──────┘ │
│                                              │                │        │
│  ┌──────────────┐  ┌──────────────┐          │    ┌───────────┴──────┐ │
│  │  Sign In     │  │  Video Call  │          │    │ Browser APIs:    │ │
│  │  Sign Up     │  │  (/video)    │          │    │ • Camera/Mic     │ │
│  └──────┬───────┘  └──────┬───────┘          │    │ • face-api.js    │ │
│         │                 │                  │    │ • Web Speech API │ │
│         │                 │                  │    │ • Web Audio API  │ │
│         │                 │                  │    └───────────┬──────┘ │
└─────────┼─────────────────┼──────────────────┼───────────────┼────────┘
          │                 │                  │               │
          │                 │                  │               │
          ▼                 ▼                  ▼               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       NEXT.JS SERVER (Node.js)                          │
│                                                                         │
│  ┌─────────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │ /api/auth/*     │  │ /api/chat    │  │ /api/ai-session          │  │
│  │ (Better Auth)   │  │              │  │                          │  │
│  │ Sign up/in/out  │  │ Sends msg +  │  │ Receives transcript +   │  │
│  │ Session mgmt    │  │ history to   │  │ emotions + voice data   │  │
│  └────────┬────────┘  │ Gemini       │  │ Builds emotion context  │  │
│           │           └──────┬───────┘  │ Sends to Gemini         │  │
│           │                  │          └────────────┬─────────────┘  │
│  ┌────────┴────────┐        │                       │                 │
│  │ /api/mood       │        │                       │                 │
│  │ GET: fetch moods│        │                       │                 │
│  │ POST: save mood │        │                       │                 │
│  └────────┬────────┘        │                       │                 │
└───────────┼─────────────────┼───────────────────────┼─────────────────┘
            │                 │                       │
            ▼                 ▼                       ▼
   ┌────────────────┐  ┌──────────────────────────────────────┐
   │  MongoDB Atlas  │  │         Google Gemini API             │
   │  (Cloud DB)     │  │         (AI Language Model)           │
   │                 │  │                                       │
   │  Collections:   │  │  Model: gemini-2.5-flash              │
   │  • users        │  │  • Text chat (temperature 0.7)       │
   │  • sessions     │  │  • Emotion-aware (temperature 0.8)   │
   │  • moodentries  │  │                                       │
   └────────────────┘  └───────────────────────────────────────┘

          ┌──────────────────────────────────────┐
          │       PeerJS Signaling Server         │
          │       (Cloud, free tier)              │
          │                                       │
          │  Only used for initial connection     │
          │  Actual video goes P2P (direct)       │
          └──────────────────────────────────────┘
```

### What Runs Where

| Where | What Runs | Why |
|-------|----------|-----|
| **Browser** | React pages, face-api.js, Web Speech, Web Audio, PeerJS | User interaction, ML inference, media capture |
| **Next.js Server** | API routes, auth logic, Gemini API calls | Secure API keys, server-side processing |
| **MongoDB Atlas** | User data, sessions, mood entries | Persistent data storage |
| **Google Cloud** | Gemini AI model | AI text generation |
| **PeerJS Cloud** | WebRTC signaling only | Helps two browsers find each other |

---

## 6. Data Flow Diagrams (DFD)

### DFD Level 0 — Context Diagram

```
                              ┌─────────────────────┐
                              │                     │
     User credentials ──────► │                     │ ──────► Auth confirmation
     Chat messages ──────────►│                     │ ──────► AI responses
     Mood data ──────────────►│    MindWell AI      │ ──────► Mood history
     Voice + Face data ──────►│    (System)         │ ──────► Emotion-aware AI
     Video call request ─────►│                     │ ──────► P2P video stream
                              │                     │
                              └─────────────────────┘
                                   │          │
                                   ▼          ▼
                            ┌──────────┐ ┌──────────┐
                            │ MongoDB  │ │ Gemini   │
                            │ Atlas    │ │ API      │
                            └──────────┘ └──────────┘
```

### DFD Level 1 — Detailed Processes

```
                                    ┌──────────┐
                                    │   User   │
                                    └────┬─────┘
                    ┌────────────────────┼────────────────────┐
                    │                    │                    │
                    ▼                    ▼                    ▼
          ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
          │ P1: Authenticate│  │ P2: AI Chat     │  │ P3: Track Mood  │
          │                 │  │                 │  │                 │
          │ Sign up/in/out  │  │ Send message    │  │ Save mood entry │
          │ Manage session  │  │ Get AI response │  │ View history    │
          └────────┬────────┘  └────────┬────────┘  └────────┬────────┘
                   │                    │                    │
                   ▼                    ▼                    ▼
            ┌────────────┐       ┌────────────┐       ┌────────────┐
            │  MongoDB   │       │  Gemini AI │       │  MongoDB   │
            │ users +    │       │  API       │       │ moodentries│
            │ sessions   │       └────────────┘       └────────────┘
            └────────────┘

                    ┌────────────────────┐
                    │        User        │
                    └────────┬───────────┘
                    ┌────────┴───────────┐
                    ▼                    ▼
          ┌─────────────────┐  ┌─────────────────┐
          │ P4: AI Session  │  │ P5: Video Call  │
          │                 │  │                 │
          │ Detect face     │  │ Create peer     │
          │ Recognize speech│  │ Connect to peer │
          │ Analyze voice   │  │ Stream video    │
          │ Get AI response │  │                 │
          └────────┬────────┘  └────────┬────────┘
                   │                    │
                   ▼                    ▼
            ┌────────────┐       ┌────────────┐
            │  Gemini AI │       │  PeerJS    │
            │  API       │       │  Server    │
            └────────────┘       └────────────┘
```

---

### Authentication Flow

```
┌──────────┐                    ┌──────────────┐                 ┌──────────┐
│  Browser │                    │  Next.js API │                 │ MongoDB  │
│  (React) │                    │  /api/auth/* │                 │  Atlas   │
└────┬─────┘                    └──────┬───────┘                 └────┬─────┘
     │                                │                               │
     │  SIGN UP                       │                               │
     │  ───────                       │                               │
     │                                │                               │
     │ 1. User fills form             │                               │
     │    (name, email, password)     │                               │
     │                                │                               │
     │ 2. POST /api/auth/sign-up ───► │                               │
     │    { name, email, password }   │                               │
     │                                │ 3. Hash password              │
     │                                │    (bcrypt)                   │
     │                                │                               │
     │                                │ 4. Create user ─────────────► │
     │                                │    { name, email, hash }      │ ──► users collection
     │                                │                               │
     │                                │ 5. Create session ──────────► │
     │                                │    { userId, token, expiry }  │ ──► sessions collection
     │                                │                               │
     │ ◄──── 6. Set HTTP-only cookie  │                               │
     │        (session token)         │                               │
     │                                │                               │
     │ 7. Redirect to /dashboard      │                               │
     │                                │                               │
     │  SIGN IN                       │                               │
     │  ───────                       │                               │
     │                                │                               │
     │ 1. POST /api/auth/sign-in ───► │                               │
     │    { email, password }         │                               │
     │                                │ 2. Find user ───────────────► │
     │                                │ ◄── { email, hash } ──────── │
     │                                │                               │
     │                                │ 3. Compare password           │
     │                                │    with stored hash           │
     │                                │                               │
     │                                │ 4. Create session ──────────► │
     │ ◄──── 5. Set HTTP-only cookie  │                               │
     │                                │                               │
     │ 6. Redirect to /dashboard      │                               │
     │                                │                               │
     │  SESSION CHECK (every page)    │                               │
     │  ──────────────────────────    │                               │
     │                                │                               │
     │ 1. getSession() ────────────► │                               │
     │    (sends cookie automatically)│ 2. Validate token ──────────► │
     │                                │ ◄── session data ──────────── │
     │ ◄──── 3. { user, session }     │                               │
     │    or redirect to /sign-in     │                               │
     │                                │                               │
```

---

### AI Chat Flow

```
┌──────────┐                    ┌──────────────┐                 ┌──────────┐
│  Browser │                    │  Next.js API │                 │  Google  │
│ /chat    │                    │  /api/chat   │                 │  Gemini  │
└────┬─────┘                    └──────┬───────┘                 └────┬─────┘
     │                                │                               │
     │ 1. User types message          │                               │
     │    "I feel anxious today"      │                               │
     │                                │                               │
     │ 2. POST /api/chat ───────────► │                               │
     │    {                           │                               │
     │      message: "I feel...",     │                               │
     │      history: [                │                               │
     │        { role: "assistant",    │                               │
     │          content: "Hey! ..." },│                               │
     │        { role: "user",         │                               │
     │          content: "I feel..." }│                               │
     │      ]                         │                               │
     │    }                           │                               │
     │                                │ 3. Build Gemini request       │
     │                                │    System prompt:             │
     │                                │    "You are MindWell,         │
     │                                │     a compassionate AI..."    │
     │                                │                               │
     │                                │ 4. Send to Gemini ──────────► │
     │                                │    model: gemini-2.5-flash    │
     │                                │    temperature: 0.7           │
     │                                │    maxTokens: 1000            │
     │                                │                               │
     │                                │ ◄──── 5. AI response ──────── │
     │                                │    "I hear you. Anxiety can   │
     │                                │     feel overwhelming..."     │
     │                                │                               │
     │ ◄──── 6. { response: "..." }   │                               │
     │                                │                               │
     │ 7. Display AI message in UI    │                               │
     │    (auto-scroll to bottom)     │                               │
     │                                │                               │
```

---

### Mood Tracking Flow

```
┌──────────┐                    ┌──────────────┐                 ┌──────────┐
│  Browser │                    │  Next.js API │                 │ MongoDB  │
│/dashboard│                    │  /api/mood   │                 │  Atlas   │
└────┬─────┘                    └──────┬───────┘                 └────┬─────┘
     │                                │                               │
     │  SAVE MOOD                     │                               │
     │  ─────────                     │                               │
     │                                │                               │
     │ 1. User moves slider (1-10)    │                               │
     │    Types note: "Had a good     │                               │
     │    morning walk"               │                               │
     │                                │                               │
     │ 2. POST /api/mood ───────────► │                               │
     │    { mood: 8,                  │                               │
     │      note: "Had a good..." }   │                               │
     │    + session cookie            │                               │
     │                                │ 3. Verify session             │
     │                                │    (auth check)               │
     │                                │                               │
     │                                │ 4. Connect to MongoDB         │
     │                                │                               │
     │                                │ 5. MoodEntry.create() ──────► │
     │                                │    { userId, mood: 8,         │ ──► moodentries
     │                                │      note: "Had a good...",   │     collection
     │                                │      createdAt: timestamp }   │
     │                                │                               │
     │ ◄──── 6. Saved entry           │                               │
     │                                │                               │
     │  FETCH HISTORY                 │                               │
     │  ─────────────                 │                               │
     │                                │                               │
     │ 7. GET /api/mood ────────────► │                               │
     │    + session cookie            │ 8. Verify session             │
     │                                │                               │
     │                                │ 9. MoodEntry.find() ────────► │
     │                                │    { userId }                 │
     │                                │    sort by date, limit 30     │
     │                                │ ◄──── mood entries ────────── │
     │                                │                               │
     │ ◄──── 10. [entries array]      │                               │
     │                                │                               │
     │ 11. Display in dashboard       │                               │
     │     (list + mood score)        │                               │
     │                                │                               │
```

---

### AI Session Flow (The Complete Pipeline)

```
┌──────────────────────────────────────────────────────────────────────────┐
│                           USER'S BROWSER                                 │
│                                                                          │
│  ┌─────────┐    ┌──────────────┐    ┌────────────┐    ┌──────────────┐ │
│  │ Camera  │───►│ face-api.js  │───►│ Emotion    │    │ Speech       │ │
│  │ Feed    │    │ (ML models)  │    │ Snapshots  │    │ Recognition  │ │
│  └─────────┘    └──────────────┘    │            │    │ (Web Speech  │ │
│                  Every 500ms:       │ {          │    │  API)        │ │
│                  • Detect face      │   dominant:│    │              │ │
│                  • Map 68 landmarks │   "sad",   │    │ Converts     │ │
│                  • Classify emotion │   confidence│   │ speech to    │ │
│                                     │   0.73,    │    │ text in      │ │
│  ┌─────────┐    ┌──────────────┐   │   all: {.. │    │ real-time    │ │
│  │ Micro-  │───►│ Web Audio    │   │ }          │    │              │ │
│  │ phone   │    │ API          │   └─────┬──────┘    └──────┬───────┘ │
│  └─────────┘    │              │         │                  │         │
│                 │ Analyzes:    │         │                  │         │
│                 │ • Volume     │         │                  │         │
│                 │   (0-100 RMS)│         │    ┌─────────────┘         │
│                 │ • Speaking?  │         │    │                       │
│                 │   (vol > 15) │         │    │   2 seconds of        │
│                 └──────┬───────┘         │    │   silence detected    │
│                        │                │    │                       │
│                   Voice Metrics         │    │                       │
│                   { volume: 25,         │    ▼                       │
│                     pace: "slow",       │  ┌─────────────────────┐   │
│                     isSpeaking: false } │  │  Collect & Send:    │   │
│                        │                │  │  • Transcript text  │   │
│                        └────────────────┘  │  • Emotion history  │   │
│                                            │  • Voice metrics    │   │
│                                            └─────────┬───────────┘   │
└───────────────────────────────────────────────────────┼──────────────┘
                                                        │
                                              POST /api/ai-session
                                                        │
                                                        ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                           NEXT.JS SERVER                                 │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  /api/ai-session/route.ts                                         │  │
│  │                                                                    │  │
│  │  Receives: { transcript, emotions[], voiceMetrics, history[] }    │  │
│  │                                                                    │  │
│  │  1. buildEmotionContext():                                        │  │
│  │     Input:  emotions = [{dominant:"sad", confidence:0.73}, ...]   │  │
│  │     Output: "[Emotional context — do NOT quote this to user]      │  │
│  │              Primary expression: sad (observed 8/10 times)        │  │
│  │              Voice: quiet volume, slow pace                       │  │
│  │              Note: Low voice and slow pace may indicate sadness"  │  │
│  │                                                                    │  │
│  │  2. Build message for Gemini:                                     │  │
│  │     "[Emotional context...]\n\n[User says]: "I'm doing fine..."   │  │
│  │                                                                    │  │
│  │  3. System prompt: "You are MindWell, a compassionate AI          │  │
│  │     therapist conducting a face-to-face video session..."         │  │
│  └──────────────────────────────────┬────────────────────────────────┘  │
└─────────────────────────────────────┼────────────────────────────────────┘
                                      │
                                      ▼
                            ┌──────────────────┐
                            │  Google Gemini   │
                            │  2.5 Flash       │
                            │                  │
                            │  Temperature: 0.8│
                            │  MaxTokens: 300  │
                            │                  │
                            │  Returns:        │
                            │  "I notice you   │
                            │  seem a bit down │
                            │  even though you │
                            │  say you're fine. │
                            │  What's really on│
                            │  your mind?"     │
                            └────────┬─────────┘
                                     │
                                     ▼
                          ┌────────────────────┐
                          │   Back to Browser  │
                          │                    │
                          │ 1. Display text    │
                          │ 2. Speak via TTS   │
                          │ 3. Pause listening │
                          │    (so TTS isn't   │
                          │     captured as    │
                          │     user input)    │
                          │ 4. When speech ends│
                          │    → resume loop   │
                          └────────────────────┘
```

---

### Video Call Flow

```
┌──────────┐                    ┌──────────────┐                 ┌──────────┐
│  User A  │                    │  PeerJS      │                 │  User B  │
│  Browser │                    │  Cloud Server│                 │  Browser │
└────┬─────┘                    └──────┬───────┘                 └────┬─────┘
     │                                │                               │
     │ 1. new Peer() ────────────────►│                               │
     │                                │                               │
     │ ◄──── 2. Your ID: "abc-123"    │                               │
     │                                │                               │
     │ 3. Share ID with friend        │                               │
     │    (copy to clipboard)         │         4. new Peer() ───────►│
     │                                │         ◄── ID: "xyz-789"     │
     │                                │                               │
     │ 5. Friend enters "abc-123"     │                               │
     │    and clicks Call             │                               │
     │                                │    6. peer.call("abc-123") ──►│
     │                                │◄──────────────────────────────┤
     │ ◄──── 7. Incoming call         │                               │
     │        (auto-answered)         │                               │
     │                                │                               │
     │ ◄═══════════════ 8. Direct P2P video/audio stream ═══════════►│
     │        (No server involved — data flows directly)              │
     │                                                                │
     │ 9. End call → tracks stopped                                   │
     │                                                                │
```

---

## 7. Database Design

### MongoDB Collections

MindWell AI uses **MongoDB Atlas** with 3 main collections (plus 2 auth collections managed by Better Auth):

```
┌──────────────────────────────────────────────────────────────────┐
│                        MongoDB Atlas                              │
│                                                                   │
│  ┌───────────────────┐  ┌───────────────────┐                    │
│  │    users           │  │    sessions        │                   │
│  │  (Better Auth)     │  │  (Better Auth)     │                   │
│  │                    │  │                    │                    │
│  │  _id: ObjectId     │  │  _id: ObjectId     │                   │
│  │  name: String      │  │  userId: String     │                  │
│  │  email: String     │◄─┤  token: String      │                  │
│  │  emailVerified:Bool│  │  expiresAt: Date    │                  │
│  │  image: String     │  │  ipAddress: String  │                  │
│  │  createdAt: Date   │  │  userAgent: String  │                  │
│  │  updatedAt: Date   │  │  createdAt: Date    │                  │
│  └────────┬───────────┘  └───────────────────┘                   │
│           │                                                       │
│           │  userId references                                    │
│           │                                                       │
│  ┌────────┴───────────┐  ┌───────────────────┐                   │
│  │   moodentries      │  │    messages        │                   │
│  │                    │  │  (defined but not  │                    │
│  │  _id: ObjectId     │  │   actively used)   │                   │
│  │  userId: String    │  │                    │                    │
│  │  mood: Number(1-10)│  │  _id: ObjectId     │                   │
│  │  note: String      │  │  userId: String    │                   │
│  │  createdAt: Date   │  │  role: "user" |    │                   │
│  │  updatedAt: Date   │  │        "assistant" │                   │
│  │                    │  │  content: String   │                    │
│  └────────────────────┘  │  createdAt: Date   │                   │
│                          │  updatedAt: Date   │                    │
│                          └───────────────────┘                   │
└──────────────────────────────────────────────────────────────────┘
```

### Collection Details

#### `users` (managed by Better Auth)
| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Auto-generated unique ID |
| `name` | String | User's display name |
| `email` | String | User's email (unique) |
| `emailVerified` | Boolean | Whether email is verified |
| `image` | String | Profile image URL |
| `createdAt` | Date | Account creation time |
| `updatedAt` | Date | Last update time |

#### `sessions` (managed by Better Auth)
| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Auto-generated unique ID |
| `userId` | String | References users._id |
| `token` | String | Session token (in cookie) |
| `expiresAt` | Date | When session expires (7 days) |
| `ipAddress` | String | User's IP address |
| `userAgent` | String | Browser info |

#### `moodentries`
| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Auto-generated unique ID |
| `userId` | String | Who logged this mood |
| `mood` | Number | 1-10 scale (1=struggling, 10=great) |
| `note` | String | Optional text note |
| `createdAt` | Date | When the mood was logged |
| `updatedAt` | Date | Last update time |

#### `messages` (defined, not actively used yet)
| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Auto-generated unique ID |
| `userId` | String | Who sent/received this |
| `role` | String | "user" or "assistant" |
| `content` | String | Message text |
| `createdAt` | Date | When message was sent |

---

## 8. Authentication System

### How Sign Up Works (Step by Step)

```
Step 1: User visits /sign-up
Step 2: Fills in Name, Email, Password (min 8 characters)
Step 3: Clicks "Create Account"
Step 4: Browser calls authClient.signUp.email({ name, email, password })
Step 5: Better Auth receives the request at /api/auth/sign-up
Step 6: Better Auth hashes the password using bcrypt
Step 7: Better Auth creates a document in MongoDB "users" collection
Step 8: Better Auth creates a session document in "sessions" collection
Step 9: Better Auth sets an HTTP-only cookie in the response
        (HTTP-only = JavaScript can't read it, only sent with requests)
Step 10: Browser redirects to /dashboard
```

### How Sign In Works

```
Step 1: User visits /sign-in
Step 2: Fills in Email and Password
Step 3: Clicks "Sign In"
Step 4: Browser calls authClient.signIn.email({ email, password })
Step 5: Better Auth finds the user by email in MongoDB
Step 6: Better Auth compares password hash with stored hash
Step 7: If match → creates new session, sets cookie
Step 8: If no match → returns error "Invalid credentials"
Step 9: Browser redirects to /dashboard
```

### Session Management

```
┌─────────────────────────────────────────────────────────────┐
│                    Session Lifecycle                          │
│                                                              │
│  Created ──► Active (7 days) ──► Expired ──► Deleted        │
│     │            │                                           │
│     │            │  Every page load:                         │
│     │            │  authClient.getSession()                  │
│     │            │  • Sends cookie to server                 │
│     │            │  • Server checks if session is valid      │
│     │            │  • Returns user data or "unauthorized"    │
│     │            │                                           │
│     │            │  Cookie cache: 5 minutes                  │
│     │            │  (avoids hitting DB on every request)     │
│     │            │                                           │
│     │            │  Update age: 1 day                        │
│     │            │  (refreshes session if older than 1 day)  │
│     │                                                        │
│     └── Set as HTTP-only secure cookie                       │
│         (browser sends it automatically with every request)  │
└─────────────────────────────────────────────────────────────┘
```

---

## 9. Feature Deep Dives

### 9.1 AI Chat — How It Works End-to-End

**Page:** `src/app/chat/page.tsx`
**API:** `src/app/api/chat/route.ts`
**AI Logic:** `src/lib/ai.ts`

```
1. Page loads with welcome message from AI
2. User types a message and hits Send
3. Message added to local state (messages array)
4. Loading spinner shows while waiting
5. POST request sent to /api/chat with:
   - Current message
   - Full conversation history (so AI remembers context)
6. Server receives request
7. Server formats history for Gemini (user → "user", assistant → "model")
8. Server sends to Gemini with system prompt:
   "You are MindWell, a compassionate AI mental health companion..."
9. Gemini processes and returns response
10. Server sends response back to browser
11. AI message displayed in chat bubble
12. Chat auto-scrolls to bottom
```

**Key configuration:**
- Model: `gemini-2.5-flash` (fast responses)
- Temperature: `0.7` (balanced — not too random, not too robotic)
- Max tokens: `1000` (allows detailed responses)
- System prompt makes AI act as a warm, non-judgmental companion

---

### 9.2 Mood Tracking — How It Works

**Page:** `src/app/dashboard/page.tsx` (MoodTracker component)
**API:** `src/app/api/mood/route.ts`
**Model:** `src/models/MoodEntry.ts`

```
1. User sees mood slider (1-10) on dashboard
2. Moves slider to desired mood level
3. Optionally types a note about how they feel
4. Clicks "Save Check-in"
5. POST /api/mood with { mood, note }
6. Server verifies user is authenticated (checks session cookie)
7. Server connects to MongoDB
8. Creates new MoodEntry document
9. Returns saved entry
10. Dashboard refreshes mood history
11. "Recent Activity" section shows last 5 entries
12. Mood Score card shows latest mood value
```

---

### 9.3 Video Calling — How PeerJS P2P Works

**Page:** `src/app/video/page.tsx`

```
1. Page loads → requests camera/microphone permission
2. Local video stream shown in "You" box
3. PeerJS creates a unique ID (e.g., "abc-123-def")
4. User copies their ID and shares with friend
5. Friend opens /video, gets their own ID
6. Friend pastes User's ID and clicks "Call"
7. PeerJS sends connection request through its cloud server
8. User's browser receives the call and auto-answers
9. Video/audio now flows DIRECTLY between browsers (P2P)
   — The PeerJS server is NO LONGER involved
10. Controls: Mute mic, toggle camera, end call
11. End call → stop all media tracks, clear remote video
```

**Why P2P is great:**
- No video server costs
- Lower latency (direct connection)
- Privacy (video doesn't pass through any server)

---

### 9.4 AI Session — The Complete Emotion Detection Pipeline

**Page:** `src/app/ai-session/page.tsx`
**Hooks:** `useFaceDetection`, `useSpeechRecognition`, `useSpeechSynthesis`, `useVoiceAnalysis`
**API:** `src/app/api/ai-session/route.ts`
**AI Logic:** `src/lib/ai-session.ts`

#### Session States

```
idle → loading → ready → active ←──┐
                           │        │
                           ▼        │
                      processing    │
                           │        │
                           ▼        │
                       speaking ────┘
                           │
                      (user ends)
                           │
                           ▼
                         ended
```

| State | What's Happening |
|-------|-----------------|
| `idle` | Start screen shown, waiting for user to click "Start Session" |
| `loading` | Requesting camera/mic, loading face-api.js ML models |
| `ready` | Everything loaded, about to start |
| `active` | Camera on, face detection running, speech recognition listening |
| `processing` | User stopped talking, sending data to AI |
| `speaking` | AI response being spoken via TTS, listening paused |
| `ended` | Session over, showing summary |

#### The Loop (Detailed)

```
ACTIVE STATE:
├── face-api.js runs every 500ms
│   └── Detects face → classifies 7 emotions → stores in buffer (last 20)
├── Web Speech API listens continuously
│   └── Converts speech to text in real-time (interim + final results)
├── Web Audio API analyzes continuously
│   └── Calculates volume (0-100 RMS) and speaking pace (WPM)
│
└── Silence detection (useEffect):
    └── If transcript hasn't changed for 2 seconds:
        └── TRIGGER PROCESSING

PROCESSING STATE:
├── Stop speech recognition
├── Collect data:
│   ├── transcript (what user said)
│   ├── emotions[] (last 20 face snapshots)
│   └── voiceMetrics (volume, pace, isSpeaking)
├── POST /api/ai-session
│   └── Server:
│       ├── buildEmotionContext(emotions, voiceMetrics)
│       │   └── "Primary: sad (8/10 times), Voice: quiet, slow"
│       ├── Prepend context to transcript
│       └── Send to Gemini (temperature 0.8, max 300 tokens)
└── Receive AI response

SPEAKING STATE:
├── Display AI response text on screen
├── Speak response via Web Speech Synthesis (rate 0.9)
├── Speech recognition PAUSED (so TTS isn't captured as input)
└── When speech ends → back to ACTIVE state, resume listening
```

---

## 10. API Reference

### POST `/api/chat`

**Purpose:** Get AI response for text chat

**Request:**
```json
{
  "message": "I feel anxious today",
  "history": [
    { "role": "assistant", "content": "Hey! I'm MindWell..." },
    { "role": "user", "content": "I feel anxious today" }
  ]
}
```

**Response:**
```json
{
  "response": "I hear you. Anxiety can feel overwhelming. Can you tell me what triggered it today?"
}
```

---

### GET `/api/mood`

**Purpose:** Fetch user's mood history (requires auth)

**Headers:** Session cookie (sent automatically)

**Response:**
```json
[
  {
    "_id": "665f...",
    "userId": "user123",
    "mood": 8,
    "note": "Had a good morning walk",
    "createdAt": "2026-02-26T10:30:00.000Z"
  }
]
```

---

### POST `/api/mood`

**Purpose:** Save a new mood entry (requires auth)

**Request:**
```json
{
  "mood": 7,
  "note": "Feeling calm after meditation"
}
```

**Response:** The saved mood entry object

---

### POST `/api/ai-session`

**Purpose:** Get emotion-aware AI response for video session

**Request:**
```json
{
  "transcript": "I'm doing fine, just a regular day",
  "emotions": [
    {
      "dominant": "sad",
      "confidence": 0.73,
      "all": {
        "neutral": 0.15,
        "happy": 0.02,
        "sad": 0.73,
        "angry": 0.03,
        "fearful": 0.04,
        "disgusted": 0.01,
        "surprised": 0.02
      },
      "timestamp": 1708900000000
    }
  ],
  "voiceMetrics": {
    "volume": 25,
    "pace": "slow",
    "isSpeaking": false
  },
  "history": []
}
```

**Response:**
```json
{
  "response": "I notice you seem a bit down, even though you say things are fine. Sometimes regular days can carry hidden weight. What's been on your mind lately?"
}
```

---

### Auth Endpoints (managed by Better Auth)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/sign-up` | POST | Create new account |
| `/api/auth/sign-in` | POST | Login with email/password |
| `/api/auth/sign-out` | POST | Logout (clear session) |
| `/api/auth/get-session` | GET | Get current session data |
| `/api/auth/refresh-session` | GET | Refresh session token |

---

## 11. How to Run the Project

### Prerequisites

1. **Node.js** (v18 or higher)
   - Download: https://nodejs.org
   - Verify: `node --version`

2. **npm** (comes with Node.js)
   - Verify: `npm --version`

3. **Git** (for cloning)
   - Download: https://git-scm.com

4. **A MongoDB Atlas account** (free)
   - https://www.mongodb.com/atlas

5. **A Google AI Studio API key** (free)
   - https://aistudio.google.com

### Step-by-Step Setup

```bash
# 1. Clone the repository
git clone <repository-url>
cd mindwell-ai

# 2. Install dependencies
npm install

# 3. Create environment file
# Create a file called .env in the root folder with:
```

**.env file contents:**
```
BETTER_AUTH_SECRET=your-random-secret-string-at-least-32-chars
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/mindwell
GEMINI_API_KEY=your-gemini-api-key-from-google-ai-studio
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

```bash
# 4. Run the development server
npm run dev

# 5. Open in browser
# Go to http://localhost:3000
```

### Available Scripts

| Command | What It Does |
|---------|-------------|
| `npm run dev` | Start development server (with hot reload) |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint code linter |

### Getting Your API Keys

#### MongoDB Atlas Connection String
1. Go to https://cloud.mongodb.com
2. Create a free account → Create a free cluster (M0)
3. Click "Connect" on your cluster
4. Choose "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database user's password
7. Put it in `.env` as `MONGODB_URI`

#### Google Gemini API Key
1. Go to https://aistudio.google.com
2. Sign in with your Google account
3. Click "Get API Key" → "Create API key"
4. Copy the key
5. Put it in `.env` as `GEMINI_API_KEY`

#### Better Auth Secret
Generate a random string (at least 32 characters). You can use:
```bash
openssl rand -base64 32
```

---

## 12. Browser Compatibility

| Feature | Chrome | Edge | Firefox | Safari |
|---------|--------|------|---------|--------|
| AI Chat | Yes | Yes | Yes | Yes |
| Mood Tracking | Yes | Yes | Yes | Yes |
| Video Call (PeerJS) | Yes | Yes | Yes | Yes |
| face-api.js (emotions) | Yes | Yes | Yes | Yes |
| Speech-to-Text | Yes | Yes | No | No |
| Text-to-Speech | Yes | Yes | Yes | Yes |
| Voice Analysis | Yes | Yes | Yes | Yes |

**Recommendation:** Use **Google Chrome** or **Microsoft Edge** for the best experience. The AI Session feature requires speech recognition which is only available in Chrome and Edge.

---

## Summary

MindWell AI is a full-stack mental health platform combining:
- **Frontend:** React + Next.js + Tailwind CSS (beautiful, responsive UI)
- **Backend:** Next.js API routes (serverless functions)
- **Database:** MongoDB Atlas (cloud NoSQL database)
- **AI:** Google Gemini 2.5 Flash (empathetic text generation)
- **ML:** face-api.js (real-time facial emotion detection in browser)
- **Browser APIs:** Web Speech (voice ↔ text), Web Audio (volume analysis)
- **Video:** PeerJS / WebRTC (free peer-to-peer video calls)
- **Auth:** Better Auth (secure email/password authentication)

Everything is designed to be **free** — using browser-native APIs, free-tier cloud services, and open-source ML models.

---

*This documentation was created for the MindWell AI project. It is NOT a substitute for professional mental health support.*
