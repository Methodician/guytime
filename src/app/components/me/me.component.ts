import { Component, OnInit } from '@angular/core';
import { IHeaderOption } from '../header/header.component';
import { Router } from '@angular/router';

@Component({
  selector: 'gtm-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss'],
})
export class MeComponent implements OnInit {
  promptEvent;

  headerOptions: IHeaderOption[];

  constructor(private router: Router) {}

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

  logClicked = () => console.log('clicked');

  onEditClicked = () => this.router.navigate(['/me/edit']);
}
