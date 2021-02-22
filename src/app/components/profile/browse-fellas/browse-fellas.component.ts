import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { authUid } from '@app/store/auth/auth.selectors';
import { ProfileImageSizeT, RelationshipStatusM } from '@app/models/user';
import { ChatService } from '@app/services/chat.service';
import { HeaderService } from '@app/services/header.service';
import { UserService } from '@app/services/user.service';
import { Store } from '@ngrx/store';
import { map, switchMap, take } from 'rxjs/operators';
import { fellasToBrowse } from '@app/store/user/user.selectors';
import { browseIndex } from '@app/store/browse/browse.selectors';
import { nextFella } from '@app/store/browse/browse.actions';

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
    private userSvc: UserService,
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
      .pipe(take(1))
      .subscribe(user => this.router.navigateByUrl(`/guys/${user.uid}`));

  onChatClicked = async () => {
    const uid1 = await this.store.select(authUid).pipe(take(1)).toPromise(),
      uid2 = await this.currentUser$
        .pipe(
          take(1),
          map(user => user.uid),
        )
        .toPromise();

    const chatId = await this.chatSvc.createPairChat(uid1, uid2);
    this.router.navigateByUrl(`/chat/${chatId}`);
  };

  onConnectClicked = async () => {
    const myUid = await this.store.select(authUid).pipe(take(1)).toPromise(),
      theirUid = await this.currentUser$
        .pipe(
          take(1),
          map(user => user.uid),
        )
        .toPromise();
    await this.userSvc.addUserContact(myUid, theirUid);
    alert(
      'Connection saved! To view your connections look in your profile menu',
    );
  };

  // HELPERS
  currentUser$ = this.browseIndex$.pipe(
    switchMap(index => this.users$.pipe(map(users => users && users[index]))),
  );

  avatarFileData$ = this.currentUser$.pipe(
    map(user => user?.uploadedProfileImageMap?.[this.avatarSize]),
  );
}
