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
      // this.form.markAsDirty();
      this.avatarUrl = reader.result;
    };

    const file = $e.target.files[0];
    reader.readAsDataURL(file);
    this.avatarFile = file;
  };

  logClicked = () => console.log('clicked');
}

export interface IHtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}
