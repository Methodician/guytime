import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router }       from '@angular/router';
import { UserI } from '@app/models/user';
import { FcmService } from '@app/services/fcm.service';

import { resetHeader, } from '@app/store/header/header.actions';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'gtm-main-notification',
  templateUrl: './main-notification.component.html',
  styleUrls: ['./main-notification.component.scss'],
})
export class MainNotificationComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject();

  users$: BehaviorSubject<UserI[]> = new BehaviorSubject([]);

  constructor(
    private store: Store,
    private fcmSvc: FcmService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // this.fcmSvc.messages.subscribe((message: any) => {
    //   console.log(`Foreground message: ${message}`)
    // })
  }

  ngOnDestroy() {
    this.store.dispatch(resetHeader());
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
