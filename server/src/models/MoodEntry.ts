import mongoose from 'mongoose';

const moodEntrySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  mood: { type: Number, required: true, min: 1, max: 10 },
  note: { type: String },
}, { timestamps: true });

const MoodEntry = mongoose.models.MoodEntry || mongoose.model('MoodEntry', moodEntrySchema);

export default MoodEntry;
