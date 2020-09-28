import { Component, OnInit } from '@angular/core';
import { ChatGroupI } from '@app/models/chat-group';
import { AuthService } from '@app/services/auth.service';
import { ChatService } from '@app/services/chat.service';
import { Observable } from 'rxjs';
import { KeyMapI } from '@models/shared';
import { debounce, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'gtm-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent implements OnInit {
  chatList$: Observable<ChatGroupI[]>;
  badgeList: KeyMapI<number> = {};

  constructor(private chatSvc: ChatService, private authSvc: AuthService) {}

  ngOnInit(): void {
    this.watchChatList();
  }

  watchChatList = () => {
    const loggedInUid = this.authSvc.authInfo$.value.uid;
    this.chatList$ = this.chatSvc.watchChatsByUser$(loggedInUid);
    this.chatList$.pipe(debounceTime(5000)).subscribe(list => {
      const newBadgeList: KeyMapI<number> = {};
      for (let item of list) {
        const unreadMessageList = item.unreadMessagesByUser[
          this.authSvc.authInfo$.value.uid
        ] as any;
        const unreadCount = unreadMessageList
          ? Object.keys(unreadMessageList).length
          : 0;
        newBadgeList[item.id] = unreadCount;
        this.badgeList = newBadgeList;
      }
    });
  };

  getUnreadMessageCount = (group: ChatGroupI) =>
    group.unreadMessagesByUser[this.authSvc.authInfo$.value.uid].length;
}
