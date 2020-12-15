import { Component, OnInit } from '@angular/core';
import { UserService } from '@app/services/user.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'gtm-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit {
  uid = 'DevfsZ8x1hYxNKS418vdXLrZqbv2.jpg';
  avatarUrl$ = new BehaviorSubject('assets/icons/square_icon.svg');

  constructor(private userSvc: UserService) {}

  ngOnInit(): void {
    this.setUrl();
  }

  setUrl = () => {
    this.userSvc.getAvatarUrl(this.uid, '90x90').subscribe(url => {
      console.log(url);
      url && this.avatarUrl$.next(url);
    });
  };
}
