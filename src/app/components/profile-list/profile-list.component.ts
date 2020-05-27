import { Component, OnInit } from '@angular/core';
import { IHeaderOption } from '../header/header.component';

@Component({
  selector: 'gtm-profile-list',
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.scss'],
})
export class ProfileListComponent implements OnInit {
  headerOptions: IHeaderOption[];

  guys = [
    {
      id: 'fa34f',
      name: 'Dave',
      age: '38',
      interests: ['nature_people', 'home_work'],
    },
    { id: 'adc3d3', name: 'John', age: '35', interests: ['home_work'] },
    {
      id: 'fad32f',
      name: 'Jacob',
      age: '35',
      interests: ['nature_people', 'home_work'],
    },
    { id: 'af3a2w3', name: 'Brandon', age: '35', interests: ['nature_people'] },
    {
      id: 'a32f2',
      name: 'Randy',
      age: '18',
      interests: ['nature_people', 'home_work'],
    },
    { id: 'af3232', name: 'Falafel', age: '22', interests: ['home_work'] },
    {
      id: 'stg5g5dg',
      name: 'Ignatious',
      age: '65',
      interests: ['nature_people', 'home_work'],
    },
    { id: 'gs5g', name: 'Applesauce', age: '60', interests: ['nature_people'] },
    {
      id: 'va34rv43',
      name: 'Cavalier',
      age: '48',
      interests: ['nature_people', 'home_work'],
    },
    { id: 'v63v4', name: 'Stu', age: '19', interests: ['home_work'] },
    {
      id: 'rvav32v',
      name: 'fang',
      age: '29',
      interests: ['nature_people', 'home_work'],
    },
    { id: 'c3a2cra2c', name: 'n00b', age: '40', interests: ['nature_people'] },
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
