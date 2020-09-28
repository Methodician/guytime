import { KeyMapI } from './shared';

export interface ChatGroupI {
  id?: string;
  name?: string;
  participantIds: KeyMapI<boolean>;
  unreadMessagesByUser: KeyMapI<KeyMapI<boolean>>;
  isPairChat: boolean;
  createdAt: any;
}
