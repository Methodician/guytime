import { Component, OnInit } from '@angular/core';
import { UserService } from '@app/services/user.service';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { UserI } from '@app/models/user';
import { HeaderOptionMapT } from '@app/components/header/header.component';

@Component({
  selector: 'gtm-browse-guys-list',
  templateUrl: './browse-guys-list.component.html',
  styleUrls: ['./browse-guys-list.component.scss'],
})
export class BrowseGuysListComponent implements OnInit {
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
