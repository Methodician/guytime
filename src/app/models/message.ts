import { Timestamp } from '@google-cloud/firestore';

export interface IMessage {
  chatGroupId: string;
  senderId: string;
  content: string;
  createdAt: Timestamp;
}
