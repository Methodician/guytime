import { Component, OnInit } from '@angular/core';
import { IHeaderOption } from '@components/header/header.component';
import { BehaviorSubject } from 'rxjs';
import { UserI } from '@models/user';
import { UserService } from '@services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'gtm-other-detail',
  templateUrl: './other-detail.component.html',
  styleUrls: ['./other-detail.component.scss'],
})
export class OtherDetailComponent implements OnInit {
  headerOptions: IHeaderOption[];
  user$ = new BehaviorSubject<UserI>(null);

  avatarUrl$ = new BehaviorSubject<string>('assets/icons/square_icon.svg');

  constructor(private userSvc: UserService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        const uid = params['id'];
        this.userSvc
          .userRef(uid)
          .valueChanges()
          .subscribe(user => this.user$.next(user));
        this.userSvc
          .getAvatarUrl(uid)
          .subscribe(url => this.avatarUrl$.next(url));
      }
    });

    this.headerOptions = [
      {
        iconName: 'people',
        optionText: 'See their connections',
        isDisabled: false,
        onClick: this.logClicked,
      },
      {
        iconName: 'person_add',
        optionText: 'Connect with them',
        isDisabled: true,
        onClick: this.logClicked,
      },
      {
        iconName: 'message',
        optionText: 'Chat with them',
        isDisabled: true,
        onClick: this.logClicked,
      },
    ];
  }

  logClicked = () => console.log('clicked');
}
