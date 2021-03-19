import { Component, OnInit, Input } from '@angular/core';
import { ChatMessageI } from '@models/message';
import { ProfileImageSizeT, UserI } from '@models/user';
import { Subject, Observable } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';
import { ChatService } from '@app/services/chat.service';
import { Store } from '@ngrx/store';
import { authUid } from '@app/store/auth/auth.selectors';
import { avatarFileName, specificUser } from '@app/store/user/user.selectors';

@Component({
  selector: 'gtm-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss'],
})
export class ChatMessageComponent implements OnInit {
  private unsubscribe$: Subject<void> = new Subject();
  @Input() chatMessage: ChatMessageI;

  user$: Observable<UserI>;
  loggedInUid: string;

  avatarSize: ProfileImageSizeT = '45x45';

  constructor(private chatSvc: ChatService, private store: Store) {}

  ngOnInit(): void {
    this.store
      .select(authUid)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(uid => (this.loggedInUid = uid));
    this.user$ = this.store.select(specificUser(this.chatMessage.senderId));

    if (!this.wasMessageSeen()) {
      setTimeout(() => this.setAsSeen(), 5000);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  wasMessageSeen = () =>
    !!this.chatMessage.seenBy && this.chatMessage.seenBy[this.loggedInUid];

  setAsSeen = () => {
    const wasAuthor = this.loggedInUid === this.chatMessage.senderId;
    if (!wasAuthor)
      this.chatSvc.setMessageAsSeenBy(this.loggedInUid, this.chatMessage.id);
  };

  avatarFileName$ = () =>
    this.user$.pipe(
      takeUntil(this.unsubscribe$),
      switchMap(user =>
        this.store.select(avatarFileName(user.uid, this.avatarSize)),
      ),
    );
}
