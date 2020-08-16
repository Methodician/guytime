import { Component, OnInit } from '@angular/core';
import { UserService } from '@app/services/user.service';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { UserI } from '@app/models/user';
import { HeaderService } from '@app/services/header.service';

@Component({
  selector: 'gtm-browse-guys-list',
  templateUrl: './browse-guys-list.component.html',
  styleUrls: ['./browse-guys-list.component.scss'],
})
export class BrowseGuysListComponent implements OnInit {
  users$: BehaviorSubject<UserI[]> = new BehaviorSubject([]);

  constructor(private userSvc: UserService, private headerSvc: HeaderService) {}

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
      .subscribe(users => {
        const otherUsers = users.filter(
          user => user.uid !== this.userSvc.loggedInUser$.value.uid,
        );
        this.users$.next(otherUsers);
      });

    this.updateHeader();
  }

  updateHeader = () => {
    this.headerSvc.clearHeaderOptions();

    this.headerSvc.setHeaderOption('findByLocation', {
      iconName: 'place',
      optionText: 'Find by location',
      isDisabled: false,
      onClick: this.logClicked,
    });

    this.headerSvc.setHeaderOption('clearAllFilters', {
      iconName: 'clear_all',
      optionText: 'Clear all filters',
      isDisabled: true,
      onClick: this.logClicked,
    });
  };

  logClicked = () => console.log('clicked');
}
