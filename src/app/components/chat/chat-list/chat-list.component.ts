import { Component, OnInit } from '@angular/core';
import { ChatGroupI } from '@app/models/chat-group';
import { ChatService } from '@app/services/chat.service';
import { Observable } from 'rxjs';
import { KeyMapI } from '@models/shared';
import { debounceTime, take } from 'rxjs/operators';
import { HeaderService } from '@app/services/header.service';
import { Store } from '@ngrx/store';
import { authUid } from '@app/store/auth/auth.selectors';

@Component({
  selector: 'gtm-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent implements OnInit {
  chatList$: Observable<ChatGroupI[]>;
  badgeList: KeyMapI<number> = {};

  constructor(
    private chatSvc: ChatService,
    private store: Store,
    private headerSvc: HeaderService,
  ) {}

  ngOnInit(): void {
    this.watchChatList();
    this.updateHeader();
  }

  updateHeader = () => {
    setTimeout(() => delayedHeaderOperations());

    const delayedHeaderOperations = () => {
      this.headerSvc.setHeaderText('Your Open Chats');
    };
  };

  watchChatList = async () => {
    const loggedInUid = await this.store
      .select(authUid)
      .pipe(take(1))
      .toPromise();
    this.chatList$ = this.chatSvc.watchChatsByUser$(loggedInUid);
    this.chatList$.pipe(debounceTime(5000)).subscribe(list => {
      const newBadgeList: KeyMapI<number> = {};
      for (let item of list) {
        if (!item.unreadMessagesByUser) continue;
        const unreadMessageList = item.unreadMessagesByUser[loggedInUid] as any;
        const unreadCount = unreadMessageList
          ? Object.keys(unreadMessageList).length
          : 0;
        newBadgeList[item.id] = unreadCount;
        this.badgeList = newBadgeList;
      }
    });
  };
}
