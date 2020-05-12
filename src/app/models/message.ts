import { Timestamp } from '@google-cloud/firestore';

export interface Message {
  senderId: string;
  content: string;
  createdAt: Timestamp;
}
