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

  avatarSize: ProfileImageSizeT = '90x90';

  relationshipStatusMap = RelationshipStatusM;

  ngOnInit() {
    console.log(this.userInfo);

    if (!this.userInfo) {
      throw new Error(
        "Don't initialize a profile-detail component without the userInfo being loaded already.",
      );
    }
  }

  avatarFileName = () =>
    this.userInfo.uploadedProfileImageMap &&
    this.userInfo.uploadedProfileImageMap[this.avatarSize].fileName;
}
