import { Component, OnInit } from '@angular/core';
import {
  ProfileImageSizeT,
  RelationshipStatusM,
  UserI,
} from '@app/models/user';
import { HeaderService } from '@app/services/header.service';
import { UserService } from '@app/services/user.service';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
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
  avatarSize: ProfileImageSizeT = '90x90';

  relationshipStatusMap = RelationshipStatusM;

  constructor(private userSvc: UserService, private headerSvc: HeaderService) {}

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

  cycleFella = () => {
    if (this.currentUserIndex < this.users.length - 1) {
      this.currentUserIndex++;
    } else {
      alert(
        "That's everyone in the app. Please invite your friends to join! In the mean time, we'll start back from the beginning.",
      );
      this.currentUserIndex = 0;
    }
  };

  // HELPERS
  currentUser = () => this.users[this.currentUserIndex];

  avatarFileName = () => {
    return this.currentUser()?.uploadedProfileImageMap[this.avatarSize]
      ?.fileName;
  };
}
