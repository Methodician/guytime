import { ChatGroupI } from '@app/models/chat-group';
import { createReducer, on } from '@ngrx/store';
import { KeyMapI } from '../../../../functions/src';
import {
  createUnreadMessageCountMapSuccess,
  loadChatGroupsSuccess,
  loadUserUnreadMessagesSuccess,
} from './chat.actions';

export const chatFeatureKey = 'chats';

export interface ChatStateI {
  chatGroups: ReadonlyArray<ChatGroupI>;
  unreadMessageCountMap: KeyMapI<number>;
  unreadMessages: KeyMapI<boolean>;
}

export const initialState: ChatStateI = {
  chatGroups: [],
  unreadMessageCountMap: {},
  unreadMessages: {},
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
);
