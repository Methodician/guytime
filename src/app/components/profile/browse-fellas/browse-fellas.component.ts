import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { authUid } from '@app/store/auth/auth.selectors';
import { ProfileImageSizeT, RelationshipStatusM } from '@app/models/user';
import { ChatService } from '@app/services/chat.service';
import { HeaderService } from '@app/services/header.service';
import { Store } from '@ngrx/store';
import { map, switchMap, take } from 'rxjs/operators';
import { fellasToBrowse } from '@app/store/user/user.selectors';
import { browseIndex } from '@app/store/browse/browse.selectors';
import { addFella, nextFella } from '@app/store/browse/browse.actions';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'gtm-browse-fellas',
  templateUrl: './browse-fellas.component.html',
  styleUrls: ['./browse-fellas.component.scss'],
})
export class BrowseFellasComponent implements OnInit {
  users$ = this.store.select(fellasToBrowse);
  browseIndex$ = this.store.select(browseIndex);
  avatarSize: ProfileImageSizeT = 'fullSize';

  relationshipStatusMap = RelationshipStatusM;

  constructor(
    private router: Router,
    private chatSvc: ChatService,
    private headerSvc: HeaderService,
    private store: Store,
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.headerSvc.resetHeader();
  }

  onCycleClicked = () => {
    this.users$
      .pipe(take(1))
      .subscribe(users =>
        this.store.dispatch(nextFella({ maxIndex: users.length - 1 })),
      );
  };

  onProfileClicked = () =>
    this.currentUser$
      .pipe(
        map(user => user.uid),
        take(1),
      )
      .subscribe(uid => this.router.navigateByUrl(`/guys/${uid}`));

  onChatClicked = () => {
    combineLatest([
      this.store.select(authUid),
      this.currentUser$.pipe(map(user => user.uid)),
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
      this.currentUser$.pipe(map(user => user.uid)),
    ])
      .pipe(take(1))
      .subscribe(([myUid, theirUid]) =>
        this.store.dispatch(addFella({ myUid, theirUid })),
      );

  // HELPERS
  currentUser$ = this.browseIndex$.pipe(
    switchMap(index => this.users$.pipe(map(users => users && users[index]))),
  );

  avatarFileData$ = this.currentUser$.pipe(
    map(user => user?.uploadedProfileImageMap?.[this.avatarSize]),
  );
}
