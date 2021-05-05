import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadChatGroups } from '@app/store/chat/chat.actions';
import {
  unreadMessageCountByChatGroup,
  openChatGroups,
} from '@app/store/chat/chat.selectors';
import { resetHeader, setHeaderText } from '@app/store/header/header.actions';

@Component({
  selector: 'gtm-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent implements OnInit {
  chatGroupList$ = this.store.select(openChatGroups);

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.updateHeader();
    this.store.dispatch(loadChatGroups());
  }

  ngOnDestroy(): void {
    this.store.dispatch(resetHeader());
  }

  unreadMessageCountByChatGroup$ = (groupId: string) =>
    this.store.select(unreadMessageCountByChatGroup(groupId));

  updateHeader = () => {
    setTimeout(() => delayedHeaderOperations());

    const delayedHeaderOperations = () => {
      this.store.dispatch(setHeaderText({ headerText: 'Your Open Chats' }));
    };
  };
}
