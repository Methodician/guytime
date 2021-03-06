import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { loggedInUser } from '@app/store/user/user.selectors';
import {
  addHeaderOptions,
  resetHeader,
  setHeaderText,
} from '@app/store/header/header.actions';

@Component({
  selector: 'gtm-me-detail',
  templateUrl: './me-detail.component.html',
  styleUrls: ['./me-detail.component.scss'],
})
export class MeDetailComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject();
  user$ = this.store.select(loggedInUser);

  promptEvent;

  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    setTimeout(() => this.updateHeader());
  }

  ngOnDestroy(): void {
    this.store.dispatch(resetHeader());
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  updateHeader = () => {
    const optionsToAdd = new Map([
      [
        'seePeople',
        {
          iconName: 'edit',
          optionText: 'Edit Details',
          isDisabled: false,
          onClick: this.onEditClicked,
        },
      ],
      [
        'connections',
        {
          iconName: 'people',
          optionText: 'Connections',
          isDisabled: false,
          onClick: this.onConnectionsClicked,
        },
      ],
    ]);

    this.store.dispatch(addHeaderOptions({ optionsToAdd }));

    this.user$.pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
      if (user && user.fName) {
        this.store.dispatch(
          setHeaderText({ headerText: `About ${user.fName}` }),
        );
      }
    });
  };

  onEditClicked = () => this.router.navigate(['/me/edit']);
  onConnectionsClicked = () => this.router.navigate(['/me/connections']);
}
