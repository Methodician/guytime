import { Component, OnInit, Input } from '@angular/core';
import { UserI, RelationshipStatusM } from 'src/app/models/user';

@Component({
  selector: 'gtm-profile-preview-card',
  templateUrl: './profile-preview-card.component.html',
  styleUrls: ['./profile-preview-card.component.scss'],
})
export class ProfilePreviewCardComponent implements OnInit {
  @Input() user: UserI;

  relationshipStatusMap = RelationshipStatusM;

  constructor() {}

  ngOnInit(): void {}
}
