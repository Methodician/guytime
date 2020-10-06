import { KeyMapI } from './shared';

export interface ChatGroupI {
  id?: string;
  name?: string;
  participantsMap: KeyMapI<boolean>;
  unreadMessagesByUser: KeyMapI<KeyMapI<boolean>>;
  isPairChat: boolean;
  createdAt: any;
}
