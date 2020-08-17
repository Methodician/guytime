import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { UserI } from '@app/models/user';
import { UserService } from '@app/services/user.service';
import { Router } from '@angular/router';
import { HeaderService } from '@app/services/header.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'gtm-me-detail',
  templateUrl: './me-detail.component.html',
  styleUrls: ['./me-detail.component.scss'],
})
export class MeDetailComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject();
  user$ = new BehaviorSubject<UserI>(null);
  avatarUrl$ = new BehaviorSubject<string>('assets/icons/square_icon.svg');

  promptEvent;

  constructor(
    private userSvc: UserService,
    private router: Router,
    private headerSvc: HeaderService,
  ) {}

  ngOnDestroy(): void {
    this.headerSvc.resetHeader();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.user$ = this.userSvc.loggedInUser$;
    this.avatarUrl$ = this.userSvc.getLoggedInAvatarUrl();
    setTimeout(() => this.updateHeader());
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
