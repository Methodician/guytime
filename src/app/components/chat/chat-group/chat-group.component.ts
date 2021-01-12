import { Component, Input, OnInit } from '@angular/core';
import { ChatGroupI } from '@app/models/chat-group';
import { UserI } from '@app/models/user';
import { AuthService } from '@app/services/auth.service';
import { UserService } from '@app/services/user.service';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'gtm-chat-group',
  templateUrl: './chat-group.component.html',
  styleUrls: ['./chat-group.component.scss'],
})
export class ChatGroupComponent implements OnInit {
  @Input() group: ChatGroupI;
  private unsubscribe$: Subject<void> = new Subject();
  users$: Observable<UserI[]>;

  constructor(private userSvc: UserService, private authSvc: AuthService) {}

  ngOnInit(): void {
    this.watchChatUsers();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  watchChatUsers = () => {
    const userIds = Object.keys(this.group.participantsMap);
    const filteredIds = userIds.filter(
      id => id !== this.authSvc.authInfo$.value.uid,
    );
    const userObservables = filteredIds.map(uid => this.getUserObservable(uid));

    const users$ = combineLatest(userObservables);
    this.users$ = users$;
  };

  getUserObservable = (uid: string) =>
    this.userSvc
      .userRef(uid)
      .valueChanges()
      .pipe(
        map(
          user => ({ ...(user as object), uid }),
          takeUntil(this.unsubscribe$),
        ),
      ) as Observable<UserI>;
}
