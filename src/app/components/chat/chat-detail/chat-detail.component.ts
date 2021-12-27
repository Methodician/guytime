import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router }                          from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { ChatService } from '@services/chat.service';
import { ChatMessageI } from '@models/message';
import { FirebaseService }                     from '@app/services/firebase.service';
import { Store }                               from '@ngrx/store';
import { authUid }                             from '@app/store/auth/auth.selectors';
import { map, take, takeUntil }                                from 'rxjs/operators';
import { clearChatMessages, loadChatGroups, loadChatMessages } from '@app/store/chat/chat.actions';
import { chatMessages }                                        from '@app/store/chat/chat.selectors';
import {
  addHeaderOptions,
  resetHeader,
  setHeaderText,
}                                              from '@app/store/header/header.actions';
import { UserI }                               from '@models/user';
import { userListByIdMap }                     from '@app/store/user/user.selectors';
import { ChatGroupI }                          from '@models/chat-group';

@Component({
  selector: 'gtm-chat-detail',
  templateUrl: './chat-detail.component.html',
  styleUrls: ['./chat-detail.component.scss'],
})
export class ChatDetailComponent implements OnInit {
  @ViewChild('chatList') private chatListEl: ElementRef;
  @ViewChild('chatInput') private chatInputEl: ElementRef;
  private unsubscribe$: Subject<void> = new Subject();
  msgInput = '';
  chatGroupId = '';
  messages$: Observable<ReadonlyArray<ChatMessageI>>;
  users$: Observable<UserI[]>;
  @Input() group: ChatGroupI;
  firstNames: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatSvc: ChatService,
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
    this.route.params.subscribe(params => {
      if (params['id']) {
        const { id } = params;
        this.chatGroupId = id;
        this.store.dispatch(loadChatMessages({ chatGroupId: id }));
        this.updateHeader();
      }
    });
    this.messages$ = this.store.select(chatMessages);
    this.watchChatUsers();
    this.store.dispatch(loadChatGroups());
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  watchChatUsers = async () => {
    const users$ = this.store.select(
      userListByIdMap(this.group.participantsMap),
    );
    this.users$  = users$;

    users$
      .pipe(
        takeUntil(this.unsubscribe$),
        map(users => users.map(user => user.fName)),
      )
      .subscribe(names => {
        this.firstNames = names.join(', ');
        this.store.dispatch(setHeaderText({ headerText: this.firstNames }));
      });
  }

  scrollToBottom() {
    try {
      this.chatListEl.nativeElement.scrollTop = this.chatListEl.nativeElement.scrollHeight;
    } catch (error) {}
  }

  updateHeader = () => {
    setTimeout(() => delayedHeaderOperations());

    const delayedHeaderOperations = () => {
      this.store.dispatch(setHeaderText({ headerText: 'Chat' }));

      const optionsToAdd = new Map([
        [
          'seePeople',
          {
            iconName: 'people',
            optionText: 'See and add participants',
            isDisabled: false,
            onClick: this.onPeopleClicked,
          },
        ],
      ]);

      this.store.dispatch(addHeaderOptions({ optionsToAdd }));
    };
  }

  onPeopleClicked = () =>
    this.router.navigateByUrl(`chat/${this.chatGroupId}/people`);

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
    this.chatSvc.createChatMessage(messageData);
    this.msgInput = '';
  };

  trackMessageBy = (_, item: any): number => {
    return item.id;
  }

  onTextareaChange = () => {
    const scrollHeight = this.chatInputEl.nativeElement.scrollHeight;
    const height = this.chatInputEl.nativeElement.offsetHeight;
    const numOfLines = this.chatInputEl.nativeElement.value.split('\n').length;
    if (scrollHeight > height) {
      let style = `height: ${scrollHeight}px;`;
      if (scrollHeight > 40) {
        style += 'border-radius: .75rem;';
      }
      this.chatInputEl.nativeElement.setAttribute('style', style);
    }
  }
}
