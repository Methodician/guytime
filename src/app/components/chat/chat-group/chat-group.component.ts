import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ChatGroupI }                          from '@app/models/chat-group';
import { UserI } from '@app/models/user';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import {
  avatarFileName,
  userListByIdMap,
} from '@app/store/user/user.selectors';
import * as dayjs from 'dayjs';
import * as relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

@Component({
  selector: 'gtm-chat-group',
  templateUrl: './chat-group.component.html',
  styleUrls: ['./chat-group.component.scss'],
})
export class ChatGroupComponent implements OnInit, OnDestroy {
  @Input() group: ChatGroupI;

  private unsubscribe$: Subject<void> = new Subject();

  users$: Observable<UserI[]>;
  users: UserI[] = [];
  firstNames: string;
  latestMessageCreatedAtString = '';

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.watchChatUsers();
    if (this.group && this.group.latestMessage && this.group.latestMessage && this.group.latestMessage.createdAt) {
      this.latestMessageCreatedAtString = dayjs((this.group.latestMessage.createdAt.seconds * 1000)).format('MM/DD/YY');
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  watchChatUsers = () => {
    const users$ = this.store.select(
      userListByIdMap(this.group.participantsMap),
    );
    this.users$ = users$;

    users$
      .pipe(
        takeUntil(this.unsubscribe$),
        map(users => {
          this.users = users
          return users.map(user => user.fName)
        }),
      )
      .subscribe(names => {
        if (names.length > 2) {
          names = [
            names[0],
            names[1],
            '...'
          ]
        }
        return names.join(', ')
      });
  }

  // Helpers
  avatarFileName$ = (uid: string) =>
    this.store.select(avatarFileName(uid, '45x45'))
}
