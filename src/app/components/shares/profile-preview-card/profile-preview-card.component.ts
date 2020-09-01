import { Component, OnInit, Input } from '@angular/core';
import { UserI } from '@models/user';
import { Observable } from 'rxjs';
import { UserService } from '@services/user.service';

@Component({
  selector: 'gtm-profile-preview-card',
  templateUrl: './profile-preview-card.component.html',
  styleUrls: ['./profile-preview-card.component.scss'],
})
export class ProfilePreviewCardComponent implements OnInit {
  @Input() user: UserI;

  avatarUrl$: Observable<string>;

  constructor(private userSvc: UserService) {}

  ngOnInit(): void {
    this.avatarUrl$ = this.userSvc.getAvatarUrl(this.user.uid);
  }
}
