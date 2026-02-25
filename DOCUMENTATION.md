# MindWell AI - Complete Documentation

> AI-powered mental health support platform with chat, mood tracking, and video sessions.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [System Architecture](#4-system-architecture)
5. [Data Flow Diagrams](#5-data-flow-diagrams)
6. [Authentication System](#6-authentication-system)
7. [AI Chat System](#7-ai-chat-system)
8. [Mood Tracking System](#8-mood-tracking-system)
9. [Video Call System](#9-video-call-system)
10. [Database Schemas](#10-database-schemas)
11. [API Reference](#11-api-reference)
12. [Frontend Pages & Components](#12-frontend-pages--components)
13. [Environment Variables](#13-environment-variables)
14. [Setup & Running](#14-setup--running)

---

## 1. Project Overview

MindWell AI is a mental wellness web application that provides:

- **AI Chat** - Conversational AI companion powered by Google Gemini for emotional support
- **Mood Tracking** - Daily mood check-ins with notes, stored persistently per user
- **Video Sessions** - Peer-to-peer video calls using WebRTC via PeerJS
- **User Authentication** - Email/password auth with session management

---

## 2. Tech Stack

| Layer        | Technology                | Version  | Purpose                          |
| ------------ | ------------------------- | -------- | -------------------------------- |
| Framework    | Next.js (App Router)      | 16.1.6   | Full-stack React framework       |
| Language     | TypeScript                | 5.x      | Type-safe JavaScript             |
| UI Library   | React                     | 19.2.3   | Component-based UI               |
| Styling      | Tailwind CSS              | 4.x      | Utility-first CSS                |
| Icons        | Lucide React              | 0.564.0  | SVG icon library                 |
| Auth         | Better Auth               | 1.4.18   | Authentication framework         |
| Database     | MongoDB Atlas + Mongoose  | 9.2.1    | Document database + ODM          |
| AI           | Google Generative AI      | 0.24.1   | Gemini 2.5 Flash model           |
| Video        | PeerJS                    | 1.5.5    | WebRTC peer-to-peer connections  |
| Validation   | Zod                       | 4.3.6    | Schema validation (available)    |
| Animations   | Framer Motion             | 12.34.0  | Animation library (available)    |

---

## 3. Project Structure

```
mindwell-ai/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout (ThemeProvider, global styles)
│   │   ├── globals.css               # Tailwind CSS import
│   │   ├── page.tsx                  # Landing page (/)
│   │   ├── sign-in/
│   │   │   └── page.tsx              # Sign-in form (/sign-in)
│   │   ├── sign-up/
│   │   │   └── page.tsx              # Sign-up form (/sign-up)
│   │   ├── dashboard/
│   │   │   └── page.tsx              # Dashboard with mood tracker (/dashboard)
│   │   ├── chat/
│   │   │   └── page.tsx              # AI chat interface (/chat)
│   │   ├── video/
│   │   │   └── page.tsx              # Video call interface (/video)
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── [...all]/
│   │       │   │   └── route.ts      # Better Auth catch-all handler
│   │       │   └── refresh-session/
│   │       │       └── route.ts      # Session refresh endpoint
│   │       ├── chat/
│   │       │   └── route.ts          # AI chat endpoint
│   │       └── mood/
│   │           └── route.ts          # Mood CRUD endpoints
│   ├── components/
│   │   ├── ThemeProvider.tsx          # Dark/light theme context
│   │   └── ThemeToggle.tsx           # Theme toggle button
│   ├── lib/
│   │   ├── auth.ts                   # Better Auth server config
│   │   ├── auth-client.ts            # Better Auth client hooks
│   │   ├── db.ts                     # MongoDB/Mongoose connection
│   │   └── ai.ts                     # Gemini AI integration
│   └── models/
│       ├── MoodEntry.ts              # Mood entry schema
│       └── Message.ts                # Chat message schema
├── .env                              # Environment variables
├── package.json                      # Dependencies & scripts
├── tsconfig.json                     # TypeScript configuration
├── next.config.ts                    # Next.js configuration
└── postcss.config.mjs                # PostCSS (Tailwind)
```

---

## 4. System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT (Browser)                          │
│                                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │
│  │ Landing  │  │  Auth    │  │Dashboard │  │  Chat / Video    │   │
│  │  Page    │  │  Pages   │  │  Page    │  │    Pages         │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘   │
│       │              │             │               │                │
│       └──────────────┴─────────────┴───────────────┘                │
│                              │                                      │
│                     ┌────────┴────────┐                             │
│                     │  auth-client.ts │                             │
│                     │  (Better Auth)  │                             │
│                     └────────┬────────┘                             │
└──────────────────────────────┼──────────────────────────────────────┘
                               │ HTTP / Fetch
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      SERVER (Next.js API Routes)                    │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │  /api/auth   │  │  /api/chat   │  │     /api/mood            │  │
│  │  [...all]    │  │              │  │  GET (list) / POST (add) │  │
│  └──────┬───────┘  └──────┬───────┘  └────────────┬─────────────┘  │
│         │                 │                        │                │
│  ┌──────┴───────┐  ┌──────┴───────┐  ┌────────────┴─────────────┐  │
│  │   auth.ts    │  │    ai.ts     │  │         db.ts            │  │
│  │ (BetterAuth) │  │  (Gemini)   │  │   (Mongoose connect)     │  │
│  └──────┬───────┘  └──────┬───────┘  └────────────┬─────────────┘  │
└─────────┼─────────────────┼────────────────────────┼────────────────┘
          │                 │                        │
          ▼                 ▼                        ▼
┌──────────────┐   ┌──────────────┐        ┌──────────────────┐
│   MongoDB    │   │  Google      │        │     MongoDB      │
│   Atlas      │   │  Gemini API  │        │     Atlas        │
│  (users,     │   │  (2.5 Flash) │        │  (mood_entries,  │
│   sessions)  │   │              │        │   messages)      │
└──────────────┘   └──────────────┘        └──────────────────┘
```

### Request Flow Overview

```
Browser ──► Next.js Server ──► API Route Handler
                                      │
                         ┌────────────┼────────────┐
                         ▼            ▼            ▼
                    Better Auth   Gemini API   MongoDB
                    (sessions)    (AI chat)    (data)
                         │            │            │
                         └────────────┼────────────┘
                                      ▼
                              JSON Response
                                      │
                                      ▼
                                   Browser
```

---

## 5. Data Flow Diagrams

### 5.1 Complete User Journey

```
                    ┌─────────────┐
                    │   User      │
                    │   Opens     │
                    │   Website   │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐     Yes    ┌─────────────┐
                    │  Has Active ├────────────►│  Dashboard  │
                    │  Session?   │             │    Page     │
                    └──────┬──────┘             └──────┬──────┘
                           │ No                        │
                           ▼                           ▼
                    ┌─────────────┐         ┌──────────────────┐
                    │  Landing    │         │  User can:       │
                    │  Page       │         │  - Track mood    │
                    └──────┬──────┘         │  - AI Chat       │
                           │                │  - Video call    │
                    ┌──────┴──────┐         │  - Sign out      │
                    ▼             ▼         └──────────────────┘
             ┌──────────┐ ┌──────────┐
             │ Sign In  │ │ Sign Up  │
             └──────┬───┘ └────┬─────┘
                    │          │
                    ▼          ▼
             ┌─────────────────────┐
             │   Better Auth       │
             │   Validates &       │
             │   Creates Session   │
             └──────────┬──────────┘
                        │
                        ▼
                 ┌─────────────┐
                 │  Dashboard  │
                 └─────────────┘
```

### 5.2 Authentication Data Flow

```
┌──────────┐         ┌──────────────┐         ┌─────────────┐         ┌──────────┐
│  Browser │         │  /api/auth   │         │  Better     │         │ MongoDB  │
│  Client  │         │  [...all]    │         │  Auth Core  │         │  Atlas   │
└────┬─────┘         └──────┬───────┘         └──────┬──────┘         └────┬─────┘
     │                      │                        │                     │
     │  POST /sign-up       │                        │                     │
     │  {name,email,pass}   │                        │                     │
     ├─────────────────────►│                        │                     │
     │                      │  Validate & hash pass  │                     │
     │                      ├───────────────────────►│                     │
     │                      │                        │  Insert user doc    │
     │                      │                        ├────────────────────►│
     │                      │                        │  Insert session doc │
     │                      │                        ├────────────────────►│
     │                      │                        │    ◄────────────────┤
     │                      │  ◄─────────────────────┤                     │
     │  Set-Cookie: session │                        │                     │
     │  ◄───────────────────┤                        │                     │
     │                      │                        │                     │
     │  GET /api/auth/session                        │                     │
     │  Cookie: session     │                        │                     │
     ├─────────────────────►│                        │                     │
     │                      │  Verify session cookie │                     │
     │                      ├───────────────────────►│                     │
     │                      │                        │  Lookup session     │
     │                      │                        ├────────────────────►│
     │                      │                        │    ◄────────────────┤
     │  {user, session}     │                        │                     │
     │  ◄───────────────────┤                        │                     │
     │                      │                        │                     │
```

### 5.3 AI Chat Data Flow

```
┌──────────┐         ┌──────────────┐         ┌─────────────┐
│  Chat    │         │  /api/chat   │         │  Google     │
│  Page    │         │  route.ts    │         │  Gemini API │
└────┬─────┘         └──────┬───────┘         └──────┬──────┘
     │                      │                        │
     │  User types message  │                        │
     │  & presses Send      │                        │
     │                      │                        │
     │  POST /api/chat      │                        │
     │  {                   │                        │
     │    message: "...",   │                        │
     │    history: [...]    │                        │
     │  }                   │                        │
     ├─────────────────────►│                        │
     │                      │                        │
     │                      │  Validate message      │
     │                      │  exists                │
     │                      │                        │
     │                      │  Format history:       │
     │                      │  - Filter valid msgs   │
     │                      │  - Map roles:          │
     │                      │    user → user         │
     │                      │    assistant → model   │
     │                      │  - Ensure first msg    │
     │                      │    is from user        │
     │                      │                        │
     │                      │  startChat({           │
     │                      │    history,            │
     │                      │    systemInstruction,  │
     │                      │    temperature: 0.7,   │
     │                      │    maxTokens: 1000     │
     │                      │  })                    │
     │                      ├───────────────────────►│
     │                      │                        │
     │                      │  AI generates          │
     │                      │  empathetic response   │
     │                      │                        │
     │                      │  { response: "..." }   │
     │                      │◄───────────────────────┤
     │                      │                        │
     │  { response: "..." } │                        │
     │◄─────────────────────┤                        │
     │                      │                        │
     │  Display AI message  │                        │
     │  in chat bubble      │                        │
     │                      │                        │

   ┌──────────────────────────────────────────────────┐
   │  NOTE: Chat history is stored in React state     │
   │  only (client memory). It is NOT persisted to    │
   │  the database. Refreshing the page resets chat.  │
   └──────────────────────────────────────────────────┘
```

### 5.4 Mood Tracking Data Flow

```
┌──────────┐         ┌──────────────┐         ┌──────────┐         ┌──────────┐
│Dashboard │         │  /api/mood   │         │  auth.ts  │         │ MongoDB  │
│  Page    │         │  route.ts    │         │(session)  │         │  Atlas   │
└────┬─────┘         └──────┬───────┘         └────┬─────┘         └────┬─────┘
     │                      │                      │                    │
     │  ══════ SAVE MOOD (POST) ═══════            │                    │
     │                      │                      │                    │
     │  User adjusts slider │                      │                    │
     │  (1-10) and adds     │                      │                    │
     │  optional note       │                      │                    │
     │                      │                      │                    │
     │  POST /api/mood      │                      │                    │
     │  {mood: 7, note:""}  │                      │                    │
     ├─────────────────────►│                      │                    │
     │                      │  Verify session      │                    │
     │                      ├─────────────────────►│                    │
     │                      │  {user.id}           │                    │
     │                      │◄─────────────────────┤                    │
     │                      │                      │                    │
     │                      │  connectDB()         │                    │
     │                      │  MoodEntry.create({  │                    │
     │                      │    userId,           │                    │
     │                      │    mood: 7,          ├───────────────────►│
     │                      │    note: "..."       │   Insert document  │
     │                      │  })                  │◄──────────────────┤
     │                      │                      │                    │
     │  { _id, mood, note,  │                      │                    │
     │    createdAt, ... }  │                      │                    │
     │◄─────────────────────┤                      │                    │
     │                      │                      │                    │
     │  ══════ LOAD MOODS (GET) ═══════            │                    │
     │                      │                      │                    │
     │  GET /api/mood       │                      │                    │
     ├─────────────────────►│                      │                    │
     │                      │  Verify session      │                    │
     │                      ├─────────────────────►│                    │
     │                      │  {user.id}           │                    │
     │                      │◄─────────────────────┤                    │
     │                      │                      │                    │
     │                      │  MoodEntry.find({userId})                 │
     │                      │  .sort({createdAt: -1})                   │
     │                      │  .limit(30)          │                    │
     │                      ├──────────────────────────────────────────►│
     │                      │                      │   Return docs      │
     │                      │◄─────────────────────────────────────────┤
     │                      │                      │                    │
     │  [ {mood entries} ]  │                      │                    │
     │◄─────────────────────┤                      │                    │
     │                      │                      │                    │
     │  Display in:         │                      │                    │
     │  - Mood Score card   │                      │                    │
     │  - Recent Activity   │                      │                    │
     │    list              │                      │                    │
```

### 5.5 Video Call Data Flow (P2P via PeerJS)

```
┌────────────┐         ┌──────────────┐         ┌────────────┐
│  User A    │         │   PeerJS     │         │  User B    │
│  Browser   │         │   Server     │         │  Browser   │
└─────┬──────┘         └──────┬───────┘         └─────┬──────┘
      │                       │                       │
      │  1. new Peer()        │                       │
      ├──────────────────────►│                       │
      │  peer.on('open')      │                       │
      │  Receive: peerId_A    │                       │
      │◄──────────────────────┤                       │
      │                       │                       │
      │  2. getUserMedia()    │                       │
      │  (camera + mic)      │                       │
      │  Show local video    │                       │
      │                       │         new Peer()    │
      │                       │◄──────────────────────┤
      │                       │  Receive: peerId_B    │
      │                       ├──────────────────────►│
      │                       │                       │
      │  ════════════════════════════════════════════  │
      │       User A shares peerId_A with User B      │
      │           (copy/paste outside app)             │
      │  ════════════════════════════════════════════  │
      │                       │                       │
      │  3. peer.call(        │                       │
      │     peerId_B,         │                       │
      │     localStream)      │                       │
      ├──────────────────────►│                       │
      │                       │  Incoming call signal │
      │                       ├──────────────────────►│
      │                       │                       │
      │                       │  4. call.answer(      │
      │                       │     localStream)      │
      │                       │◄──────────────────────┤
      │                       │                       │
      │  5. P2P Connection Established (WebRTC)       │
      │◄─────────────────────────────────────────────►│
      │                       │                       │
      │     Direct video/audio streaming              │
      │◄════════════════════════════════════════════►│
      │        (bypasses server after setup)           │
      │                       │                       │
      │  Controls:            │         Controls:     │
      │  - Mute/Unmute        │         - Mute/Unmute │
      │  - Video On/Off       │         - Video On/Off│
      │  - End Call            │         - End Call    │
      │                       │                       │

   ┌──────────────────────────────────────────────────┐
   │  NOTE: After the initial signaling through the   │
   │  PeerJS server, all video/audio data flows       │
   │  directly between browsers (P2P). The server     │
   │  is NOT involved in the media streaming.         │
   └──────────────────────────────────────────────────┘
```

---

## 6. Authentication System

### Overview

Authentication is handled by **Better Auth** with MongoDB as the backing store.

### Configuration (src/lib/auth.ts)

| Setting                  | Value                | Description                              |
| ------------------------ | -------------------- | ---------------------------------------- |
| Email/Password           | Enabled              | Primary auth method                      |
| Email Verification       | Disabled             | No email confirmation required           |
| Session Expiry           | 7 days               | Auto-expire after 7 days                 |
| Session Update Age       | 1 day                | Refresh session token daily              |
| Cookie Cache             | 5 minutes            | Client-side session cache duration       |
| Cookie Type              | HTTP-only             | XSS-protected session cookies            |

### Session Lifecycle

```
Sign In/Up ──► Create Session (MongoDB) ──► Set HTTP-only Cookie
                                                    │
                                    ┌───────────────┘
                                    ▼
                            Browser stores cookie
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
              Page request    API request     After 24 hours
              (auto-sent)    (auto-sent)     session refreshes
                    │               │               │
                    ▼               ▼               ▼
              Verify via      Verify via      New token issued
              getSession()   getSession()     (same session)
                                                    │
                                              After 7 days
                                                    │
                                                    ▼
                                            Session expires
                                            Redirect to /sign-in
```

### Client-Side Usage (src/lib/auth-client.ts)

```typescript
import { authClient } from '@/lib/auth-client';

// Sign up
await authClient.signUp.email({ name, email, password });

// Sign in
await authClient.signIn.email({ email, password });

// Get session
const { data } = await authClient.getSession();
// data.session → session info
// data.user → user info (name, email, id)

// Sign out
await authClient.signOut();
```

### Auto-Created MongoDB Collections

Better Auth automatically manages these collections:

| Collection      | Purpose                              |
| --------------- | ------------------------------------ |
| `users`         | User accounts (id, name, email)      |
| `sessions`      | Active sessions with expiry          |
| `accounts`      | Auth provider links                  |
| `verifications` | Email verification tokens            |

---

## 7. AI Chat System

### How It Works

```
┌─────────────────────────────────────────────────────┐
│                    ai.ts Module                      │
│                                                     │
│  System Prompt (persona definition)                 │
│  ┌───────────────────────────────────────────────┐  │
│  │ "You are MindWell, a compassionate AI mental  │  │
│  │  health companion. Your role is to:           │  │
│  │  - Listen empathetically                      │  │
│  │  - Provide emotional support                  │  │
│  │  - Offer coping strategies                    │  │
│  │  - Never diagnose or replace professional     │  │
│  │  - Be warm, understanding, non-judgmental"    │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  Model Config                                       │
│  ┌───────────────────────────┐                      │
│  │ Model: gemini-2.5-flash   │                      │
│  │ Temperature: 0.7          │                      │
│  │ Max Tokens: 1000          │                      │
│  └───────────────────────────┘                      │
│                                                     │
│  History Processing                                 │
│  ┌───────────────────────────────────────────────┐  │
│  │ 1. Filter out empty messages                  │  │
│  │ 2. Map roles: assistant → model               │  │
│  │ 3. Remove leading "model" messages            │  │
│  │ 4. Pass to Gemini startChat()                 │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Chat Message Lifecycle

```
User types message
        │
        ▼
┌─────────────────┐
│ Add to local    │     Messages are stored in
│ React state     │◄─── React useState only
│ (messages[])    │     (client-side memory)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ POST /api/chat  │
│ Send message +  │
│ full history    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Gemini receives │
│ system prompt + │
│ conversation    │
│ history + new   │
│ message         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ AI response     │
│ added to local  │
│ state           │
└────────┬────────┘
         │
         ▼
  Chat UI re-renders
  with new message
```

---

## 8. Mood Tracking System

### Mood Entry Flow

```
Dashboard Page
       │
       ├── On Load: GET /api/mood
       │   └── Fetches last 30 entries (sorted newest first)
       │       └── Displayed in "Recent Activity" section
       │
       └── MoodTracker Component
           │
           ├── Slider: mood value (1 to 10)
           │   └── Labels: "Struggling" ◄──────► "Great"
           │
           ├── Textarea: optional note
           │
           └── Submit: POST /api/mood
               ├── Requires authentication
               ├── Saves {userId, mood, note} to MongoDB
               └── On success: refetches mood list
```

### Data Stored Per Entry

```
┌─────────────────────────────────────┐
│           MoodEntry Document        │
├─────────────────────────────────────┤
│  _id        │  ObjectId (auto)      │
│  userId     │  String (from session)│
│  mood       │  Number (1-10)        │
│  note       │  String (optional)    │
│  createdAt  │  Date (auto)          │
│  updatedAt  │  Date (auto)          │
└─────────────────────────────────────┘
```

---

## 9. Video Call System

### Technology: PeerJS (WebRTC wrapper)

PeerJS simplifies WebRTC by handling signaling, NAT traversal, and connection setup. After the initial handshake via the PeerJS cloud server, all media streams directly between the two browsers.

### Connection Steps

```
Step 1: Initialize
   ├── Request camera + microphone permissions
   ├── Create PeerJS instance
   └── Receive unique Peer ID from PeerJS server

Step 2: Share ID
   ├── User copies their Peer ID
   └── Shares it with the other person (outside the app)

Step 3: Call
   ├── Enter the other person's Peer ID
   ├── Click "Call" button
   └── PeerJS signals the other peer

Step 4: Answer
   ├── Receiving peer gets 'call' event
   ├── Auto-answers with their local stream
   └── Both peers exchange media streams

Step 5: Connected
   ├── Direct P2P video/audio streaming
   ├── Controls: mute, camera toggle, end call
   └── Server is no longer involved
```

### Media Controls

| Control        | Action                                      |
| -------------- | ------------------------------------------- |
| Mute/Unmute    | Toggles `audioTrack.enabled`                |
| Video On/Off   | Toggles `videoTrack.enabled`                |
| End Call       | Closes connection, resets remote video      |
| Copy ID        | Copies Peer ID to clipboard                |

---

## 10. Database Schemas

### MongoDB Collections

```
┌─────────────────────────────────────────────────────────────┐
│                      MongoDB Atlas                          │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │     users       │  │    sessions     │                  │
│  │  (Better Auth)  │  │  (Better Auth)  │                  │
│  ├─────────────────┤  ├─────────────────┤                  │
│  │ _id             │  │ _id             │                  │
│  │ name            │  │ userId          │                  │
│  │ email           │  │ token           │                  │
│  │ emailVerified   │  │ expiresAt       │                  │
│  │ image           │  │ ipAddress       │                  │
│  │ createdAt       │  │ userAgent       │                  │
│  │ updatedAt       │  │ createdAt       │                  │
│  └─────────────────┘  │ updatedAt       │                  │
│                       └─────────────────┘                  │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │   moodentries   │  │    messages     │                  │
│  │  (Mongoose)     │  │  (Mongoose)     │                  │
│  ├─────────────────┤  ├─────────────────┤                  │
│  │ _id             │  │ _id             │                  │
│  │ userId (String) │  │ userId (String) │                  │
│  │ mood (1-10)     │  │ role (user/     │                  │
│  │ note (String?)  │  │   assistant)    │                  │
│  │ createdAt       │  │ content (String)│                  │
│  │ updatedAt       │  │ createdAt       │                  │
│  └─────────────────┘  │ updatedAt       │                  │
│                       └─────────────────┘                  │
│                                                             │
│  NOTE: "messages" schema is defined but not currently       │
│  used by any API route. Chat history lives in client only.  │
└─────────────────────────────────────────────────────────────┘
```

---

## 11. API Reference

### POST /api/auth/[...all]

Better Auth catch-all handler. Manages all authentication endpoints automatically.

**Key sub-routes handled internally:**
- `POST /api/auth/sign-up/email` - Create account
- `POST /api/auth/sign-in/email` - Sign in
- `POST /api/auth/sign-out` - Sign out
- `GET /api/auth/get-session` - Get current session

---

### POST /api/auth/refresh-session

Refresh and validate the current session.

**Headers:** Cookie (session token)

**Response (200):**
```json
{
  "user": { "id": "...", "name": "...", "email": "..." },
  "expiresAt": "2026-03-04T..."
}
```

**Response (401):**
```json
{ "error": "Not authenticated" }
```

---

### POST /api/chat

Send a message to the AI companion.

**Request Body:**
```json
{
  "message": "How are you today?",
  "history": [
    { "role": "assistant", "content": "Hey! I'm MindWell..." },
    { "role": "user", "content": "I'm feeling anxious" },
    { "role": "assistant", "content": "I hear you..." }
  ]
}
```

**Response (200):**
```json
{
  "response": "I'm glad you reached out. Let's talk about what's on your mind..."
}
```

**Response (400):**
```json
{ "error": "Message is required" }
```

---

### GET /api/mood

Fetch the authenticated user's mood history.

**Headers:** Cookie (session token)

**Response (200):**
```json
[
  {
    "_id": "65a1b2c3...",
    "userId": "user_123",
    "mood": 7,
    "note": "Feeling good today",
    "createdAt": "2026-02-25T10:30:00Z",
    "updatedAt": "2026-02-25T10:30:00Z"
  }
]
```
Returns up to 30 entries, sorted newest first.

---

### POST /api/mood

Create a new mood entry.

**Headers:** Cookie (session token)

**Request Body:**
```json
{
  "mood": 8,
  "note": "Had a great morning walk"
}
```

**Response (200):**
```json
{
  "_id": "65a1b2c3...",
  "userId": "user_123",
  "mood": 8,
  "note": "Had a great morning walk",
  "createdAt": "2026-02-25T14:00:00Z",
  "updatedAt": "2026-02-25T14:00:00Z"
}
```

**Response (401):**
```json
{ "error": "Unauthorized" }
```

---

## 12. Frontend Pages & Components

### Page Map

```
┌─────────────────────────────────────────────────────────────┐
│                        PAGES                                │
│                                                             │
│  PUBLIC PAGES (no auth required)                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  /           Landing page with hero + feature cards  │   │
│  │  /sign-in    Email + password login form             │   │
│  │  /sign-up    Name + email + password register form   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  PROTECTED PAGES (redirect to /sign-in if no session)       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  /dashboard  Mood tracker + feature cards + activity │   │
│  │  /chat       Full-screen AI chat interface           │   │
│  │  /video      P2P video call with PeerJS              │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  SHARED LAYOUT COMPONENTS                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Sidebar     Navigation (Dashboard, Chat, Video,     │   │
│  │              Sign Out) - used on dashboard/chat/video │   │
│  │  ThemeProvider  Dark/light theme context wrapper      │   │
│  │  ThemeToggle    Theme switch button                   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Sidebar Layout (Dashboard, Chat, Video)

```
┌──────────────────┬──────────────────────────────────────┐
│                  │                                      │
│   MindWell Logo  │  Header (welcome / page title)       │
│                  ├──────────────────────────────────────┤
│  ┌────────────┐  │                                      │
│  │ Dashboard  │  │                                      │
│  ├────────────┤  │                                      │
│  │ AI Chat    │  │        Main Content Area             │
│  ├────────────┤  │                                      │
│  │ Video      │  │   (varies by page: dashboard grid,   │
│  │ Session    │  │    chat messages, or video feed)      │
│  └────────────┘  │                                      │
│                  │                                      │
│                  │                                      │
│  ┌────────────┐  │                                      │
│  │ User Info  │  │                                      │
│  ├────────────┤  │                                      │
│  │ Sign Out   │  │                                      │
│  └────────────┘  │                                      │
│                  │                                      │
│   w-64 (256px)   │  Remaining width (pl-64 offset)      │
└──────────────────┴──────────────────────────────────────┘

On mobile (< 768px): Sidebar hidden, hamburger menu toggles overlay
```

### Dashboard Grid Layout

```
┌──────────────────────────────────────────────────────┐
│  Your Dashboard                                      │
│  Track your wellness journey                         │
│                                                      │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐  │
│  │ 💬 AI Chat   │ │ 📹 Video     │ │ 📈 Mood      │  │
│  │              │ │    Session   │ │    Score     │  │
│  │ Talk to AI → │ │ Face-to- →  │ │ Latest: 7/10 │  │
│  │    companion │ │   face AI   │ │              │  │
│  └──────────────┘ └──────────────┘ └──────────────┘  │
│                                                      │
│  ┌────────────────────┐ ┌────────────────────┐       │
│  │ Quick Mood         │ │ Recent Activity    │       │
│  │ Check-in           │ │                    │       │
│  │                    │ │ Mood: 7/10 - note  │       │
│  │ [━━━━━━●━━━] 7/10  │ │ Mood: 5/10 - note  │       │
│  │                    │ │ Mood: 8/10 - note  │       │
│  │ [  Note text...  ] │ │ ...                │       │
│  │                    │ │                    │       │
│  │ [  Save Check-in ] │ │                    │       │
│  └────────────────────┘ └────────────────────┘       │
│                                                      │
│  Top: grid-cols-3 (sm:2, lg:3)                       │
│  Bottom: grid-cols-2 (lg:2, stacked on mobile)       │
└──────────────────────────────────────────────────────┘
```

---

## 13. Environment Variables

| Variable                  | Required | Description                              |
| ------------------------- | -------- | ---------------------------------------- |
| `MONGODB_URI`             | Yes      | MongoDB Atlas connection string          |
| `GEMINI_API_KEY`          | Yes      | Google Generative AI API key             |
| `BETTER_AUTH_SECRET`      | Yes      | Secret for signing session tokens        |
| `BETTER_AUTH_URL`         | Yes      | Trusted origin URL (e.g. http://localhost:3000) |
| `NEXT_PUBLIC_SOCKET_URL`  | No       | Public API base URL (defaults to localhost:3000) |

---

## 14. Setup & Running

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key

### Installation

```bash
# Clone and install
git clone <repo-url>
cd mindwell-ai
npm install

# Create .env file with required variables
cp .env.example .env
# Edit .env with your values

# Run development server
npm run dev
# Open http://localhost:3000

# Build for production
npm run build
npm start
```

### Available Scripts

| Command         | Description                    |
| --------------- | ------------------------------ |
| `npm run dev`   | Start dev server (hot reload)  |
| `npm run build` | Production build               |
| `npm start`     | Start production server        |
| `npm run lint`  | Run ESLint                     |
