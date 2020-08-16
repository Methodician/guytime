import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { UserI } from '@app/models/user';
import { UserService } from '@app/services/user.service';
import { map } from 'rxjs/operators';
import { HeaderService } from '@app/services/header.service';

@Component({
  selector: 'gtm-me-connections-list',
  templateUrl: './me-connections-list.component.html',
  styleUrls: ['./me-connections-list.component.scss'],
})
export class MeConnectionsListComponent implements OnInit {
  users$: BehaviorSubject<UserI[]> = new BehaviorSubject([]);

  constructor(private userSvc: UserService, private headerSvc: HeaderService) {}

  ngOnInit(): void {
    this.userSvc.loggedInUser$.subscribe(user => {
      if (user && user.contacts) {
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
        contactsObservable.subscribe(contacts => this.users$.next(contacts));
      }
    });
  }

  updateHeader = () => {
    this.headerSvc.clearHeaderOptions();
  };
}
