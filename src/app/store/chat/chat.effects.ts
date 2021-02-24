import { Injectable } from '@angular/core';
import { ChatService } from '@app/services/chat.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { exhaustMap, map, switchMap, take } from 'rxjs/operators';
import { KeyMapI } from '../../../../functions/src';
import { authUid } from '../auth/auth.selectors';
import {
  createUnreadMessageCountMapSuccess,
  loadChatGroups,
  loadChatGroupsSuccess,
} from './chat.actions';

@Injectable()
export class ChatEffects {
  constructor(
    private store: Store,
    private chatSvc: ChatService,
    private actions$: Actions,
  ) {}

  loadChatGroups$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadChatGroups),
      exhaustMap(_ =>
        this.store.select(authUid).pipe(
          take(1),
          switchMap(loggedInUid => this.chatSvc.watchChatsByUser$(loggedInUid)),
          map(chatGroups => loadChatGroupsSuccess({ chatGroups })),
        ),
      ),
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
    ),
  );
}
