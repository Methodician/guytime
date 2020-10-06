import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { UserI } from '@app/models/user';
import { UserService } from '@app/services/user.service';
import { map, takeUntil } from 'rxjs/operators';
import { HeaderService } from '@app/services/header.service';

@Component({
  selector: 'gtm-me-connections-list',
  templateUrl: './me-connections-list.component.html',
  styleUrls: ['./me-connections-list.component.scss'],
})
export class MeConnectionsListComponent implements OnInit {
  private unsubscribe$: Subject<void> = new Subject();

  users$: BehaviorSubject<UserI[]> = new BehaviorSubject([]);
  doesUserHaveContacts = false;
  wasUserReturned = false;

  constructor(private userSvc: UserService, private headerSvc: HeaderService) {}

  ngOnDestroy() {
    this.headerSvc.resetHeader();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.userSvc.loggedInUser$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(user => {
        if (user && user.uid) {
          this.wasUserReturned = true;
        }
        if (user && user.contacts && Object.keys(user.contacts).length > 0) {
          this.doesUserHaveContacts = true;
          const contactIds = Object.keys(user.contacts).map(contact => contact);
          const contactObservables = contactIds.map(id =>
            this.userSvc
              .userRef(id)
              .snapshotChanges()
              .pipe(
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

    setTimeout(() => this.updateHeader());
  }

  updateHeader = () => {
    this.headerSvc.setDefaultXUrl('/me');
    this.headerSvc.setHeaderText('My connections');
  };
}
