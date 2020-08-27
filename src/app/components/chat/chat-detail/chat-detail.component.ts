import { Component, OnInit } from '@angular/core';
import { HeaderService } from '@app/services/header.service';
import { ActivatedRoute } from '@angular/router';
import { Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { ChatService } from '@services/chat.service';
import { UserService } from '@app/services/user.service';
import { UserI } from '@models/user';

@Component({
  selector: 'gtm-chat-detail',
  templateUrl: './chat-detail.component.html',
  styleUrls: ['./chat-detail.component.scss'],
})
export class ChatDetailComponent implements OnInit {
  private unsubscribe$: Subject<void> = new Subject();
  chatUsers$ = new BehaviorSubject<UserI[]>([]);

  constructor(
    private headerSvc: HeaderService,
    private route: ActivatedRoute,
    private chatSvc: ChatService,
    private userSvc: UserService,
  ) {}

  ngOnDestroy(): void {
    this.headerSvc.resetHeader();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        const chatId = params['id'];
        // const docRef = this.afs.collection('chats').doc<ChatGroupI>(chatId); // please don't delete for now
        // const docRef = this.chatSvc.chatGroupRef(chatId);
        // const chatObservable$ = docRef.valueChanges();
        const chatObservable$ = this.getChatObservables(chatId);
        // chatObservable$.subscribe(chat => console.log(chat.participantIds));
        chatObservable$.subscribe(chatGroup =>
          this.watchChatUsers(chatGroup.participantIds),
        );
        setTimeout(() => this.updateHeader());
      }
    });
  }

  getChatObservables = (chatId: string) => {
    // return the results of piping chatSvc.chatGroupRef through valueChanges and map takeUntil (like in OtherConnectionsListComponent)
    return this.chatSvc
      .chatGroupRef(chatId)
      .valueChanges()
      .pipe(
        map(chatGroup => ({ ...chatGroup, chatId })), //??
        takeUntil(this.unsubscribe$),
      );
  };

  watchChatUsers = (userIds: string[]) => {
    // Feel free to start by just writing code inside ngOnInit and logging results to console one step at a time
    console.log(userIds);
    // create an observable that emits an array of UserI objects, as in watchUserContacts inside OtherConnectionsListComponent
    const userObservables = userIds.map(uid => this.getUserObservable(uid));
    // Might use those ids to call this method next but start by just logging the user DocRefs to console
    console.log(userObservables);
    // Then log the observables they provide, then subscribe to each and log the users, then try to make the RxJS piping work to convert it all to an observable that emits an array of users

    // delete this later, just for demonstration...?????
    for (let user$ of userObservables) {
      user$.subscribe(console.log);
    }

    const users$ = combineLatest(userObservables);
    console.log(users$);
    users$.subscribe(users => {
      console.log(users);
      this.chatUsers$.next(users);
    });
  };

  getUserObservable = (uid: string) =>
    this.userSvc
      .userRef(uid)
      .valueChanges()
      .pipe(map(user => ({ ...user, uid }), takeUntil(this.unsubscribe$)));

  updateHeader = () => {
    this.chatUsers$.subscribe(users => {
      const firstNames = users.map(user => user.fName);
      const namesList = firstNames.join(', ');
      this.headerSvc.setHeaderText(namesList);
    });
  };
}
