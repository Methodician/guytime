import { Component, OnInit } from '@angular/core';
import { IHeaderOption } from '../header/header.component';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import {
  UserI,
  RelationshipStatusM,
  ActivityTypeM,
  ActivityTypeT,
} from 'src/app/models/user';
import { StorageService } from 'src/app/services/storage.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'gtm-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss'],
})
export class MeComponent implements OnInit {
  relationshipStatusMap = RelationshipStatusM;
  activityTypeMap = ActivityTypeM;

  promptEvent;

  headerOptions: IHeaderOption[];

  userInfo$: BehaviorSubject<UserI>;
  avatarUrl: string = '';

  constructor(
    private router: Router,
    userSvc: UserService,
    storageSvc: StorageService,
  ) {
    this.userInfo$ = userSvc.loggedInUser$;
    this.userInfo$.subscribe(info => {
      if (info.uid) {
        storageSvc
          .getDownloadUrl(`profileImages/${info.uid}`)
          .then(url => (this.avatarUrl = url));
      }
    });
  }

  ngOnInit(): void {
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

  isActivityTypeSelected = (activityType: ActivityTypeT) =>
    this.userInfo$.value.activityTypes.includes(activityType);

  onEditClicked = () => this.router.navigate(['/me/edit']);

  logClicked = () => console.log('clicked');
}
