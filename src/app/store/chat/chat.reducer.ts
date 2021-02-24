import { ChatGroupI } from '@app/models/chat-group';
import { createReducer, on } from '@ngrx/store';
import { KeyMapI } from '../../../../functions/src';
import {
  createUnreadMessageCountMapSuccess,
  loadChatGroupsSuccess,
} from './chat.actions';

export const chatFeatureKey = 'chats';

export interface ChatStateI {
  chatGroups: ReadonlyArray<ChatGroupI>;
  unreadMessageCountMap: KeyMapI<number>;
}

export const initialState: ChatStateI = {
  chatGroups: [],
  unreadMessageCountMap: {},
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
);
