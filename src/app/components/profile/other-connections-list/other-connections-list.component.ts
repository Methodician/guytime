import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '@app/services/user.service';
import { UserI } from '@models/user';
import { Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

@Component({
  selector: 'gtm-other-connections-list',
  templateUrl: './other-connections-list.component.html',
  styleUrls: ['./other-connections-list.component.scss'],
})
export class OtherConnectionsListComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject();
  connectedUsers$ = new BehaviorSubject<UserI[]>([]);
  doesUserHaveContacts = false;
  wasUserReturned = false;

  constructor(private route: ActivatedRoute, private userSvc: UserService) {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        const uid = params['id'];
        const user$ = this.getUserObservable(uid);
        user$.pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
          this.watchUserContacts(user);
        });
      }
    });
  }

  getUserObservable = (uid: string) => {
    return this.userSvc
      .userRef(uid)
      .valueChanges()
      .pipe(map(user => ({ ...user, uid })));
  };

  watchUserContacts = (user: UserI) => {
    console.log(user);
    if (user && user.uid) {
      this.wasUserReturned = true;
    }
    if (user && user.contacts) {
      this.doesUserHaveContacts = true;
      const contactIds = Object.keys(user.contacts);
      const contactObservables = contactIds.map(id =>
        this.getUserObservable(id),
      );
      const contactsObservable = combineLatest(contactObservables);
      contactsObservable.subscribe(contacts =>
        this.connectedUsers$.next(contacts),
      );
    }
  };
}
