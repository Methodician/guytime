import { createSelector } from '@ngrx/store';
import { StateI } from '@app/store';

export const openChatGroups = createSelector(
  (state: StateI) => state.chat.chatGroups,
  groups => groups,
);

export const unreadMessageCountByChatGroup = createSelector(
  (state: StateI, groupId: string) => state.chat.unreadMessageCountMap[groupId],
  count => count,
);

export const unreadMessagesCountForUser = createSelector(
  (state: StateI) => state.chat.unreadMessages,
  unreadMessages => Object.keys(unreadMessages).length,
);

export const chatMessages = createSelector(
  (state: StateI) => state.chat.chatMessages,
  chatMessages => chatMessages,
);
