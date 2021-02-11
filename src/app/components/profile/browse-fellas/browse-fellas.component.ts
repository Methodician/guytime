import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ProfileImageSizeT,
  RelationshipStatusM,
  UserI,
} from '@app/models/user';
import { AuthService } from '@app/services/auth.service';
import { ChatService } from '@app/services/chat.service';
import { HeaderService } from '@app/services/header.service';
import { UserService } from '@app/services/user.service';
import { LOAD_FELLAS, nextFella } from '@app/store/fella-state/fella.actions';
import { selectCurrentFella } from '@app/store/fella-state/fella.selectors';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'gtm-browse-fellas',
  templateUrl: './browse-fellas.component.html',
  styleUrls: ['./browse-fellas.component.scss'],
})
export class BrowseFellasComponent implements OnInit {
  selectedFella$: Observable<UserI>;
  avatarSize: ProfileImageSizeT = 'fullSize';

  relationshipStatusMap = RelationshipStatusM;

  constructor(
    private store: Store,
    private router: Router,
    private chatSvc: ChatService,
    private authSvc: AuthService,
    private userSvc: UserService,
    private headerSvc: HeaderService,
  ) {}

  ngOnInit(): void {
    this.store.dispatch({ type: LOAD_FELLAS });
    this.selectedFella$ = this.store.pipe(select(selectCurrentFella));
  }

  ngOnDestroy(): void {
    this.headerSvc.resetHeader();
  }

  onCycleClicked = () => {
    this.store.dispatch(nextFella());
  };

  onChatClicked = async () => {
    const uid1 = this.authSvc.authInfo$.value.uid,
      selectedFella = await this.selectedFella$.pipe(take(1)).toPromise(),
      uid2 = selectedFella.uid;

    const chatId = await this.chatSvc.createPairChat(uid1, uid2);
    this.router.navigateByUrl(`/chat/${chatId}`);
  };

  onConnectClicked = async () => {
    const selectedFella = await this.selectedFella$.pipe(take(1)).toPromise(),
      myUid = this.authSvc.authInfo$.value.uid,
      theirUid = selectedFella.uid;

    await this.userSvc.addUserContact(myUid, theirUid);
    alert(
      'Connection saved! To view your connections look in your profile menu',
    );
  };

  // HELPERS

  avatarFileName$ = () =>
    this.selectedFella$.pipe(
      map(user => user?.uploadedProfileImageMap?.[this.avatarSize]?.fileName),
    );
  avatarFileHash$ = () =>
    this.selectedFella$.pipe(
      map(
        user =>
          user?.uploadedProfileImageMap?.[this.avatarSize]?.imageUpdateRando,
      ),
    );
}
