import { Injectable } from '@angular/core';
import { ChatService } from '@app/services/chat.service';
import { UserService } from '@app/services/user.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store }                                                   from '@ngrx/store';
import { catchError, exhaustMap, map, switchMap, take, takeUntil } from 'rxjs/operators';
import { of }                                                      from 'rxjs';
import { KeyMapI } from '../../../../functions/src';
import { authUid } from '../auth/auth.selectors';
import {
  createUnreadMessageCountMapSuccess,
  loadChatGroups,
  loadChatGroupsFailure,
  loadChatGroupsSuccess,
  loadChatMessages,
  loadChatMessagesFailure,
  loadChatMessagesSuccess,
  loadUserUnreadMessages,
  loadUserUnreadMessagesFailure,
  loadUserUnreadMessagesSuccess,
}                        from './chat.actions';
import { logoutSuccess } from '@app/store/auth/auth.actions'

@Injectable()
export class ChatEffects {
  constructor(
    private store: Store,
    private chatSvc: ChatService,
    private userSvc: UserService,
    private actions$: Actions,
  ) {}

  loadChatGroups$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadChatGroups),
      exhaustMap(() =>
        this.store.select(authUid).pipe(
          // take(1),
          switchMap(loggedInUid => {
            return this.chatSvc.watchChatsByUser$(loggedInUid)
          }),

        )
      ),
      map(chatGroups => {
        return loadChatGroupsSuccess({chatGroups})
      }),
      catchError(error => of(loadChatGroupsFailure({ error }))),
    ),
  );

  loadUnreadMessageCountMap$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadChatGroupsSuccess),
      exhaustMap(({ chatGroups }) =>
        this.store.select(authUid).pipe(
          take(1),
          map(loggedInUid => {
            const newUnreadMessageCountMap: KeyMapI<number> = {};
            for (let group of chatGroups) {
              if (!group.unreadMessagesByUser) continue;
              const unreadMessageList = group.unreadMessagesByUser[loggedInUid];
              const unreadCount = unreadMessageList
                ? Object.keys(unreadMessageList).length
                : 0;
              newUnreadMessageCountMap[group.id] = unreadCount;
            }
            return newUnreadMessageCountMap;
          }),
        ),
      ),
      map(unreadMessageCountMap =>
        createUnreadMessageCountMapSuccess({ unreadMessageCountMap }),
      ),
      catchError(error => of(loadUserUnreadMessagesFailure({ error }))),
    ),
  );

  loadUsersUnreadMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUserUnreadMessages),
      exhaustMap(() =>
        this.store.select(authUid).pipe(
          switchMap(loggedInUid =>
            this.userSvc.unreadMessagesDoc(loggedInUid).valueChanges(),
          ),
          map(unreadMessages =>
            loadUserUnreadMessagesSuccess({ unreadMessages }),
          ),
        ),
      ),
      catchError(error => of(loadUserUnreadMessagesFailure({ error }))),
    ),
  );

  loadChatMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadChatMessages),
      switchMap(action =>
        this.chatSvc
          .chatMessagesByGroupQuery(action.chatGroupId)
          .valueChanges({ idField: 'id' }),
      ),
      map(chatMessages => loadChatMessagesSuccess({ chatMessages })),
      catchError(error => of(loadChatMessagesFailure({ error }))),
    ),
  );
}
