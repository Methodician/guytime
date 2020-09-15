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
    this.authSvc.authInfo$.subscribe(info => (this.loggedInUid = info.uid));

    const userRef$ = this.getUserObservable(this.chatMessage.senderId);
    userRef$.subscribe(user => {
      this.user$.next(user);
      const uid = this.user$.value.uid;
      this.userSvc
        .getAvatarUrl(uid)
        .subscribe(url => this.avatarUrl$.next(url));
    });
  }

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
