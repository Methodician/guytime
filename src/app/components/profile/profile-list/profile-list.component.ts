import { Component, Input } from '@angular/core';
import { UserI } from '@models/user';

@Component({
  selector: 'gtm-profile-list',
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.scss'],
})
export class ProfileListComponent {
  @Input() users: UserI[];

  constructor() {}
}
