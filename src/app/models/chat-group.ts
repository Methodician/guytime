import { KeyMapI } from './shared';

export interface ChatGroupI {
  id?: string;
  name?: string;
  latestMessage?: LatestGroupMessageI;
  participantsMap: KeyMapI<boolean>;
  unreadMessagesByUser: KeyMapI<KeyMapI<boolean>>;
  isPairChat: boolean;
  createdAt: any;
}

export interface LatestGroupMessageI {
  fName: string;
  lName: string;
  content: string;
  messageId: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}
