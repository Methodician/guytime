import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { authUid } from '@app/store/auth/auth.selectors';
import { ProfileImageSizeT, RelationshipStatusM } from '@app/models/user';
import { ChatService } from '@app/services/chat.service';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { selectedFella } from '@app/store/browse/browse.selectors';
import { addFella, nextFella } from '@app/store/browse/browse.actions';
import { combineLatest } from 'rxjs';
import { resetHeader } from '@app/store/header/header.actions';

@Component({
  selector: 'gtm-browse-fellas',
  templateUrl: './browse-fellas.component.html',
  styleUrls: ['./browse-fellas.component.scss'],
})
export class BrowseFellasComponent implements OnInit {
  selectedFella$ = this.store.select(selectedFella);
  avatarSize: ProfileImageSizeT = 'fullSize';

  relationshipStatusMap = RelationshipStatusM;

  constructor(
    private router: Router,
    private chatSvc: ChatService,
    private store: Store,
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.store.dispatch(resetHeader());
  }

  onCycleClicked = () => {
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
}
