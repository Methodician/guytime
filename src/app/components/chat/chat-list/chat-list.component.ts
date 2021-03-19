import { Component, OnInit } from '@angular/core';
import { HeaderService } from '@app/services/header.service';
import { Store } from '@ngrx/store';
import { loadChatGroups } from '@app/store/chat/chat.actions';
import {
  unreadMessageCountByChatGroup,
  openChatGroups,
} from '@app/store/chat/chat.selectors';

@Component({
  selector: 'gtm-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent implements OnInit {
  chatGroupList$ = this.store.select(openChatGroups);

  constructor(private store: Store, private headerSvc: HeaderService) {}

  ngOnInit(): void {
    this.updateHeader();
    this.store.dispatch(loadChatGroups());
  }

  unreadMessageCountByChatGroup$ = (groupId: string) =>
    this.store.select(unreadMessageCountByChatGroup(groupId));

  updateHeader = () => {
    setTimeout(() => delayedHeaderOperations());

    const delayedHeaderOperations = () => {
      this.headerSvc.setHeaderText('Your Open Chats');
    };
  };
}
