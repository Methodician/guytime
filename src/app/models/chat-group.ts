import { Timestamp } from '@google-cloud/firestore';
import { IMessage } from './message';

export interface IChatGroup {
  participantIds: string[];
  messages: IMessage[];
  name?: string;
  createdAt: Timestamp;
}
