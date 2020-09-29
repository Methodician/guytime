import { KeyMapI } from './shared';

export interface MessageI {
  id?: string;
  chatGroupId: string;
  senderId: string;
  content: string;
  createdAt: any;
  seenBy: KeyMapI<boolean>;
}
