import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth.js';
import chatRouter from './routes/chat.js';
import moodRouter from './routes/mood.js';
import aiSessionRouter from './routes/ai-session.js';
import authExtraRouter from './routes/auth.js';

const app = express();
const httpServer = createServer(app);

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const io = new SocketIOServer(httpServer, {
  cors: { origin: CLIENT_URL, credentials: true }
});

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(cookieParser());

// better-auth must be mounted BEFORE express.json() for its routes
app.all('/api/auth/*', toNodeHandler(auth));

app.use(express.json());

// Custom auth routes (refresh-session)
app.use('/api/auth', authExtraRouter);
app.use('/api/chat', chatRouter);
app.use('/api/mood', moodRouter);
app.use('/api/ai-session', aiSessionRouter);

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
