import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ChatGroupI }                          from '@app/models/chat-group';
import { UserI } from '@app/models/user';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import {
  avatarFileName,
} from '@app/store/user/user.selectors';
import * as dayjs from 'dayjs';
import * as relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

@Component({
  selector: 'gtm-chat-group-avatar',
  templateUrl: './chat-group-avatar.component.html',
  styleUrls: ['./chat-group-avatar.component.scss'],
})
export class ChatGroupAvatarComponent implements OnInit, OnDestroy {
  @Input() group: ChatGroupI;

  private unsubscribe$: Subject<void> = new Subject();

  users$: Observable<UserI[]>;

  constructor(private store: Store) {}

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }



  // Helpers
  avatarFileName$ = (uid: string) =>
    this.store.select(avatarFileName(uid, '45x45'))
}
