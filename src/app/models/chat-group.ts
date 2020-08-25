import { Timestamp } from '@google-cloud/firestore';

export interface ChatGroupI {
  id?: string;
  name?: string;
  participantIds: string[];
  createdAt: Timestamp;
}
