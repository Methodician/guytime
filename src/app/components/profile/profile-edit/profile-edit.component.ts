import { Component, OnInit, OnDestroy }                               from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { AngularFireUploadTask }                                      from '@angular/fire/compat/storage';
import {
  ProfileImageSizeT,
}                                               from '@models/user';
import { HtmlInputEventI }                      from '@models/shared';
import { UserService }                          from '@services/user.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Router }                         from '@angular/router';
import { takeUntil }                      from 'rxjs/operators';
import { Store }                          from '@ngrx/store';
import { avatarFileName, loggedInUser }   from '@app/store/user/user.selectors';
import { resetHeader, setHeaderText }     from '@app/store/header/header.actions';
import { MatChipInputEvent}               from '@angular/material/chips';
import { COMMA, ENTER}                    from '@angular/cdk/keycodes';
import { TagI }                           from '@models/tag';
import { loadTagsForUserId }              from '@app/store/tag/tag.actions';
import { tagsForUser }                    from '@app/store/tag/tag.selectors';
import { IcebreakerAnswerI, IcebreakerI }       from '@models/icebreaker';
import { icebreakerAnswerForUser, icebreakers as selectIcebreakers } from '@app/store/icebreaker/icebreaker.selectors';
import { loadIcebreakerAnswerForUserId, loadIcebreakers }            from '@app/store/icebreaker/icebreaker.actions';

@Component({
  selector: 'gtm-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss'],
})
export class ProfileEditComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject();

  stepOne: FormGroup;
  stepTwo: FormGroup;
  stepThree: FormGroup;

  avatarSize: ProfileImageSizeT = '90x90';
  avatarFileName$: Observable<String>;
  avatarFile: File;
  imageUploadTask: AngularFireUploadTask;
  avatarUrl$: BehaviorSubject<string | ArrayBuffer> = new BehaviorSubject(null);

  removable                   = true;
  addOnBlur                   = true;
  readonly separatorKeysCodes = [ ENTER, COMMA ] as const;
  tagsAreSelectable = true;
  tags: TagI[] = [];
  icebreakers: IcebreakerI[] = [];
  icebreakerAnswer: IcebreakerAnswerI;
  icebreaker = null;


  constructor(
    private store: Store,
    private fb: FormBuilder,
    private userSvc: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.stepOne = this.fb.group({
      fName: ['', Validators.required],
      lName: ['', Validators.required],
      age: [0, Validators.required],
    });
    this.stepTwo = this.fb.group({
      tags: this.fb.array(this.tags),
    });
    this.stepThree = this.fb.group({
      icebreakerId: ['', Validators.required],
      icebreakerAnswerText: ['', Validators.required],
    });
    this.watchLoggedInUser();
    this.watchLoggedInUserTags();
    this.watchIcebreakers();
    this.watchLoggedInUserIcebreakerAnswer();
    this.updateHeader();
    this.store.dispatch(loadIcebreakers());
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
  }

  watchLoggedInUser = () => {
    this.store
      .select(loggedInUser)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(user => {
        if (!user?.uid) return;

        this.avatarFileName$ = this.store.select(
          avatarFileName(user.uid, '90x90'),
        );

        this.stepOne.patchValue(user);
        this.store.dispatch(loadTagsForUserId({ userId: user.uid }));
        this.store.dispatch(loadIcebreakerAnswerForUserId({ userId: user.uid }));
      });
  }

  watchLoggedInUserTags = () => {
    this.store
      .select(tagsForUser)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(tags => {
        this.tags = tags;
      });
  }

  watchLoggedInUserIcebreakerAnswer = () => {
    this.store
      .select(icebreakerAnswerForUser)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(icebreakerAnswer => {
        if (icebreakerAnswer) {
          this.icebreakerAnswer = icebreakerAnswer;
          this.stepThree.patchValue({
            icebreakerAnswerText: icebreakerAnswer.text,
            icebreakerId: icebreakerAnswer.icebreakerId,
          });
        }
      });
  }

  watchIcebreakers = () => {
    this.store
      .select(selectIcebreakers)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(icebreakers => {
        this.icebreakers = icebreakers;
      });
  }

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

  add( event: MatChipInputEvent, ): void {
    const value = (event.value || '').trim();

    // Add our tag
    if ( value ) {
      const newArray = Array.from(this.tags);
      newArray.push({ name: value, type: 'profile' });
      this.tags = newArray;

    }

    // Clear the input value
    event.chipInput.clear();
  }

  remove( tag: TagI ): void {
    const index = this.tags.indexOf(tag);

    if ( index >= 0 ) {
      const newArray = Array.from(this.tags);
      newArray.splice(index, 1);
      this.tags = newArray;
    }
  }

  trimInput = formControlName => {
    this.stepOne.patchValue({
      [formControlName]: this.stepOne.value[formControlName].trim(),
    });
  }

  onSaveClicked = () => {
    if (!this.stepThree.valid) {
      alert('Please make sure all required fields are filled before saving');
      return;
    }

    const formValues = {
      ...this.stepOne.value,
      ...this.stepThree.value,
      tags: this.tags,
    };

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
          await this.userSvc.updateUser(formValues);
          this.router.navigate(['/me']);
        } catch (error) {
          console.error(error);
        } finally {
          if (profileImageSub) profileImageSub.unsubscribe();
          return;
        }
      });
  }

}
