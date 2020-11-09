import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HeaderService } from '@app/services/header.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { ChatService } from '@services/chat.service';
import { UserService } from '@app/services/user.service';
import { UserI } from '@models/user';
import { MessageI } from '@models/message';
import { AuthService } from '@services/auth.service';
import { FirebaseService } from '@app/services/firebase.service';

@Component({
  selector: 'gtm-chat-detail',
  templateUrl: './chat-detail.component.html',
  styleUrls: ['./chat-detail.component.scss'],
})
export class ChatDetailComponent implements OnInit {
  @ViewChild('chatList') private chatListEl: ElementRef;
  private unsubscribe$: Subject<void> = new Subject();
  chatUsers$ = new BehaviorSubject<UserI[]>([]);
  msgInput = '';
  chats = [];
  chatGroupId = '';
  authUid = '';
  messages: MessageI[];

  constructor(
    private headerSvc: HeaderService,
    private route: ActivatedRoute,
    private router: Router,
    private chatSvc: ChatService,
    private userSvc: UserService,
    private fbSvc: FirebaseService,
    private authSvc: AuthService,
  ) {}

  ngOnDestroy(): void {
    this.headerSvc.resetHeader();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.chatGroupId = params['id'];
        this.watchChatGroupAndUsers(this.chatGroupId);
        this.watchChatMessages(this.chatGroupId);
        this.updateHeader();
      }
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    try {
      this.chatListEl.nativeElement.scrollTop = this.chatListEl.nativeElement.scrollHeight;
    } catch (error) {}
  }

  watchChatMessages = (chatGroupId: string) => {
    this.chatSvc
      .chatMessagesByGroupQuery(chatGroupId)
      .snapshotChanges()
      .subscribe(msgChangeActions => {
        const messages = msgChangeActions.map(msgChangeAction => {
          const { payload } = msgChangeAction,
            { doc } = payload,
            { id } = doc;
          const msg = doc.data();
          return { ...msg, id };
        });
        this.messages = messages;
      });
  };

  watchChatGroupAndUsers = (chatGroupId: string) => {
    this.getChatObservable(chatGroupId).subscribe(chatGroup => {
      const participantIds = Object.keys(chatGroup.participantsMap);
      this.watchChatUsers(participantIds);
    });
  };

  getChatObservable = (chatGroupId: string) => {
    return this.chatSvc
      .chatGroupDoc(chatGroupId)
      .valueChanges()
      .pipe(takeUntil(this.unsubscribe$));
  };

  watchChatUsers = (userIds: string[]) => {
    const userObservables = userIds.map(uid => this.getUserObservable(uid));

    const users$ = combineLatest(userObservables);
    users$.subscribe(users => {
      this.chatUsers$.next(users);
    });
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

  updateHeader = () => {
    setTimeout(() => delayedHeaderOperations());

    const delayedHeaderOperations = () => {
      this.chatUsers$.pipe(takeUntil(this.unsubscribe$)).subscribe(users => {
        const firstNames = users.map(user => user.fName);
        const namesList = firstNames.join(', ');
        this.headerSvc.setHeaderText(namesList);
      });

      this.headerSvc.setHeaderOption('seePeople', {
        iconName: 'people',
        optionText: 'See and add participants',
        isDisabled: false,
        onClick: this.onPeopleClicked,
      });
    };
  };

  onPeopleClicked = () =>
    this.router.navigateByUrl(`chat/${this.chatGroupId}/people`);

  onSendMessage = () => {
    const { uid } = this.authSvc.authInfo$.value,
      { chatGroupId, msgInput } = this;

    const messageData: MessageI = {
      chatGroupId,
      senderId: uid,
      content: msgInput,
      seenBy: {},
      createdAt: this.fbSvc.fsTimestamp(),
    };
    this.chatSvc.createChatMessage(messageData);
    this.msgInput = '';
  };

  trackMessageBy = (index: number, item: any): number => {
    return item.id;
  };
}
