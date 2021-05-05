import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { UserI } from '@app/models/user';
import { takeUntil } from 'rxjs/operators';
import { HeaderService } from '@app/services/header.service';
import { Store } from '@ngrx/store';
import { loggedInUser, userListByIdMap } from '@app/store/user/user.selectors';
import { resetHeader, setHeaderText } from '@app/store/header/header.actions';

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

  constructor(private store: Store, private headerSvc: HeaderService) {}

  ngOnInit(): void {
    this.store
      .select(loggedInUser)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(user => {
        if (user && user.uid) {
          this.wasUserReturned = true;
        }
        this.store
          .select(userListByIdMap(user.contacts))
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(contacts => this.users$.next(contacts));
      });

    this.updateHeader();
  }

  ngOnDestroy() {
    this.store.dispatch(resetHeader());
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  updateHeader = () => {
    setTimeout(() => delayedHeaderOperations());

    const delayedHeaderOperations = () => {
      this.store.dispatch(setHeaderText({ headerText: 'My Connections' }));
    };
  };
}
