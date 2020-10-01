import { Component, OnInit } from '@angular/core';
import { UserI } from '@app/models/user';
import { ChatService } from '@app/services/chat.service';

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

  checked = false;
  selectedUsers = {};
  users$: BehaviorSubject<UserI[]> = new BehaviorSubject([]);
  doesUserHaveContacts = false;
  wasUserReturned = false;

  constructor(private chatSvc: ChatService, private userSvc: UserService) {}

  ngOnInit(): void {
    this.initializeContactList();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  // TESTING
  logIt = () =>
    console.log(
      Object.entries(this.selectedUsers)
        .filter(([_, isSelected]) => !!isSelected)
        .map(([uid, _]) => uid),
    );
  // end testing

  onCreateGroupClicked = () => {
    const uids = Object.entries(this.selectedUsers)
      .filter(([_, isSelected]) => !!isSelected)
      .map(([uid, _]) => uid);
    this.chatSvc.createGroupChat(uids);
  };

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
}
