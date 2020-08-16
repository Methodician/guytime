import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { UserI } from '@models/user';
import { UserService } from '@services/user.service';
import { ActivatedRoute } from '@angular/router';
import { HeaderService } from '@app/services/header.service';

@Component({
  selector: 'gtm-other-detail',
  templateUrl: './other-detail.component.html',
  styleUrls: ['./other-detail.component.scss'],
})
export class OtherDetailComponent implements OnInit {
  user$ = new BehaviorSubject<UserI>(null);

  avatarUrl$ = new BehaviorSubject<string>('assets/icons/square_icon.svg');

  constructor(
    private userSvc: UserService,
    private route: ActivatedRoute,
    private headerSvc: HeaderService,
  ) {}

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

    this.watchForConnection();
    this.updateHeader();
  }

  updateHeader = () => {
    this.headerSvc.clearHeaderOptions();

    this.headerSvc.setHeaderOption('seeConnections', {
      iconName: 'people',
      optionText: 'See their contacts',
      isDisabled: true,
      onClick: this.logClicked,
    });

    this.headerSvc.setHeaderOption('addConnection', {
      iconName: 'person_add',
      optionText: 'Add them to contacts',
      isDisabled: false,
      onClick: this.onConnectClicked,
    });

    this.headerSvc.setHeaderOption('sendMessage', {
      iconName: 'message',
      optionText: 'Chat with them',
      isDisabled: true,
      onClick: this.logClicked,
    });

    this.headerSvc.setHeaderOption('removeConnection', {
      iconName: 'person_minus',
      optionText: 'Remove contact',
      isDisabled: false,
      onClick: this.onDisconnectClicked,
    });
  };

  watchForConnection = () => {
    const bothUsers$ = combineLatest(
      this.user$,
      this.userSvc.loggedInUser$,
      (user, loggedInUser) => ({ user, loggedInUser }),
    );
    bothUsers$.subscribe(({ user, loggedInUser }) => {
      if (user && loggedInUser.contacts[user.uid]) {
        this.headerSvc.disableHeaderOption('addConnection');
        this.headerSvc.enableHeaderOption('removeContact');
      } else {
        this.headerSvc.enableHeaderOption('addConnection');
        this.headerSvc.disableHeaderOption('removeContact');
      }
    });
  };

  onConnectClicked = () =>
    this.userSvc.addUserContact(
      this.userSvc.loggedInUser$.value.uid,
      this.user$.value.uid,
    );

  onDisconnectClicked = () =>
    alert(
      'Please remind us to implement the disconnect feature if this is important',
    );

  logClicked = () => console.log('clicked');
}
