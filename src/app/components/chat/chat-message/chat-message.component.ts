import { Component, OnInit, Input } from '@angular/core';
import { MessageI } from '@models/message';
import { UserService } from '@services/user.service';
import { AuthService } from '@services/auth.service';
import { UserI } from '@models/user';
import { Subject, BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

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

  constructor(private userSvc: UserService, private authSvc: AuthService) {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    const authInfo$ = this.authSvc.authInfo$;
    const user$ = this.getUserObservable(this.chatMessage.senderId);
    const avatarUrl$ = this.userSvc
      .getAvatarUrl(this.chatMessage.senderId)
      .pipe(takeUntil(this.unsubscribe$));

    combineLatest([user$, avatarUrl$, authInfo$])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(([user, avatarUrl, authInfo]) => {
        this.user$.next(user);
        this.avatarUrl$.next(avatarUrl);
        this.loggedInUid = authInfo.uid;
      });
  }

  getUserObservable = (uid: string) =>
    this.userSvc
      .userRef(uid)
      .valueChanges()
      .pipe(
        map(user => ({ ...(user as object), uid })),
        takeUntil(this.unsubscribe$),
      ) as Observable<UserI>;
}
