import { Timestamp } from '@google-cloud/firestore';
import { MessageI } from './message';

export interface ChatGroupI {
  participantIds: string[];
  name?: string;
  createdAt: Timestamp;
}
