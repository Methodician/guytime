import { Component, OnInit, Input } from '@angular/core';
import { UserI, RelationshipStatusM } from '@app/models/user';

@Component({
  selector: 'gtm-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.scss'],
})
export class ProfileDetailComponent {
  @Input() avatarUrl = 'assets/icons/square_icon.svg';
  @Input() userInfo: UserI;

  relationshipStatusMap = RelationshipStatusM;
  constructor() {}
}
