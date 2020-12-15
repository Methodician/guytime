import { Component, Input, OnInit } from '@angular/core';
import { ProfileImageSizeT } from '@app/models/user';
import { UserService } from '@app/services/user.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'gtm-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit {
  @Input() fileName: string;
  @Input() imageSize: ProfileImageSizeT;

  avatarUrl$ = new BehaviorSubject('assets/icons/square_icon.svg');

  constructor(private userSvc: UserService) {}

  ngOnInit(): void {
    if (this.fileName) {
      this.setUrl();
    }
  }

  setUrl = () => {
    this.userSvc.getAvatarUrl(this.fileName, this.imageSize).subscribe(url => {
      url && this.avatarUrl$.next(url);
    });
  };
}
