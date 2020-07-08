import { Component, OnInit } from '@angular/core';
import { IHeaderOption } from '../header/header.component';
import { UserI } from 'src/app/models/user';

@Component({
  selector: 'gtm-profile-list',
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.scss'],
})
export class ProfileListComponent implements OnInit {
  headerOptions: IHeaderOption[];
  profiles: UserI[] = [
    {
      uid: 'slakfsdf',
      fName: 'Dave',
      age: 38,
      activityTypes: ['INDOOR'],
      relationshipStatus: 'SINGLE',
      connectionIds: [],
    },
  ];

  constructor() {}

  ngOnInit(): void {
    this.headerOptions = [
      {
        iconName: 'place',
        optionText: 'Find by location',
        isDisabled: false,
        onClick: this.logClicked,
      },
      {
        iconName: 'clear_all',
        optionText: 'Clear all filters',
        isDisabled: true,
        onClick: this.logClicked,
      },
    ];
  }

  logClicked = () => console.log('clicked');
}
