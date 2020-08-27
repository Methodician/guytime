import { Component, OnInit } from '@angular/core';
import { HeaderService } from '@app/services/header.service';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { ChatService } from '@services/chat.service';

@Component({
  selector: 'gtm-chat-detail',
  templateUrl: './chat-detail.component.html',
  styleUrls: ['./chat-detail.component.scss'],
})
export class ChatDetailComponent implements OnInit {
  private unsubscribe$: Subject<void> = new Subject();

  constructor(
    private headerSvc: HeaderService,
    private route: ActivatedRoute,
    private chatSvc: ChatService,
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
        const docRef = this.chatSvc.chatGroupRef(chatId);
        const chatObservable$ = docRef.valueChanges();
        chatObservable$.subscribe(chat => console.log(chat.participantIds));
      }
    });
  }

  getChatObservables = () => {
    // return the results of piping chatSvc.chatGroupRef through valueChanges and map takeUntil (like in OtherConnectionsListComponent)
  };

  watchChatUsers = (userIds: string[]) => {
    // create an observable that emits an array of UserI objects, as in watchUserContacts inside OtherConnectionsListComponent
    // Feel free to start by just writing code inside ngOnInit and logging results to console one step at a time
    // As you have so far, awesome, if it's logging the array of ids to the console.
    // Might use those ids to call this method next but start by just logging the user DocRefs to console
    // Then log the observables they provide, then subscribe to each and log the users, then try to make the RxJS piping work to convert it all to an observable that emits an array of users
  };
}
