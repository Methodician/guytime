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
