import { Component, OnInit } from '@angular/core';
import { HeaderOptionMapT } from '@components/header/header.component';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { UserI } from '@models/user';
import { UserService } from '@services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'gtm-other-detail',
  templateUrl: './other-detail.component.html',
  styleUrls: ['./other-detail.component.scss'],
})
export class OtherDetailComponent implements OnInit {
  headerOptions: HeaderOptionMapT;
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
          .subscribe(user => this.user$.next({ ...user, uid }));
        this.userSvc
          .getAvatarUrl(uid)
          .subscribe(url => this.avatarUrl$.next(url));
      }
    });

    this.headerOptions = new Map([
      [
        'seeConnections',
        {
          iconName: 'people',
          optionText: 'See their contacts',
          isDisabled: true,
          onClick: this.logClicked,
        },
      ],
      [
        'addConnection',
        {
          iconName: 'person_add',
          optionText: 'Add them to contacts',
          isDisabled: false,
          onClick: this.onConnectClicked,
        },
      ],
      [
        'sendMessage',
        {
          iconName: 'message',
          optionText: 'Chat with them',
          isDisabled: true,
          onClick: this.logClicked,
        },
      ],
    ]);

    const bothUsers$ = combineLatest(
      this.user$,
      this.userSvc.loggedInUser$,
      (user, loggedInUser) => ({ user, loggedInUser }),
    );
    bothUsers$.subscribe(({ user, loggedInUser }) => {
      if (user && loggedInUser.contacts[user.uid]) {
        const existingOption = this.headerOptions.get('addConnection');
        const newOption = { ...existingOption, isDisabled: true };
        this.headerOptions.set('addConnection', newOption);
      }
    });
  }

  onConnectClicked = () =>
    this.userSvc.addUserContact(
      this.userSvc.loggedInUser$.value.uid,
      this.user$.value.uid,
    );

  logClicked = () => console.log('clicked');
}
