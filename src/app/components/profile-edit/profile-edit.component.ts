import { Component, OnInit } from '@angular/core';
import { IHeaderOption } from '../header/header.component';
import { FormGroup } from '@angular/forms';
import { AngularFireUploadTask } from '@angular/fire/storage';

@Component({
  selector: 'gtm-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss'],
})
export class ProfileEditComponent implements OnInit {
  form: FormGroup;
  avatarFile: File;
  imageUploadTask: AngularFireUploadTask;
  avatarUrl: string | ArrayBuffer =
    'https://material.angular.io/assets/img/examples/shiba1.jpg';

  bio = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sollicitudin tempor id eu nisl nunc mi ipsum faucibus. Sapien et ligula ullamcorper malesuada proin. Habitant morbi tristique senectus et netus et malesuada. Tortor consequat id porta nibh venenatis cras. Tempus iaculis urna id volutpat lacus. Suspendisse ultrices gravida dictum fusce. Ipsum dolor sit amet consectetur adipiscing elit. Lectus vestibulum mattis ullamcorper velit sed ullamcorper. Mauris pharetra et ultrices neque ornare aenean euismod elementum. Adipiscing commodo elit at imperdiet dui accumsan sit amet.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sollicitudin tempor id eu nisl nunc mi ipsum faucibus. Sapien et ligula ullamcorper malesuada proin. Habitant morbi tristique senectus et netus et malesuada. Tortor consequat id porta nibh venenatis cras. Tempus iaculis urna id volutpat lacus. Suspendisse ultrices gravida dictum fusce. Ipsum dolor sit amet consectetur adipiscing elit. Lectus vestibulum mattis ullamcorper velit sed ullamcorper. Mauris pharetra et ultrices neque ornare aenean euismod elementum. Adipiscing commodo elit at imperdiet dui accumsan sit amet.`;

  headerOptions: IHeaderOption[];

  selectedInterests = ['outdoors'];

  constructor() {}

  ngOnInit(): void {
    this.headerOptions = [
      {
        iconName: 'account_circle',
        optionText: 'Back to Me',
        isDisabled: true,
        onClick: this.logClicked,
      },
    ];
  }

  onSelectAvatar = ($e: IHtmlInputEvent) => {
    const reader = new FileReader();
    reader.onload = () => {
      this.avatarUrl = reader.result;
    };

    const file = $e.target.files[0];
    reader.readAsDataURL(file);
    this.avatarFile = file;
  };

  isInterestSelected = (interest: string) =>
    this.selectedInterests.includes(interest);

  onInterestClicked = (interest: string) => {
    const interestIndex = this.selectedInterests.indexOf(interest);
    if (interestIndex === -1) {
      this.selectedInterests.push(interest);
    } else {
      this.selectedInterests.splice(interestIndex, 1);
    }
  };

  logClicked = () => console.log('clicked');
}

export interface IHtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}
