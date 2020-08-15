import { Component, OnInit } from '@angular/core';
import { HeaderOptionMapT } from '@app/components/header/header.component';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { UserI } from '@app/models/user';
import { UserService } from '@app/services/user.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'gtm-me-connections-list',
  templateUrl: './me-connections-list.component.html',
  styleUrls: ['./me-connections-list.component.scss'],
})
export class MeConnectionsListComponent implements OnInit {
  headerOptions: HeaderOptionMapT;
  users$: BehaviorSubject<UserI[]> = new BehaviorSubject([]);

  constructor(private userSvc: UserService) {}

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
}
