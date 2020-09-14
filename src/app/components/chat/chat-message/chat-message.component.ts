import { Component, OnInit, Input } from '@angular/core';
import { MessageI } from '@models/message';
import { UserService } from '@app/services/user.service';
import { UserI } from '@app/models/user';
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
  // @Input() chatMessage: MessageI; // later we'll switch it back to this
  user$ = new BehaviorSubject<UserI>(null);
  avatarUrl$ = new BehaviorSubject<string>('assets/icons/square_icon.svg');
  constructor(private userSvc: UserService) {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    const userRef$ = this.getUserObservable(this.chatMessage.senderId);
    userRef$.subscribe(user => {
      this.user$.next(user);
      // However, in the HTML template you can use Angulars async pipe like so:
      // <div>{{ (user$ | async)?.fName }}</div>
      //console.log(this.user$.value.fName);
      const uid = this.user$.value.uid;
      this.userSvc
        .getAvatarUrl(uid)
        .subscribe(url => this.avatarUrl$.next(url));
      console.log(this.avatarUrl$);
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
