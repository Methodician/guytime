import { firestore } from 'firebase';
import { KeyMapI } from './shared';

export interface ChatGroupI {
  id?: string;
  name?: string;
  participantIds: KeyMapI<boolean>;
  isPairChat: boolean;
  createdAt: firestore.FieldValue | firestore.Timestamp;
}
