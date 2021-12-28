import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router }       from '@angular/router';
import { ChatGroupI } from '@app/models/chat-group';
import { UserI } from '@app/models/user';
import { ChatService } from '@app/services/chat.service';

import { resetHeader, setHeaderText } from '@app/store/header/header.actions';
import { loggedInUser, userListByIdMap } from '@app/store/user/user.selectors';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'gtm-add-people',
  templateUrl: './add-people.component.html',
  styleUrls: ['./add-people.component.scss'],
})
export class AddPeopleComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject();

  chatGroup$: BehaviorSubject<ChatGroupI> = new BehaviorSubject(null);
  selectedUsers = {};
  users$: BehaviorSubject<UserI[]> = new BehaviorSubject([]);
  doesUserHaveContacts = false;
  wasUserReturned = false;

  constructor(
    private store: Store,
    private chatSvc: ChatService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (!params['id']) {
        return;
      }
      const { id } = params;
      this.chatSvc
        .chatGroupDoc(id)
        .valueChanges()
        .subscribe(group => {
          this.chatGroup$.next({ id, ...group });
          this.updateHeader();
        });
    });
    this.initializeContactList();
  }

  ngOnDestroy() {
    this.store.dispatch(resetHeader());
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  watchChatGroup = () => {
    this.chatGroup$.subscribe(group => {
      if (!group) {
        return;
      }
      const { participantsMap } = group;
      const participantIds = Object.keys(participantsMap);
      for (const uid of participantIds) {
        this.selectedUsers[uid] = true;
      }
    });
  }

  onCreateGroupClicked = () => {
    const uids = Object.entries(this.selectedUsers)
      .filter(([_, isSelected]) => !!isSelected)
      .map(([uid, _]) => uid);
    if (uids.length < 3) {
      alert(
        'You need to select at least two users other than yourself to create a group chat',
      );
      return;
    }
    return this.createNewChat(uids);
  }

  createNewChat = async (uids: string[]) => {
    const groupId = await this.chatSvc.createGroupChat(uids);
    return this.router.navigateByUrl(`/chat/${groupId}`);
  }

  onExpandGroupClicked = () => this.expandChatGroup();

  expandChatGroup = () => alert('gotta make this possible too');

  initializeContactList = () => {
    this.store
      .select(loggedInUser)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(user => {
        if (user && user.uid) {
          this.wasUserReturned = true;
          this.selectedUsers[user.uid] = true;
        }
        if (user && user.contacts && Object.keys(user.contacts).length > 0) {
          this.doesUserHaveContacts = true;
          this.store
            .select(userListByIdMap(user.contacts))
            .subscribe(contacts => {
              this.users$.next(contacts);
              this.watchChatGroup();
            });
        }
      });
  };

  updateHeader = () => {
    setTimeout(() => delayedHederOperations());

    const delayedHederOperations = () => {
      this.store.dispatch(setHeaderText({ headerText: 'Create a Gropup' }));
    };
  };
}
