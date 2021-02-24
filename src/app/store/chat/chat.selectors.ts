import { createSelector } from '@ngrx/store';
import { StateI } from '@app/store';

export const selectOpenChatGroups = createSelector(
  (state: StateI) => state.chats.chatGroups,
  groups => groups,
);

export const selectUnreadMessageCount = createSelector(
  (state: StateI, groupId: string) =>
    state.chats.unreadMessageCountMap[groupId],
  count => count,
);
