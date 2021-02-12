import { Component, OnInit, Input } from '@angular/core';
import { MessageI } from '@models/message';
import { UserService } from '@services/user.service';
import { ProfileImageSizeT, UserI } from '@models/user';
import { Subject, BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { ChatService } from '@app/services/chat.service';
import { Store } from '@ngrx/store';
import { authUid } from '@app/auth/auth.selectors';

@Component({
  selector: 'gtm-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss'],
})
export class ChatMessageComponent implements OnInit {
  private unsubscribe$: Subject<void> = new Subject();
  @Input() chatMessage: MessageI;

  user$ = new BehaviorSubject<UserI>(null);
  loggedInUid: string;

  avatarSize: ProfileImageSizeT = '45x45';

  constructor(
    private userSvc: UserService,
    private chatSvc: ChatService,
    private store: Store,
  ) {}

  ngOnInit(): void {
    this.store
      .select(authUid)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(uid => (this.loggedInUid = uid));
    this.getUserObservable(this.chatMessage.senderId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(user => {
        this.user$.next(user);
      });

    if (!this.wasMessageSeen()) {
      setTimeout(() => this.setAsSeen(), 5000);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getUserObservable = (uid: string) =>
    this.userSvc
      .userRef(uid)
      .valueChanges()
      .pipe(
        map(user => ({ ...(user as object), uid })),
        takeUntil(this.unsubscribe$),
      ) as Observable<UserI>;

  wasMessageSeen = () =>
    !!this.chatMessage.seenBy && this.chatMessage.seenBy[this.loggedInUid];

  setAsSeen = () => {
    const wasAuthor = this.loggedInUid === this.chatMessage.senderId;
    if (!wasAuthor)
      this.chatSvc.setMessageAsSeenBy(this.loggedInUid, this.chatMessage.id);
  };

  avatarFileName = () =>
    this.user$.value &&
    this.user$.value.uploadedProfileImageMap &&
    this.user$.value.uploadedProfileImageMap[this.avatarSize] &&
    this.user$.value.uploadedProfileImageMap[this.avatarSize].fileName;
}
