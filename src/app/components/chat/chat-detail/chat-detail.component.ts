import { Component, OnInit } from '@angular/core';
import { HeaderService } from '@app/services/header.service';
import { ActivatedRoute } from '@angular/router';
import { Subject, BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { ChatService } from '@services/chat.service';
import { UserService } from '@app/services/user.service';
import { UserI } from '@models/user';
import { MessageI } from '@models/message';
import { AuthService } from '@services/auth.service';
import { FirebaseService } from '@app/services/firebase.service';
import { AngularFirestore } from '@angular/fire/firestore';
// remove this import later
import { firestore } from 'firebase';

@Component({
  selector: 'gtm-chat-detail',
  templateUrl: './chat-detail.component.html',
  styleUrls: ['./chat-detail.component.scss'],
})
export class ChatDetailComponent implements OnInit {
  private unsubscribe$: Subject<void> = new Subject();
  chatUsers$ = new BehaviorSubject<UserI[]>([]);
  msgInput = '';
  chats = [];
  chatGroupId = '';
  authUid = '';
  messages$ = this.chatSvc.testMessages$;

  constructor(
    private headerSvc: HeaderService,
    private route: ActivatedRoute,
    private chatSvc: ChatService,
    private userSvc: UserService,
    private fbSvc: FirebaseService,
    private authSvc: AuthService,
    private afs: AngularFirestore,
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
        const chatObservable$ = this.getChatObservable(this.chatGroupId);
        chatObservable$.subscribe(chatGroup => {
          const participantIds = Object.keys(chatGroup.participantIds);
          this.watchChatUsers(participantIds);
        });
        setTimeout(() => this.updateHeader());
      }
    });
  }

  getChatObservable = (chatGroupId: string) => {
    return this.chatSvc
      .pairChatDoc(chatGroupId)
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
    this.chatUsers$.subscribe(users => {
      const firstNames = users.map(user => user.fName);
      const namesList = firstNames.join(', ');
      this.headerSvc.setHeaderText(namesList);
    });
  };

  onSendMessage = () => {
    const { uid } = this.authSvc.authInfo$.value,
      { chatGroupId, msgInput, fbSvc, afs } = this;

    const messageData: MessageI = {
      id: afs.createId(),
      chatGroupId,
      senderId: uid,
      content: msgInput,
      createdAt: firestore.Timestamp.fromDate(new Date()),
      // revert back to this when using the database
      // createdAt: fbSvc.fsTimestamp(),
    };
    this.chatSvc.sendMessage(messageData);
  };
}
