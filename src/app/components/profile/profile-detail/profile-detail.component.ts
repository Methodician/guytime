import { Component, OnInit } from '@angular/core';
import { IHeaderOption } from 'src/app/components/header/header.component';

@Component({
  selector: 'gtm-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.scss'],
})
export class ProfileDetailComponent implements OnInit {
  headerOptions: IHeaderOption[];
  title = 'About Them';
  loggedInUserHame = 'Dave';
  constructor() {}

  ngOnInit(): void {
    this.headerOptions = [
      {
        iconName: 'people',
        optionText: 'See their connections',
        isDisabled: false,
        onClick: this.logClicked,
      },
      {
        iconName: 'person_add',
        optionText: 'Connect with them',
        isDisabled: true,
        onClick: this.logClicked,
      },
      {
        iconName: 'message',
        optionText: 'Chat with them',
        isDisabled: true,
        onClick: this.logClicked,
      },
    ];

    this.title = `About ${this.loggedInUserHame}`;
  }

  logClicked = () => console.log('clicked');
}
