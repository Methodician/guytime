import { Timestamp } from '@google-cloud/firestore';

export interface MessageI {
  id?: string;
  chatGroupId: string;
  senderId: string;
  content: string;
  createdAt: Timestamp;
}
