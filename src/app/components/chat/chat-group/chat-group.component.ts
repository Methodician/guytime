import { Component, Input, OnInit } from '@angular/core';
import { authUid } from '@app/store/auth/auth.selectors';
import { ChatGroupI } from '@app/models/chat-group';
import { UserI } from '@app/models/user';
import { UserService } from '@app/services/user.service';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'gtm-chat-group',
  templateUrl: './chat-group.component.html',
  styleUrls: ['./chat-group.component.scss'],
})
export class ChatGroupComponent implements OnInit {
  @Input() group: ChatGroupI;
  private unsubscribe$: Subject<void> = new Subject();
  users$: Observable<UserI[]>;
  firstNames: string;

  constructor(private userSvc: UserService, private store: Store) {}

  ngOnInit(): void {
    this.watchChatUsers();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  watchChatUsers = async () => {
    const uid = await this.store.select(authUid).pipe(take(1)).toPromise(),
      userIds = Object.keys(this.group.participantsMap),
      filteredIds = userIds.filter(id => id !== uid);
    const userObservables = filteredIds.map(uid => this.getUserObservable(uid));

    const users$ = combineLatest(userObservables);
    this.users$ = users$;
    const firstNames$ = users$.pipe(
      map(users => users.map(user => user.fName)),
    );
    firstNames$.subscribe(names => (this.firstNames = names.join(', ')));
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

  // Helpers
  avatarFileName = (user: UserI) =>
    user?.uploadedProfileImageMap?.['45x45'].fileName;
}
