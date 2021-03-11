import { ChatGroupI } from '@app/models/chat-group';
import { ChatMessageI } from '@app/models/message';
import { KeyMapI } from '@app/models/shared';
import { createAction, props } from '@ngrx/store';

export const loadChatGroups = createAction('[Chat] Load Chat Groups');

export const loadChatGroupsSuccess = createAction(
  '[Chat] Load Chat Groups Success',
  props<{ chatGroups: ChatGroupI[] }>(),
);

export const loadChatGroupsFailure = createAction(
  '[Chat] Load Chat Groups Failure',
  props<{ error: any }>(),
);

export const createUnreadMessageCountMapSuccess = createAction(
  '[Chat] Badge Map Successfully Generated',
  props<{ unreadMessageCountMap: KeyMapI<number> }>(),
);

export const loadUserUnreadMessages = createAction(
  "[Chat] Load logged in user's unread messages",
);

export const loadUserUnreadMessagesSuccess = createAction(
  '[Chat] Successfully loaded unread messages for user',
  props<{ unreadMessages: KeyMapI<boolean> }>(),
);

export const loadUserUnreadMessagesFailure = createAction(
  '[Chat] Failed to load unread messages for user',
  props<{ error: any }>(),
);

export const loadChatMessages = createAction(
  '[Chat] Load Chat Messages',
  props<{ chatGroupId: string }>(),
);

export const loadChatMessagesSuccess = createAction(
  '[Chat] Load Chat Messages Success',
  props<{ chatMessages: ChatMessageI[] }>(),
);

export const loadChatMessagesFailure = createAction(
  '[Chat] Load Chat Messages Failure',
  props<{ error: any }>(),
);
