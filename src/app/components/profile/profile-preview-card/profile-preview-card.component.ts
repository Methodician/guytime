import { Component, OnInit, Input } from '@angular/core';
import { ProfileImageSizeT, UserI } from '@models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'gtm-profile-preview-card',
  templateUrl: './profile-preview-card.component.html',
  styleUrls: ['./profile-preview-card.component.scss'],
})
export class ProfilePreviewCardComponent implements OnInit {
  @Input() user: UserI;
  @Input() shouldLink = true;

  avatarSize: ProfileImageSizeT = '45x45';

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (!this.user || !this.user.uid)
      throw new Error(
        'Profile preview card must receive an input that is an instance of UserI with a valid uid',
      );
  }

  onCardClicked = $e => {
    if (this.shouldLink) this.router.navigateByUrl(`/guys/${this.user.uid}`);
  };

  avatarFileName = () =>
    this.user &&
    this.user.uploadedProfileImageMap &&
    this.user.uploadedProfileImageMap[this.avatarSize] &&
    this.user.uploadedProfileImageMap[this.avatarSize].fileName;
}
