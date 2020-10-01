import { Component, OnInit, Input } from '@angular/core';
import { UserI } from '@models/user';
import { Observable } from 'rxjs';
import { UserService } from '@services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'gtm-profile-preview-card',
  templateUrl: './profile-preview-card.component.html',
  styleUrls: ['./profile-preview-card.component.scss'],
})
export class ProfilePreviewCardComponent implements OnInit {
  @Input() user: UserI;
  @Input() shouldLink = true;

  avatarUrl$: Observable<string>;

  constructor(private userSvc: UserService, private router: Router) {}

  ngOnInit(): void {
    if (!this.user || !this.user.uid)
      throw new Error(
        'Profile preview card must receive an input that is an instance of UserI with a valid uid',
      );
    this.avatarUrl$ = this.userSvc.getAvatarUrl(this.user.uid);
  }

  onCardClicked = $e => {
    if (this.shouldLink) this.router.navigateByUrl(`/guys/${this.user.uid}`);
  };
}
