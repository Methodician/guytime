import { firestore } from 'firebase';

export interface ChatGroupI {
  id?: string;
  name?: string;
  participantIds: string[];
  createdAt: firestore.FieldValue | firestore.Timestamp;
}
