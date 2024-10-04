import mongoose, { Schema, Document } from 'mongoose';

export enum DIFFICULTY {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

interface IMatch extends Document {
  userId: string;
  category: string;
  difficulty: DIFFICULTY;
  createdAt: Date;
  isMatched: boolean;
  partnerId?: string;
  categoryAssigned?: string;
  difficultyAssigned?: DIFFICULTY; 
}

const MatchSchema: Schema = new Schema({
  userId: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, enum: DIFFICULTY, required: true },
  createdAt: { type: Date, default: Date.now },
  isMatched: { type: Boolean, default: false },
  partnerId: { type: String, default: null },
  categoryAssigned: {type: String, default: null},
  difficultyAssigned: {type: String, enum: DIFFICULTY, default: null} 
});

export const Match = mongoose.model<IMatch>('Match', MatchSchema);
