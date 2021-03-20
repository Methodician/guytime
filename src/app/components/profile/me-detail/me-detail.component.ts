import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { HeaderService } from '@app/services/header.service';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { loggedInUser } from '@app/store/user/user.selectors';

@Component({
  selector: 'gtm-me-detail',
  templateUrl: './me-detail.component.html',
  styleUrls: ['./me-detail.component.scss'],
})
export class MeDetailComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject();
  user$ = this.store.select(loggedInUser);

  promptEvent;

  constructor(
    private store: Store,
    private router: Router,
    private headerSvc: HeaderService,
  ) {}

  ngOnInit(): void {
    setTimeout(() => this.updateHeader());
  }

  ngOnDestroy(): void {
    this.headerSvc.resetHeader();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  updateHeader = () => {
    this.headerSvc.setHeaderOption('editDetails', {
      iconName: 'edit',
      optionText: 'Edit Details',
      isDisabled: false,
      onClick: this.onEditClicked,
    });

    this.headerSvc.setHeaderOption('connections', {
      iconName: 'people',
      optionText: 'Connections',
      isDisabled: false,
      onClick: this.onConnectionsClicked,
    });

    this.user$.pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
      if (user && user.fName)
        this.headerSvc.setHeaderText(`About ${user.fName}`);
    });
  };

  onEditClicked = () => this.router.navigate(['/me/edit']);
  onConnectionsClicked = () => this.router.navigate(['/me/connections']);
}
