import { Timestamp } from '@google-cloud/firestore';
import { Message } from './message';

export interface ChatGroup {
  participantIds: string[];
  messages: Message[];
  name?: string;
  createdAt: Timestamp;
}
