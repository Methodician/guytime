import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router }             from '@angular/router';
import { combineLatest, Observable, Subject } from 'rxjs';
import { ChatService }                        from '@services/chat.service';
import { ChatMessageI } from '@models/message';
import { FirebaseService }                     from '@app/services/firebase.service';
import { Store }                               from '@ngrx/store';
import { authUid }                             from '@app/store/auth/auth.selectors';
import { map, take, takeUntil }                                from 'rxjs/operators';
import { clearChatMessages, loadChatGroups, loadChatMessages } from '@app/store/chat/chat.actions';
import { chatGroupById, chatMessages }                         from '@app/store/chat/chat.selectors';
import { loggedInUser}                                         from '@app/store/user/user.selectors';
import {
   backButtonClicked,
  resetHeader,
}                                                              from '@app/store/header/header.actions';
import { UserI }                                               from '@models/user';
import { avatarFileName, userListByIdMap }                     from '@app/store/user/user.selectors';
import { ChatGroupI }                                          from '@models/chat-group';
import { UserService }                                         from '@services/user.service'

@Component({
  selector: 'gtm-chat-detail',
  templateUrl: './chat-detail.component.html',
  styleUrls: ['./chat-detail.component.scss'],
})
export class ChatDetailComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('chatList') private chatListEl: ElementRef;
  @ViewChild('chatInput') private chatInputEl: ElementRef;
  private unsubscribe$: Subject<void> = new Subject();
  msgInput = '';
  chatGroupId = '';
  messages$: Observable<ReadonlyArray<ChatMessageI>>;
  users$: Observable<UserI[]>;
  group$: Observable<ChatGroupI>;
  group: ChatGroupI | undefined | null;
  messages: ReadonlyArray<ChatMessageI> | undefined | null;

  loggedInUser: UserI | null = null;
  users: UserI[] = [];

  firstNames: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatSvc: ChatService,
    private userSvc: UserService,
    private fbSvc: FirebaseService,
    private store: Store,
  ) {}

  ngOnDestroy(): void {
    this.store.dispatch(clearChatMessages());
    this.store.dispatch(resetHeader());
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.watchLoggedInUser();
    this.route.params.subscribe(params => {
      if (params['id']) {
        const { id } = params;
        this.chatGroupId = id;
        this.store.dispatch(loadChatMessages({ chatGroupId: id }));
        // this.updateHeader();
        if (!this.group$) {
          this.group$ = this.store.select(chatGroupById(id));
          this.watchChatGroup();
        }
      }
    });
    this.messages$ = this.store.select(chatMessages);
    this.watchMessages();
    // this.watchChatUsers();
    this.store.dispatch(loadChatGroups());
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  watchMessages = () => {
    this.messages$.subscribe(( messages ) => {
      this.messages = messages;
    });
  }

  watchLoggedInUser = () => {
    this.store
      .select(loggedInUser)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(user => {
        if ( !user?.uid ) {
          return;
        }

        this.loggedInUser = user

      });
  }

  watchChatGroup = () => {
    this.group$.subscribe((group) => {
      this.group = group;
      this.watchChatUsers();
    });
  }

  watchChatUsers = () => {
    if (this.group && !this.users$) {
      this.users$  = this.store.select(
        userListByIdMap(this.group.participantsMap),
      );

      this.users$
        .pipe(
          takeUntil(this.unsubscribe$),
          map(users => users.map(user => user)),
        )
        .subscribe(users => {
          let firstNamesArray = users.map((user) => user.fName)
          if (users.length > 2) {
            firstNamesArray = [
              firstNamesArray[0],
              firstNamesArray[1],
              '...'
            ]

          }
          this.firstNames = firstNamesArray.join(', ');
          this.users = users
        });
    }
  }

  scrollToBottom() {
    try {
      this.chatListEl.nativeElement.scrollTop = this.chatListEl.nativeElement.scrollHeight;
    } catch (error) {}
  }

  onPeopleClicked = () =>
    this.router.navigateByUrl(`chat/${this.chatGroupId}/people`);

  onBackClicked = () => {
    this.store.dispatch(backButtonClicked());
  }

  onSendMessage = async () => {
    // Could be put in effects in theory, but unclear what the advantage would
    // be other than a cleaner component code and separation of concerns
    // (which is not a trivial advantage, but maybe not worth the refactor)
    const uid = await this.store.select(authUid).pipe(take(1)).toPromise();
    const { chatGroupId, msgInput } = this;

    const messageData: ChatMessageI = {
      chatGroupId,
      senderId: uid,
      content: msgInput,
      seenBy: {},
      createdAt: this.fbSvc.fsTimestamp(),
    };
    await this.chatSvc.createChatMessage(messageData);
    this.msgInput = '';
    this.chatInputEl.nativeElement.setAttribute('style', 'height:44px;');
  }

  trackMessageBy = (_, item: any): number => {
    return item.id;
  }

  onTextareaChange = () => {
    const inputEl = this.chatInputEl.nativeElement;
    const height = inputEl.offsetHeight;
    const clonedTextarea = inputEl.cloneNode();
    clonedTextarea.value = '';
    clonedTextarea.setAttribute('style', 'height:44px;');
    const parentEl = inputEl.parentNode;
    parentEl.appendChild(clonedTextarea);
    clonedTextarea.value = inputEl.value;
    const cloneHeight = clonedTextarea.scrollHeight;
    parentEl.removeChild(clonedTextarea);
    if (cloneHeight !== height) {
      let style = `height: ${cloneHeight}px;`;
      if ( cloneHeight > 44 ) {
        style += 'border-radius: .75rem;';
      }
      inputEl.setAttribute('style', style);
    }
  }

  // Helpers
  avatarFileName$ = ( uid: string ) =>
    this.store.select(avatarFileName(uid, '45x45'))

  isIncomingChatRequest = (): boolean => {
    if (
      this.loggedInUser &&
      this.users &&
      this.users.length === 1 &&
      this.group &&
      this.group.isPairChat
    ) {
      const user = this.users[0]
      const connections = Object.keys(this.loggedInUser.contacts)
      return !connections.includes(user.uid)
    }
    return true
  }

  isInitiatedByLoggedInUser = (): boolean => {
    if (this.loggedInUser && this.group && this.group.initiatedBy) {
      return this.group.initiatedBy === this.loggedInUser.uid
    }

    if (this.loggedInUser && this.messages && this.messages.length > 0) {
      return this.messages[0].senderId === this.loggedInUser.uid
    }

    return false
  }

  onAddConnection = () => combineLatest([ this.store.select(loggedInUser), this.users$ ])
    .pipe(take(1))
    .subscribe(( [ loggedInUser, users ] ) =>
      this.userSvc.addUserContact(loggedInUser.uid, users[0].uid),
    );

  onIgnoreUser = async (): Promise<void> => {
    // Hide ChatGroup from loggedInUser
    await this.chatSvc.hidePairChatFromUser(this.loggedInUser.uid, this.chatGroupId)
    this.store.dispatch(backButtonClicked());
  }

}
