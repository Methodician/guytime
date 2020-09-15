//import { firestore } from 'firebase';
export interface MessageI {
  id?: string;
  chatGroupId: string;
  senderId: string;
  content: string;
  createdAt: any;
  // createdAt: firestore.FieldValue | firestore.Timestamp;
}
