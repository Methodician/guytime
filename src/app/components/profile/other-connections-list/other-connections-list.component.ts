import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '@app/services/user.service';
import { UserI } from '@models/user';
import { Subject, BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { HeaderService } from '@app/services/header.service';
import { Router } from '@angular/router';

@Component({
  selector: 'gtm-other-connections-list',
  templateUrl: './other-connections-list.component.html',
  styleUrls: ['./other-connections-list.component.scss'],
})
export class OtherConnectionsListComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject();
  connectedUsers$ = new BehaviorSubject<UserI[]>([]);
  user$ = new BehaviorSubject<UserI>(null);
  doesUserHaveContacts = false;
  wasUserReturned = false;

  constructor(
    private route: ActivatedRoute,
    private userSvc: UserService,
    private headerSvc: HeaderService,
  ) {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.headerSvc.resetHeader();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        const uid = params['id'];
        this.getUserObservable(uid).subscribe(user => {
          this.user$.next(user);
          this.watchUserContacts(user);
          this.updateHeader();
        });
      }
    });
  }

  getUserObservable = (uid: string) => {
    return this.userSvc
      .userRef(uid)
      .valueChanges()
      .pipe(
        map(user => ({ ...(user as object), uid })),
        takeUntil(this.unsubscribe$),
      ) as Observable<UserI>;
  };

  watchUserContacts = (user: UserI) => {
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
      contactsObservable
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(contacts => this.connectedUsers$.next(contacts));
    }
  };

  updateHeader = () => {
    setTimeout(() => this.delayedHeaderOperations());
  };

  delayedHeaderOperations = () => {
    this.user$.pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
      if (user && user.fName)
        this.headerSvc.setHeaderText(`${user.fName}'s contacts`);
    });
  };
}
