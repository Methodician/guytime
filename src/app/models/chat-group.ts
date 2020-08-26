import { FieldValue } from '@google-cloud/firestore';

export interface ChatGroupI {
  id?: string;
  name?: string;
  participantIds: string[];
  createdAt: FieldValue;
  //instead of timestamp
}
