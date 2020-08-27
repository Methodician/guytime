import { FieldValue, Timestamp } from '@google-cloud/firestore';

export interface ChatGroupI {
  id?: string;
  name?: string;
  participantIds: string[];
  createdAt: FieldValue | Timestamp;
}
