import { Component, OnDestroy, OnInit, ViewChild }      from '@angular/core';
import { Store }                                        from '@ngrx/store';
import { loadChatGroups }                               from '@app/store/chat/chat.actions';
import {
  unreadMessageCountByChatGroup,
  openChatGroups,
}                                                       from '@app/store/chat/chat.selectors';
import { addHeaderOptions, resetHeader, setHeaderText } from '@app/store/header/header.actions';
import { openBottomSheet }                              from '@app/store/bottom-sheet/bottom-sheet.actions';

@Component({
  selector: 'gtm-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent implements OnInit, OnDestroy {
  chatGroupList$ = this.store.select(openChatGroups);
  @ViewChild('gtm-bottom-sheet') bottomSheet;

  constructor(
    private store: Store,
  ) {}

  ngOnInit(): void {
    this.updateHeader();
    this.store.dispatch(loadChatGroups());
  }

  ngOnDestroy(): void {
    this.store.dispatch(resetHeader());
  }

  unreadMessageCountByChatGroup$ = (groupId: string) =>
    this.store.select(unreadMessageCountByChatGroup(groupId))

  updateHeader = () => {
    setTimeout(() => delayedHeaderOperations());

    const optionsToAdd = new Map([
      [
        'seePeople',
        {
          iconName: 'delete',
          optionText: 'Delete Chats',
          isDisabled: false,
          onClick: this.onDeleteClicked,
        },
      ],
    ]);

    this.store.dispatch(addHeaderOptions({ optionsToAdd }));

    const delayedHeaderOperations = () => {
      this.store.dispatch(setHeaderText({ headerText: 'Your Open Chats' }));
    }
  }

  onDeleteClicked = () => {
    console.log('delete');
  }

  onNewChatClicked = () => {
    this.store.dispatch(openBottomSheet());
  }
}
