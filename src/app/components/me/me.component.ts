import { Component, OnInit } from '@angular/core';
import { IHeaderOption } from '../header/header.component';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { UserI, RelationshipStatusM } from 'src/app/models/user';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'gtm-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss'],
})
export class MeComponent implements OnInit {
  relationshipStatusMap = RelationshipStatusM;

  promptEvent;

  headerOptions: IHeaderOption[];

  userInfo$: BehaviorSubject<UserI>;
  avatarUrl$: Observable<string>;

  constructor(private router: Router, private userSvc: UserService) {}

  ngOnInit(): void {
    this.userInfo$ = this.userSvc.loggedInUser$;
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
