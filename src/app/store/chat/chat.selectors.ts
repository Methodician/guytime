import { createSelector } from '@ngrx/store';
import { StateI } from '@app/store';

export const selectOpenChatGroups = createSelector(
  (state: StateI) => state.chats.chatGroups,
  groups => groups,
);

export const selectUnreadMessageCountByChatGroup = createSelector(
  (state: StateI, groupId: string) =>
    state.chats.unreadMessageCountMap[groupId],
  count => count,
);

export const selectUnreadMessagesCountForUser = createSelector(
  (state: StateI) => state.chats.unreadMessages,
  unreadMessages => Object.keys(unreadMessages).length,
);
