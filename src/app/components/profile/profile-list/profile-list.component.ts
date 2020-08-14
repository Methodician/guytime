import { Component, OnInit } from '@angular/core';
import { HeaderOptionMapT } from '@components/header/header.component';
import { UserI } from '@models/user';
import { UserService } from '@services/user.service';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'gtm-profile-list',
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.scss'],
})
export class ProfileListComponent implements OnInit {
  headerOptions: HeaderOptionMapT;
  users$: BehaviorSubject<UserI[]> = new BehaviorSubject([]);

  constructor(private userSvc: UserService) {}

  ngOnInit(): void {
    this.userSvc
      .namedUsersRef()
      .snapshotChanges()
      .pipe(
        map(snapList =>
          snapList.map(userSnap => {
            const data = userSnap.payload.doc.data();
            const uid = userSnap.payload.doc.id;
            return { uid, ...data };
          }),
        ),
      )
      .subscribe(users => this.users$.next(users));

    this.headerOptions = new Map([
      [
        'findByLocation',
        {
          iconName: 'place',
          optionText: 'Find by location',
          isDisabled: false,
          onClick: this.logClicked,
        },
      ],
      [
        'clearAllFilters',
        {
          iconName: 'clear_all',
          optionText: 'Clear all filters',
          isDisabled: true,
          onClick: this.logClicked,
        },
      ],
    ]);
  }

  logClicked = () => console.log('clicked');
}
