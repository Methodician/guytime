import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HeaderService } from '@app/services/header.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { ChatService } from '@services/chat.service';
import { ChatMessageI } from '@models/message';
import { FirebaseService } from '@app/services/firebase.service';
import { Store } from '@ngrx/store';
import { authUid } from '@app/store/auth/auth.selectors';
import { take } from 'rxjs/operators';
import { loadChatMessages } from '@app/store/chat/chat.actions';
import { chatMessages } from '@app/store/chat/chat.selectors';
import { resetHeader, setHeaderText } from '@app/store/header/header.actions';

@Component({
  selector: 'gtm-chat-detail',
  templateUrl: './chat-detail.component.html',
  styleUrls: ['./chat-detail.component.scss'],
})
export class ChatDetailComponent implements OnInit {
  @ViewChild('chatList') private chatListEl: ElementRef;
  private unsubscribe$: Subject<void> = new Subject();
  msgInput = '';
  chatGroupId = '';
  messages$: Observable<ReadonlyArray<ChatMessageI>>;

  constructor(
    private headerSvc: HeaderService,
    private route: ActivatedRoute,
    private router: Router,
    private chatSvc: ChatService,
    private fbSvc: FirebaseService,
    private store: Store,
  ) {}

  ngOnDestroy(): void {
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
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    try {
      this.chatListEl.nativeElement.scrollTop = this.chatListEl.nativeElement.scrollHeight;
    } catch (error) {}
  }

  updateHeader = () => {
    setTimeout(() => delayedHeaderOperations());

    // Delayed header options may no longer be needed with ngRx
    const delayedHeaderOperations = () => {
      this.store.dispatch(setHeaderText({ headerText: 'Messages' }));

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

  onSendMessage = async () => {
    // Could be put in effects in theory, but unclear what the advangage would
    // be other than a cleaner component code and separation of concerns
    // (which is not a trivial advantage, but maybe not worth the refactor)
    const uid = await this.store.select(authUid).pipe(take(1)).toPromise(),
      { chatGroupId, msgInput } = this;

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
  };
}
