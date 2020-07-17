import { Component, OnInit } from '@angular/core';
import { IHeaderOption } from '@app/components/header/header.component';
import { BehaviorSubject } from 'rxjs';
import { UserI } from '@app/models/user';
import { UserService } from '@app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'gtm-me-detail',
  templateUrl: './me-detail.component.html',
  styleUrls: ['./me-detail.component.scss'],
})
export class MeDetailComponent implements OnInit {
  headerOptions: IHeaderOption[];
  user$ = new BehaviorSubject<UserI>(null);
  avatarUrl$ = new BehaviorSubject<string>('assets/icons/square_icon.svg');

  promptEvent;

  constructor(private userSvc: UserService, private router: Router) {}

  ngOnInit(): void {
    this.user$ = this.userSvc.loggedInUser$;
    this.avatarUrl$ = this.userSvc.getLoggedInAvatarUrl();
    this.headerOptions = [
      {
        iconName: 'edit',
        optionText: 'Edit Details',
        isDisabled: false,
        onClick: this.onEditClicked,
      },
      {
        iconName: 'people',
        optionText: 'Connections',
        isDisabled: true,
        onClick: this.logClicked,
      },
    ];
  }

  onEditClicked = () => this.router.navigate(['/me/edit']);
  logClicked = () => console.log('clicked');
}
