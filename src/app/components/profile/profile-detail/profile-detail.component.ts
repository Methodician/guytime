import { Component, Input } from '@angular/core';
import {
  UserI,
  RelationshipStatusM,
  ProfileImageSizeT,
} from '@app/models/user';

@Component({
  selector: 'gtm-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.scss'],
})
export class ProfileDetailComponent {
  @Input() userInfo: UserI;

  avatarSize: ProfileImageSizeT = 'fullSize';

  relationshipStatusMap = RelationshipStatusM;

  ngOnInit() {
    if (!this.userInfo) {
      throw new Error(
        "Don't initialize a profile-detail component without the userInfo being loaded already.",
      );
    }
  }

  avatarFileName = () =>
    this.userInfo?.uploadedProfileImageMap?.[this.avatarSize]?.fileName;

  avatarFileHash = () =>
    this.userInfo?.uploadedProfileImageMap?.[this.avatarSize]?.imageUpdateRando;
}
