import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { authUid } from '@app/store/auth/auth.selectors';
import {
  ProfileImageSizeT,
  RelationshipStatusM,
  UserI,
} from '@app/models/user';
import { ChatService } from '@app/services/chat.service';
import { HeaderService } from '@app/services/header.service';
import { UserService } from '@app/services/user.service';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import {
  fellasToBrowse,
  loggedInUserContacts,
} from '@app/store/user/user.selectors';

@Component({
  selector: 'gtm-browse-fellas',
  templateUrl: './browse-fellas.component.html',
  styleUrls: ['./browse-fellas.component.scss'],
})
export class BrowseFellasComponent implements OnInit {
  private unsubscribe$: Subject<void> = new Subject();
  users: UserI[] = [];
  users$ = this.store.select(fellasToBrowse);
  currentUserIndex = 0;
  avatarSize: ProfileImageSizeT = 'fullSize';

  relationshipStatusMap = RelationshipStatusM;

  constructor(
    private router: Router,
    private chatSvc: ChatService,
    private userSvc: UserService,
    private headerSvc: HeaderService,
    private store: Store,
  ) {}

  ngOnInit(): void {
    this.userSvc
      .namedUsersRef()
      .valueChanges({ idField: 'uid' })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(users => (this.users = users));

    this.store.select(loggedInUserContacts).subscribe(console.log);
  }

  ngOnDestroy(): void {
    this.headerSvc.resetHeader();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onCycleClicked = () => {
    if (this.currentUserIndex < this.users.length - 1) {
      this.currentUserIndex++;
    } else {
      alert(
        "That's everyone in the app. Please invite your friends to join! In the mean time, we'll start back from the beginning.",
      );
      this.currentUserIndex = 0;
    }
  };

  onProfileClicked = () =>
    this.router.navigateByUrl(`/guys/${this.currentUser().uid}`);

  onChatClicked = async () => {
    const uid1 = await this.store.select(authUid).pipe(take(1)).toPromise(),
      uid2 = this.currentUser().uid;

    const chatId = await this.chatSvc.createPairChat(uid1, uid2);
    this.router.navigateByUrl(`/chat/${chatId}`);
  };

  onConnectClicked = async () => {
    const myUid = await this.store.select(authUid).pipe(take(1)).toPromise(),
      theirUid = this.currentUser().uid;
    await this.userSvc.addUserContact(myUid, theirUid);
    alert(
      'Connection saved! To view your connections look in your profile menu',
    );
  };

  // HELPERS
  currentUser = () => this.users[this.currentUserIndex];

  avatarFileName = () => {
    return this.currentUser()?.uploadedProfileImageMap?.[this.avatarSize]
      ?.fileName;
  };
}
