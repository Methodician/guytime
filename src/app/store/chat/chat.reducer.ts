import { ChatGroupI } from '@app/models/chat-group';
import { ChatMessageI } from '@app/models/message';
import { createReducer, on } from '@ngrx/store';
import { KeyMapI } from '../../../../functions/src';
import {
  createUnreadMessageCountMapSuccess,
  loadChatGroupsSuccess,
  loadChatMessagesSuccess,
  loadUserUnreadMessagesSuccess,
} from './chat.actions';

export const chatFeatureKey = 'chat';

export interface ChatStateI {
  chatGroups: ReadonlyArray<ChatGroupI>;
  unreadMessageCountMap: KeyMapI<number>;
  unreadMessages: KeyMapI<boolean>;
  chatMessages: ReadonlyArray<ChatMessageI>;
}

export const initialState: ChatStateI = {
  chatGroups: [],
  unreadMessageCountMap: {},
  unreadMessages: {},
  chatMessages: [],
};

export const chatReducer = createReducer(
  initialState,
  on(loadChatGroupsSuccess, (state, { chatGroups }) => ({
    ...state,
    chatGroups,
  })),
  on(
    createUnreadMessageCountMapSuccess,
    (state, { unreadMessageCountMap }) => ({
      ...state,
      unreadMessageCountMap,
    }),
  ),
  on(loadUserUnreadMessagesSuccess, (state, { unreadMessages }) => ({
    ...state,
    unreadMessages,
  })),
  on(loadChatMessagesSuccess, (state, { chatMessages }) => ({
    ...state,
    chatMessages,
  })),
);
