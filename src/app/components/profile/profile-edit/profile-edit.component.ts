import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireUploadTask } from '@angular/fire/compat/storage';
import {
  RelationshipStatusM,
  IcebreakerQuestionM,
  ActivityTypeM,
  UserI,
  ProfileImageSizeT,
} from '@models/user';
import { HtmlInputEventI } from '@models/shared';
import { UserService } from '@services/user.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { avatarFileName, loggedInUser } from '@app/store/user/user.selectors';
import { resetHeader, setHeaderText } from '@app/store/header/header.actions';
import { MatChipInputEvent} from '@angular/material/chips';
import { COMMA, ENTER} from '@angular/cdk/keycodes';

export interface ProfileTag {
  name: string;
}

@Component({
  selector: 'gtm-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss'],
})
export class ProfileEditComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject();
  relationshipStatusMap = RelationshipStatusM;
  icebreakerQuestionMap = IcebreakerQuestionM;
  activityTypeMap = ActivityTypeM;

  form: FormGroup;

  avatarSize: ProfileImageSizeT = '90x90';
  avatarFileName$: Observable<String>;
  avatarFile: File;
  imageUploadTask: AngularFireUploadTask;
  avatarUrl$: BehaviorSubject<string | ArrayBuffer> = new BehaviorSubject(null);

  removable                   = true;
  addOnBlur                   = true;
  readonly separatorKeysCodes = [ ENTER, COMMA ] as const;
  tagsAreSelectable = true;
  tags: ProfileTag[] = [
    { name: 'Chess' },
    { name: 'Video Games' },
    { name: 'Basketball' },
  ];

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private userSvc: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      fName: ['', Validators.required],
      lName: ['', Validators.required],
      age: [0, Validators.required],
      relationshipStatus: [null, Validators.required],
      activityTypes: [[]],
      bio: ['', Validators.required],
    });
    this.watchLoggedInUser();
    this.updateHeader();
  }

  ngOnDestroy(): void {
    this.store.dispatch(resetHeader());
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  updateHeader = () => {
    setTimeout(() => delayedHeaderOperations());

    const delayedHeaderOperations = () => {
      this.store.dispatch(setHeaderText({ headerText: 'Update Your Info' }));
    };
  };

  watchLoggedInUser = () => {
    this.store
      .select(loggedInUser)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(user => {
        if (!user?.uid) return;

        this.avatarFileName$ = this.store.select(
          avatarFileName(user.uid, '90x90'),
        );

        this.form.patchValue(user);
      });
  };

  onSelectAvatar = ($e: HtmlInputEventI) => {
    if ($e.target.files.length === 0) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.avatarUrl$.next(reader.result);
    };

    const file = $e.target.files[0];
    reader.readAsDataURL(file);
    this.avatarFile = file;
  }

  add( event: MatChipInputEvent ): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if ( value ) {
      this.tags.push({ name: value });
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove( fruit: ProfileTag ): void {
    const index = this.tags.indexOf(fruit);

    if ( index >= 0 ) {
      this.tags.splice(index, 1);
    }
  }

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

    const saveProfileImage = () => {
      const isComplete$ = new BehaviorSubject(false);
      if (!this.avatarFile) {
        isComplete$.next(true);
      } else {
        this.userSvc
          .uploadProfileImage(this.avatarFile)
          .then(({ task }) => task.then(() => isComplete$.next(true)));
        // ToDo: add progress dialog
      }
      return isComplete$;
    };

    const profileImageSub = saveProfileImage()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(async isComplete => {
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
      });
  };

  logClicked = () => console.log('clicked');
}
