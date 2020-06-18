import { Component, OnInit } from '@angular/core';
import { IHeaderOption } from '../header/header.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireUploadTask } from '@angular/fire/storage';
import { RelationshipStatusM, ActivityTypeM } from 'src/app/models/user';
import { HtmlInputEventI } from 'src/app/models/shared';

@Component({
  selector: 'gtm-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss'],
})
export class ProfileEditComponent implements OnInit {
  relationshipStatusMap = RelationshipStatusM;
  activityTypeMap = ActivityTypeM;

  form: FormGroup;
  avatarFile: File;
  imageUploadTask: AngularFireUploadTask;
  avatarUrl: string | ArrayBuffer =
    'https://material.angular.io/assets/img/examples/shiba1.jpg';

  headerOptions: IHeaderOption[];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      fName: ['Dave', Validators.required],
      lName: ['Asprey', Validators.required],
      age: [42, Validators.required],
      relationshipStatus: ['SINGLE'],
      activityTypes: [['INDOOR']],
      bio: ['', Validators.required],
    });
    this.headerOptions = [
      {
        iconName: 'account_circle',
        optionText: 'Back to Me',
        isDisabled: true,
        onClick: this.logClicked,
      },
    ];
  }

  onSelectAvatar = ($e: HtmlInputEventI) => {
    const reader = new FileReader();
    reader.onload = () => {
      this.avatarUrl = reader.result;
    };

    const file = $e.target.files[0];
    reader.readAsDataURL(file);
    this.avatarFile = file;
  };

  isActivityTypeSelected = (activityType: string) =>
    this.form.value.activityTypes.includes(activityType);

  onActivityTypeClicked = (activityType: string) => {
    const activityTypes = [...(this.form.value.activityTypes as Array<string>)];
    const activityTypeIndex = activityTypes.indexOf(activityType);
    if (activityTypeIndex === -1) {
      activityTypes.push(activityType);
    } else {
      activityTypes.splice(activityTypeIndex, 1);
    }
    this.form.patchValue({ activityTypes: activityTypes });
  };

  trimInput = formControlName => {
    this.form.patchValue({
      [formControlName]: this.form.value[formControlName].trim(),
    });
  };

  onSaveClicked = () => {
    console.log(this.form.value);
    console.log(this.form.valid);
  };

  logClicked = () => console.log('clicked');
}
