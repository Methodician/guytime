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

@Component({
  selector: 'gtm-chat-group',
  templateUrl: './chat-group.component.html',
  styleUrls: ['./chat-group.component.scss'],
})
export class ChatGroupComponent implements OnInit, OnDestroy {
  @Input() group: ChatGroupI;

  private unsubscribe$: Subject<void> = new Subject();

  users$: Observable<UserI[]>;
  firstNames: string;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.watchChatUsers();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  watchChatUsers = async () => {
    const users$ = this.store.select(
      userListByIdMap(this.group.participantsMap),
    );
    this.users$ = users$;

    users$
      .pipe(
        takeUntil(this.unsubscribe$),
        map(users => users.map(user => user.fName)),
      )
      .subscribe(names => (this.firstNames = names.join(', ')));
  }

  // Helpers
  avatarFileName$ = (uid: string) =>
    this.store.select(avatarFileName(uid, '45x45'))
}
