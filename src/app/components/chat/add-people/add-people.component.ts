import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatGroupI } from '@app/models/chat-group';
import { UserI } from '@app/models/user';
import { ChatService } from '@app/services/chat.service';
import { HeaderService } from '@app/services/header.service';

import { UserService } from '@app/services/user.service';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { map, tap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'gtm-add-people',
  templateUrl: './add-people.component.html',
  styleUrls: ['./add-people.component.scss'],
})
export class AddPeopleComponent implements OnInit {
  private unsubscribe$: Subject<void> = new Subject();

  chatGroup: ChatGroupI;
  selectedUsers = {};
  users$: BehaviorSubject<UserI[]> = new BehaviorSubject([]);
  doesUserHaveContacts = false;
  wasUserReturned = false;

  constructor(
    private chatSvc: ChatService,
    private userSvc: UserService,
    private headerSvc: HeaderService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (!params['id']) return;
      const { id } = params;
      this.chatSvc
        .chatGroupDoc(id)
        .valueChanges()
        .subscribe(group => {
          this.chatGroup = { id, ...group };
          setTimeout(() => this.updateHeader());
        });
    });
    this.initializeContactList();
  }

  ngOnDestroy() {
    this.headerSvc.resetHeader();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  // TESTING
  logIt = () => console.log(this.chatGroup);
  // end testing

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
  };

  createNewChat = async (uids: string[]) => {
    const groupId = await this.chatSvc.createGroupChat(uids);
    return this.router.navigateByUrl(`/chat/${groupId}`);
  };

  expandChatGroup = () => alert('gotta make this possible too');

  initializeContactList = () => {
    this.userSvc.loggedInUser$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(user => {
        if (user && user.uid) {
          this.wasUserReturned = true;
          this.selectedUsers[user.uid] = true;
        }
        if (user && user.contacts && Object.keys(user.contacts).length > 0) {
          this.doesUserHaveContacts = true;
          const contactIds = Object.keys(user.contacts).map(contact => contact);
          const contactObservables = contactIds.map(id =>
            this.userSvc
              .userRef(id)
              .snapshotChanges()
              .pipe(
                tap(userSnap => {
                  const uid = userSnap.payload.id;
                  this.selectedUsers[uid] = false;
                }),
                map(userSnap => {
                  const uid = userSnap.payload.id;
                  const user = userSnap.payload.data();
                  return { ...user, uid };
                }),
              ),
          );
          const contactsObservable = combineLatest(contactObservables);
          contactsObservable
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(contacts => this.users$.next(contacts));
        }
      });
  };

  updateHeader = () => {
    this.headerSvc.setHeaderText('Create a Group');
    this.headerSvc.setDefaultXUrl(`/chat/${this.chatGroup.id}`);
  };
}
