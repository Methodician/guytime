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
  msgInput = '';
  chats = [];

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
        const chatObservable$ = this.getChatObservable(chatId);
        chatObservable$.subscribe(chatGroup => {
          const participantIds = Object.keys(chatGroup.participantIds).map(
            uid => uid,
          );
          this.watchChatUsers(participantIds);
        });
        setTimeout(() => this.updateHeader());
      }
    });

    this.chats = [
      {
        sender: 'Andy',
        avatar:
          'https://thumbs-prod.si-cdn.com/qXrJJ-l_jMrQbARjnToD0fi-Tsg=/800x600/filters:no_upscale()/https://public-media.si-cdn.com/filer/d6/93/d6939718-4e41-44a8-a8f3-d13648d2bcd0/c3npbx.jpg',
        text: `but that's nothing new. We have been chatting for like a month and we keep comming back so someone must be having fun. I mean look at me. I'm a puffer fish...`,
        timestamp: new Date(),
      },
      {
        sender: 'Jim',
        avatar: 'https://material.angular.io/assets/img/examples/shiba1.jpg',
        text: 'Totes but I dig it too. I mean we can chat all day',
        timestamp: new Date(),
      },
      {
        sender: 'Nathan',
        avatar: 'https://material.angular.io/assets/img/examples/shiba1.jpg',
        text: 'I like chatting with you guys',
        timestamp: new Date(),
      },
      {
        sender: 'Andy',
        avatar:
          'https://thumbs-prod.si-cdn.com/qXrJJ-l_jMrQbARjnToD0fi-Tsg=/800x600/filters:no_upscale()/https://public-media.si-cdn.com/filer/d6/93/d6939718-4e41-44a8-a8f3-d13648d2bcd0/c3npbx.jpg',
        text: `but that's nothing new. We have been chatting for like a month and we keep comming back so someone must be having fun. I mean look at me. I'm a puffer fish...`,
        timestamp: new Date(),
      },
    ];
  }

  getChatObservable = (chatId: string) => {
    return this.chatSvc
      .chatGroupRef(chatId)
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
      .pipe(map(user => ({ ...user, uid }), takeUntil(this.unsubscribe$)));

  updateHeader = () => {
    this.chatUsers$.subscribe(users => {
      const firstNames = users.map(user => user.fName);
      const namesList = firstNames.join(', ');
      this.headerSvc.setHeaderText(namesList);
    });
  };

  sendMessage = () => {
    console.log(this.msgInput);
  };
}
