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
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'gtm-browse-fellas',
  templateUrl: './browse-fellas.component.html',
  styleUrls: ['./browse-fellas.component.scss'],
})
export class BrowseFellasComponent implements OnInit {
  private unsubscribe$: Subject<void> = new Subject();
  users: UserI[] = [];
  currentUserIndex = 0;
  avatarSize: ProfileImageSizeT = 'fullSize';

  relationshipStatusMap = RelationshipStatusM;

  constructor(
    private router: Router,
    private chatSvc: ChatService,
    private authSvc: AuthService,
    private userSvc: UserService,
    private headerSvc: HeaderService,
  ) {}

  ngOnInit(): void {
    this.userSvc
      .namedUsersRef()
      .valueChanges({ idField: 'uid' })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(users => (this.users = users));
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
    const uid1 = this.authSvc.authInfo$.value.uid,
      uid2 = this.currentUser().uid;

    const chatId = await this.chatSvc.createPairChat(uid1, uid2);
    this.router.navigateByUrl(`/chat/${chatId}`);
  };

  onConnectClicked = async () => {
    const myUid = this.authSvc.authInfo$.value.uid,
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
