import { Timestamp } from '@google-cloud/firestore';

export interface MessageI {
  chatGroupId: string;
  senderId: string;
  content: string;
  createdAt: Timestamp;
}
