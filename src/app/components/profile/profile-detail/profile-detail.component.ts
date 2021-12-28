import { Component, Input }                 from '@angular/core';
import {
  UserI,
  ProfileImageSizeT,
}                                                                    from '@app/models/user';
import { TagI }                                                      from '@models/tag';
import { Store }                                          from '@ngrx/store';
import { loadTagsForUserId }                              from '@app/store/tag/tag.actions';
import { tagsForUser }                                    from '@app/store/tag/tag.selectors';
import { takeUntil }                                      from 'rxjs/operators';
import { Subject }                                        from 'rxjs';
import {
  icebreakerAnswerForUser,
  icebreakers as selectIcebreakers,
}                                                         from '@app/store/icebreaker/icebreaker.selectors';
import { loadIcebreakerAnswerForUserId, loadIcebreakers } from '@app/store/icebreaker/icebreaker.actions';
import { IcebreakerAnswerI, IcebreakerI }                 from '@models/icebreaker';
import { resetHeader }                                    from '@app/store/header/header.actions';

@Component({
  selector: 'gtm-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.scss'],
})
export class ProfileDetailComponent {
  private unsubscribe$: Subject<void> = new Subject();
  @Input() userInfo: UserI;
  tags: TagI[] = [];
  icebreakers: IcebreakerI[] = [];
  icebreakerAnswer: IcebreakerAnswerI | null = null;
  icebreaker: IcebreakerI | null = null;

  avatarSize: ProfileImageSizeT = 'fullSize';

  constructor( private store: Store, ) {}

  ngOnInit() {
    if (!this.userInfo) {
      throw new Error(
        "Don't initialize a profile-detail component without the userInfo being loaded already.",
      );
    }
    this.watchIcebreakers();
    this.watchUserTags();
    this.watchIcebreakerAnswer();
    this.store.dispatch(loadTagsForUserId({userId: this.userInfo.uid}));
    this.store.dispatch(loadIcebreakers());
    this.store.dispatch(loadIcebreakerAnswerForUserId({userId: this.userInfo.uid}));
  }

  ngOnDestroy(): void {
    this.store.dispatch(resetHeader());
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  avatarFileName = () =>
    this.userInfo?.uploadedProfileImageMap?.[this.avatarSize]?.fileName;

  avatarFileHash = () =>
    this.userInfo?.uploadedProfileImageMap?.[this.avatarSize]?.imageUpdateRando;

  watchUserTags = () => {
    this.store
      .select(tagsForUser)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(tags => {
        this.tags = tags;
      });
  }

  watchIcebreakers = () => {
    this.store
      .select(selectIcebreakers)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((icebreakers) => {
        this.icebreakers = icebreakers;
        if (this.icebreakerAnswer && !this.icebreaker) {
          this.icebreaker = this.icebreakers.find(( ib ) => ib.id === this.icebreakerAnswer.icebreakerId);
        }
      });
  }

  watchIcebreakerAnswer = () => {
    this.store
      .select(icebreakerAnswerForUser)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(icebreakerAnswer => {
        if (this.icebreakers.length > 0) {
          this.icebreaker = this.icebreakers.find(( ib ) => ib.id === icebreakerAnswer.icebreakerId);
        }
        this.icebreakerAnswer = icebreakerAnswer;
      });
  }
}
