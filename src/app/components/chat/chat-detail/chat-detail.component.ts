import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HeaderService } from '@app/services/header.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ChatService } from '@services/chat.service';
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

  updateHeader = () => {
    setTimeout(() => delayedHeaderOperations());

    const delayedHeaderOperations = () => {
      this.headerSvc.setHeaderText('Messages');

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
