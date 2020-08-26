import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { UserI } from '@models/user';
import { UserService } from '@services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from '@app/services/header.service';
import { ChatService } from '@app/services/chat.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'gtm-other-detail',
  templateUrl: './other-detail.component.html',
  styleUrls: ['./other-detail.component.scss'],
})
export class OtherDetailComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject();
  user$ = new BehaviorSubject<UserI>(null);

  avatarUrl$ = new BehaviorSubject<string>('assets/icons/square_icon.svg');

  constructor(
    private userSvc: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private headerSvc: HeaderService,
    private chatSvc: ChatService,
  ) {}

  ngOnDestroy(): void {
    this.headerSvc.resetHeader();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

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

    setTimeout(() => {
      this.updateHeader();
    });
  }

  updateHeader = () => {
    this.headerSvc.setHeaderOption('seeConnections', {
      iconName: 'people',
      optionText: 'See their contacts',
      isDisabled: false,
      onClick: this.onSeeConnectionsClicked,
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
      isDisabled: false,
      onClick: this.onChatClicked,
    });

    this.headerSvc.setHeaderOption('removeContact', {
      iconName: 'person_minus',
      optionText: 'Remove contact',
      isDisabled: false,
      onClick: this.onDisconnectClicked,
    });

    this.watchForConnection();

    this.user$.pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
      if (user && user.fName)
        this.headerSvc.setHeaderText(`About ${user.fName}`);
    });

    this.headerSvc.setXAction(this.onXClicked);
  };

  watchForConnection = () => {
    const bothUsers$ = combineLatest(
      this.user$,
      this.userSvc.loggedInUser$,
      (user, loggedInUser) => ({ user, loggedInUser }),
    );
    bothUsers$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ user, loggedInUser }) => {
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

  onXClicked = () => this.router.navigateByUrl('/guys');

  logClicked = () => console.log(this.user$.value.uid);

  onSeeConnectionsClicked = () =>
    this.router.navigateByUrl(`/guys/${this.user$.value.uid}/connections`);

  onChatClicked = () => {
    const participantIds = [
      this.userSvc.loggedInUser$.value.uid,
      this.user$.value.uid,
    ];
    this.chatSvc.createChat(participantIds);
  };
}
