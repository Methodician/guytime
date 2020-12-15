import { Component, OnInit, Input } from '@angular/core';
import { MessageI } from '@models/message';
import { UserService } from '@services/user.service';
import { AuthService } from '@services/auth.service';
import { ProfileImageSizeT, UserI } from '@models/user';
import { Subject, BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { ChatService } from '@app/services/chat.service';

@Component({
  selector: 'gtm-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss'],
})
export class ChatMessageComponent implements OnInit {
  private unsubscribe$: Subject<void> = new Subject();
  @Input() chatMessage: MessageI;

  user$ = new BehaviorSubject<UserI>(null);
  avatarUrl$ = new BehaviorSubject<string>('assets/icons/square_icon.svg');
  loggedInUid: string;

  avatarSize: ProfileImageSizeT = '45x45';

  constructor(
    private userSvc: UserService,
    private authSvc: AuthService,
    private chatSvc: ChatService,
  ) {}

  ngOnInit(): void {
    this.authSvc.authInfo$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(info => (this.loggedInUid = info.uid));
    this.getUserObservable(this.chatMessage.senderId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(user => {
        this.user$.next(user);
        if (
          user &&
          user.uploadedProfileImageMap &&
          user.uploadedProfileImageMap['45x45']
        ) {
          this.userSvc
            .getAvatarUrl(
              user.uploadedProfileImageMap['45x45'].fileName,
              '45x45',
            )
            .subscribe(avatarUrl => this.avatarUrl$.next(avatarUrl));
        }
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
    !!this.chatMessage.seenBy &&
    this.chatMessage.seenBy[this.authSvc.authInfo$.value.uid];

  setAsSeen = () => {
    const loggedInUid = this.authSvc.authInfo$.value.uid;
    const wasAuthor = loggedInUid === this.chatMessage.senderId;
    if (!wasAuthor)
      this.chatSvc.setMessageAsSeenBy(loggedInUid, this.chatMessage.id);
  };

  avatarFileName = () =>
    this.user$.value &&
    this.user$.value.uploadedProfileImageMap &&
    this.user$.value.uploadedProfileImageMap[this.avatarSize].fileName;
}
