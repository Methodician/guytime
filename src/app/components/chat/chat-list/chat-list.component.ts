import { Component, OnDestroy, OnInit, ViewChild }      from '@angular/core';
import { Store }                                        from '@ngrx/store';
import { loadChatGroups }                               from '@app/store/chat/chat.actions';
import {
  unreadMessageCountByChatGroup,
  openChatGroups,
}                                                       from '@app/store/chat/chat.selectors';
import { addHeaderOptions, resetHeader, setHeaderText } from '@app/store/header/header.actions';
import { openBottomSheet }                              from '@app/store/bottom-sheet/bottom-sheet.actions';
import { takeUntil }                                    from 'rxjs/operators'
import { loggedInUser }                                 from '@app/store/user/user.selectors';
import { Subject }                                      from 'rxjs'
import { UserI }                                        from '@models/user'
import { ChatService }                                  from '@services/chat.service'
import { ChatGroupI } from '@app/models/chat-group';

@Component({
  selector: 'gtm-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent implements OnInit, OnDestroy {
  chatGroupList$ = this.store.select(openChatGroups);
  @ViewChild('gtm-bottom-sheet') bottomSheet;

  chatGroupList: ChatGroupI[] = [];

  deleteMode: boolean = false;
  selectedChatGroups = {};

  loggedInUser: UserI | null = null;

  private unsubscribe$: Subject<void> = new Subject();

  constructor(
    private store: Store,
    private chatSvc: ChatService,
  ) {}

  ngOnInit(): void {
    this.updateHeader();
    this.watchLoggedInUser();
    this.watchChatGroups();
    this.store.dispatch(loadChatGroups());
  }

  ngOnDestroy(): void {
    this.store.dispatch(resetHeader());
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  watchChatGroups = () => {
    this.chatGroupList$.subscribe((groups) => {
      const sortedGroups = [
        ...groups
      ]
      sortedGroups.sort((a, b) => {
        if (a.latestMessage && b.latestMessage && a.latestMessage.createdAt && b.latestMessage.createdAt) {
          return b.latestMessage.createdAt.seconds - a.latestMessage.createdAt.seconds
        }
        return 0
      })
      this.chatGroupList = sortedGroups
    })
  }

  watchLoggedInUser = () => {
    this.store
      .select(loggedInUser)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(user => {
        if ( !user?.uid ) {
          return;
        }

        this.loggedInUser = user

      });
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
    this.deleteMode = !this.deleteMode
  }

  onNewChatClicked = () => {
    this.store.dispatch(openBottomSheet());
  }

  onCancelDelete = (): void => {
    this.selectedChatGroups = {}
    this.deleteMode = false
  }

  onDeleteSelected = async (): Promise<void> => {
    const chatGroupIdsToDelete = Object.keys(this.selectedChatGroups)
    await this.chatSvc.removeUserFromChats(this.loggedInUser.uid, chatGroupIdsToDelete)
    this.selectedChatGroups = {}
    this.deleteMode         = false
  }

  toggleSelectedChatGroup = (chatGroupId: string): void => {
    const userSelected = !!this.selectedChatGroups[chatGroupId];

    if ( userSelected ) {
      delete this.selectedChatGroups[chatGroupId];
    }

    if ( !userSelected ) {
      this.selectedChatGroups[chatGroupId] = true;
    }
  }
}
