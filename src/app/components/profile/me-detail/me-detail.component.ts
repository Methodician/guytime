import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserI } from '@app/models/user';
import { UserService } from '@app/services/user.service';
import { Router } from '@angular/router';
import { HeaderService } from '@app/services/header.service';

@Component({
  selector: 'gtm-me-detail',
  templateUrl: './me-detail.component.html',
  styleUrls: ['./me-detail.component.scss'],
})
export class MeDetailComponent implements OnInit {
  user$ = new BehaviorSubject<UserI>(null);
  avatarUrl$ = new BehaviorSubject<string>('assets/icons/square_icon.svg');

  promptEvent;

  constructor(
    private userSvc: UserService,
    private router: Router,
    private headerSvc: HeaderService,
  ) {}

  ngOnInit(): void {
    this.user$ = this.userSvc.loggedInUser$;
    this.avatarUrl$ = this.userSvc.getLoggedInAvatarUrl();
    this.updateHeader();
  }

  updateHeader = () => {
    this.headerSvc.clearHeaderOptions();

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
  };

  onEditClicked = () => this.router.navigate(['/me/edit']);
  onConnectionsClicked = () => this.router.navigate(['/me/connections']);
}
