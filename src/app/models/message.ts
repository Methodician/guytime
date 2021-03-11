import { KeyMapI } from './shared';

export interface ChatMessageI {
  id?: string;
  chatGroupId: string;
  senderId: string;
  content: string;
  createdAt: any;
  seenBy: KeyMapI<boolean>;
}
