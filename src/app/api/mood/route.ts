import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import MoodEntry from '@/models/MoodEntry';

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const { mood, note } = await req.json();
    
    const entry = await MoodEntry.create({
      userId: session.user.id,
      mood,
      note,
    });
    
    return NextResponse.json(entry);
  } catch (error) {
    console.error('Mood entry error:', error);
    return NextResponse.json({ error: 'Failed to save mood' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const entries = await MoodEntry.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(30);
    
    return NextResponse.json(entries);
  } catch (error) {
    console.error('Get mood error:', error);
    return NextResponse.json({ error: 'Failed to get moods' }, { status: 500 });
  }
}
