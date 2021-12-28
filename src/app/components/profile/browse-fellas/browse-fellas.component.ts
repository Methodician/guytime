import { Component, OnInit }                      from '@angular/core';
import { Router }                                                    from '@angular/router';
import { authUid }                                                   from '@app/store/auth/auth.selectors';
import { ProfileImageSizeT, }                    from '@app/models/user';
import { ChatService }                                               from '@app/services/chat.service';
import { Store }                                                     from '@ngrx/store';
import { map, take, takeUntil }                                      from 'rxjs/operators';
import { selectedFella }                                             from '@app/store/browse/browse.selectors';
import {addFella, nextFella, previousFella}                          from '@app/store/browse/browse.actions';
import { combineLatest, Subject }                                    from 'rxjs';
import { resetHeader }                                               from '@app/store/header/header.actions';
import { tagsForUser }                                               from '@app/store/tag/tag.selectors';
import { icebreakerAnswerForUser, icebreakers as selectIcebreakers } from '@app/store/icebreaker/icebreaker.selectors';
import { TagI }                                                      from '@models/tag';
import { IcebreakerAnswerI, IcebreakerI }                            from '@models/icebreaker';
import { loadTagsForUserId }                                         from '@app/store/tag/tag.actions';
import { loadIcebreakerAnswerForUserId, loadIcebreakers }            from '@app/store/icebreaker/icebreaker.actions';
import { avatarFileName, loggedInUser }                              from '@app/store/user/user.selectors';

@Component({
  selector: 'gtm-browse-fellas',
  templateUrl: './browse-fellas.component.html',
  styleUrls: ['./browse-fellas.component.scss'],
})
export class BrowseFellasComponent implements OnInit {
  private unsubscribe$: Subject<void> = new Subject();
  selectedFella$ = this.store.select(selectedFella);
  avatarSize: ProfileImageSizeT = 'fullSize';

  tags: TagI[]                               = [];
  icebreakers: IcebreakerI[]                 = [];
  icebreakerAnswer: IcebreakerAnswerI | null = null;
  icebreaker: IcebreakerI | null             = null;


  constructor(
    private router: Router,
    private chatSvc: ChatService,
    private store: Store,
  ) {}

  ngOnInit(): void {
    if (this.selectedFella$) {
      this.watchIcebreakers();
      this.watchUserTags();
      this.watchIcebreakerAnswer();
      this.watchSelectedFella();
      this.store.dispatch(loadIcebreakers());
    }
  }

  ngOnDestroy(): void {
    this.store.dispatch(resetHeader());
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onPreviousClicked = () => {
    this.store.dispatch(previousFella());
  };

  onNextClicked = () => {
    this.store.dispatch(nextFella());
  };

  onProfileClicked = () =>
    this.selectedFella$
      .pipe(
        map(user => user.uid),
        take(1),
      )
      .subscribe(uid => this.router.navigateByUrl(`/guys/${uid}`));

  onChatClicked = () => {
    combineLatest([
      this.store.select(authUid),
      this.selectedFella$.pipe(map(user => user.uid)),
    ])
      .pipe(take(1))
      .subscribe(async ([uid1, uid2]) => {
        const chatId = await this.chatSvc.createPairChat(uid1, uid2);
        this.router.navigateByUrl(`/chat/${chatId}`);
      });
  };

  onConnectClicked = () =>
    combineLatest([
      this.store.select(authUid),
      this.selectedFella$.pipe(map(user => user.uid)),
    ])
      .pipe(take(1))
      .subscribe(([myUid, theirUid]) =>
        this.store.dispatch(addFella({ myUid, theirUid })),
      );

  avatarFileData$ = this.selectedFella$.pipe(
    map(user => user?.uploadedProfileImageMap?.[this.avatarSize]),
  );

  watchSelectedFella = () => {
    this.store
      .select(selectedFella)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(user => {
        if ( !user?.uid ) {
          return;
        }

        this.store.dispatch(loadTagsForUserId({ userId: user.uid }));
        this.store.dispatch(loadIcebreakerAnswerForUserId({ userId: user.uid }));
      });
  }

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
      .subscribe(( icebreakers ) => {
        this.icebreakers = icebreakers;
        if ( this.icebreakerAnswer && !this.icebreaker ) {
          const foundIcebreaker = this.icebreakers.find(( ib ) => ib.id === this.icebreakerAnswer.icebreakerId);
          this.icebreaker = foundIcebreaker;
        }
      });
  }

  watchIcebreakerAnswer = () => {
    this.store
      .select(icebreakerAnswerForUser)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(icebreakerAnswer => {
        if ( this.icebreakers.length > 0 ) {
          this.icebreaker = this.icebreakers.find(( ib ) => ib.id === icebreakerAnswer.icebreakerId);
        }
        this.icebreakerAnswer = icebreakerAnswer;
      });
  }
}
