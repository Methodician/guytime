import { Component, OnInit } from '@angular/core';
import { IHeaderOption } from '../header/header.component';

@Component({
  selector: 'gtm-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss'],
})
export class MeComponent implements OnInit {
  promptEvent;

  headerOptions: IHeaderOption[];

  constructor() {}

  ngOnInit(): void {
    this.headerOptions = [
      {
        iconName: 'edit',
        optionText: 'Edit Details',
        isDisabled: false,
        onClick: this.logClicked,
      },
      {
        iconName: 'people',
        optionText: 'Connections',
        isDisabled: true,
        onClick: this.logClicked,
      },
    ];
  }

  logClicked = () => console.log('clicked');
}
