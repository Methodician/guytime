import { firestore } from 'firebase';
import { KeyMapI } from './shared';

// export interface ChatGroupI {
//   id?: string;
//   name?: string;
//   participantIds: string[];
//   createdAt: firestore.FieldValue | firestore.Timestamp;
// }

export interface ChatGroupI {
  id?: string;
  name?: string;
  participantIds: KeyMapI<boolean>;
  createdAt: firestore.FieldValue | firestore.Timestamp;
}
