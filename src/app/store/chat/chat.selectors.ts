import { createFeatureSelector, createSelector } from '@ngrx/store';
import { chatFeatureKey, ChatStateI }            from './chat.reducer';

export const chatState = createFeatureSelector<ChatStateI>(chatFeatureKey);

export const openChatGroups = createSelector(
  chatState,
  state => state.chatGroups,
);

export const unreadMessageCountByChatGroup = (chatGroupId: string) =>
  createSelector(chatState, state => state.unreadMessageCountMap[chatGroupId]);

export const chatGroupById = ( chatGroupId: string ) =>
  createSelector(chatState, state => state.chatGroups.find(( group ) => group.id === chatGroupId));

export const unreadMessagesCountForUser = createSelector(chatState, state => {
  const { unreadMessages } = state;

  if (!unreadMessages) {
    return 0;
  }

  return Object.keys(unreadMessages).length;
});

export const chatMessages = createSelector(
  chatState,
  state => state.chatMessages,
);
