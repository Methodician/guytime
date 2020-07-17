import { Component, OnInit } from '@angular/core';
import { IHeaderOption } from '@app/components/header/header.component';
import { BehaviorSubject } from 'rxjs';
import { UserI } from '@app/models/user';

@Component({
  selector: 'gtm-other-detail',
  templateUrl: './other-detail.component.html',
  styleUrls: ['./other-detail.component.scss'],
})
export class OtherDetailComponent implements OnInit {
  headerOptions: IHeaderOption[];
  user$ = new BehaviorSubject<UserI>({
    uid: 'DevfsZ8x1hYxNKS418vdXLrZqbv2',
    fName: 'Jimmy',
    lName: 'Martin',
    age: 23,
    relationshipStatus: 'MARRIED',
    bio: 'This is about me',
    activityTypes: [],
    connectionIds: [],
    createdAt: new Date(),
  });

  avatarUrl$ = new BehaviorSubject<string>('assets/icons/square_icon.svg');

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
  }

  logClicked = () => console.log('clicked');
}
