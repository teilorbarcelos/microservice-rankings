import { Document } from 'mongoose';
import { ChallengeStatus } from './challenge-status.enum';

export interface Challenge extends Document {
  date: Date;
  status: ChallengeStatus;
  solicitationDate: Date;
  answerDate: Date;
  challenger: string;
  category: string;
  players: string[];
  play?: string;
}
