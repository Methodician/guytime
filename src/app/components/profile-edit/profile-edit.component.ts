import { Component, OnInit } from '@angular/core';
import { IHeaderOption } from '../header/header.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireUploadTask } from '@angular/fire/storage';
import { RelationshipStatusM, ActivityTypeM, UserI } from 'src/app/models/user';
import { HtmlInputEventI } from 'src/app/models/shared';
import { UserService } from 'src/app/services/user.service';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from 'src/app/services/storage.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

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
  avatarUrl: string | ArrayBuffer = '';

  headerOptions: IHeaderOption[];

  constructor(
    private fb: FormBuilder,
    private userSvc: UserService,
    private router: Router,
    authSvc: AuthService,
    storageSvc: StorageService,
  ) {
    authSvc.authInfo$.subscribe(info => {
      if (info.uid) {
        storageSvc
          .getDownloadUrl(`profileImages/${info.uid}`)
          .then(url => (this.avatarUrl = url));
      }
    });
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      fName: ['', Validators.required],
      lName: ['', Validators.required],
      age: [0, Validators.required],
      relationshipStatus: [null],
      activityTypes: [[]],
      bio: ['', Validators.required],
    });
    this.watchLoggedInUser();
    this.headerOptions = [
      {
        iconName: 'account_circle',
        optionText: 'Back to Me',
        isDisabled: true,
        onClick: this.logClicked,
      },
    ];
  }

  watchLoggedInUser = () => {
    this.userSvc.loggedInUser$.subscribe(user => {
      this.form.patchValue(user);
    });
  };

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
    if (!this.form.valid) {
      alert('Please make sure all required fields are filled before saving');
      return;
    }
    const profileImageSub = this.saveProfileImage().subscribe(
      async isComplete => {
        if (!isComplete) return;

        try {
          const formVal: UserI = this.form.value;
          await this.userSvc.updateUser(formVal);
          this.router.navigate(['/me']);
        } catch (error) {
          console.error(error);
        } finally {
          if (profileImageSub) profileImageSub.unsubscribe();
          return;
        }
      },
    );
  };

  saveProfileImage = () => {
    const isComplete$ = new BehaviorSubject(false);
    if (!this.avatarFile) {
      isComplete$.next(true);
    } else {
      const { task } = this.userSvc.uploadProfileImage(this.avatarFile);
      // ToDo: add progress dialog
      task.then(() => {
        isComplete$.next(true);
      });
    }
    return isComplete$;
  };

  logClicked = () => console.log('clicked');
}
