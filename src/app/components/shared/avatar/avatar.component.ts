import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ProfileImageSizeT } from '@app/models/user';
import { UserService } from '@app/services/user.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'gtm-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnChanges {
  /** Used along with imageSize to get a URL for a user's avatar */
  @Input() fileName: string;
  /** Used along with fileName to get a URL for a user's avatar */
  @Input() imageSize: ProfileImageSizeT;

  /** When supplied, this will be used directly instead of getting the URL from APIs */
  @Input() avatarFileUrl: string;

  avatarUrl$ = new BehaviorSubject('assets/icons/square_icon.svg');

  constructor(private userSvc: UserService) {}

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if (!!changes.avatarFileUrl && !!changes.avatarFileUrl.currentValue) {
      this.avatarUrl$.next(this.avatarFileUrl);
    } else if (!!changes.fileName && !!changes.fileName.currentValue) {
      this.setUrl();
    }
  }

  setUrl = () => {
    this.userSvc.getAvatarUrl(this.fileName, this.imageSize).subscribe(url => {
      url && this.avatarUrl$.next(url);
    });
  };

  imageSizePx = () => {
    switch (this.imageSize) {
      case '90x90':
        return '90px';
      case '45x45':
        return '45px';
      case 'fullSize':
        return '90px';
      default:
        return '90px';
    }
  };
}
