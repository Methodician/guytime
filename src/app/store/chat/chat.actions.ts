import { ChatGroupI } from '@app/models/chat-group';
import { KeyMapI } from '@app/models/shared';
import { createAction, props } from '@ngrx/store';

export const loadChatGroups = createAction('[Chat] Load Chats');

export const loadChatGroupsSuccess = createAction(
  '[Chat] Load Chats Success',
  props<{ chatGroups: ChatGroupI[] }>(),
);

export const loadChatGroupsFailure = createAction(
  '[Chat] Load Chats Failure',
  props<{ error: any }>(),
);

export const createUnreadMessageCountMapSuccess = createAction(
  '[Chat] Badge Map Successfully Generated',
  props<{ unreadMessageCountMap: KeyMapI<number> }>(),
);
