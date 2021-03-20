import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  from,
  Observable,
  Subject,
} from 'rxjs';
import { UserI } from '@models/user';
import { UserService } from '@services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from '@app/services/header.service';
import { ChatService } from '@app/services/chat.service';
import { switchMap, take, takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { loggedInUser, specificUser } from '@app/store/user/user.selectors';

@Component({
  selector: 'gtm-other-detail',
  templateUrl: './other-detail.component.html',
  styleUrls: ['./other-detail.component.scss'],
})
export class OtherDetailComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject();
  user$: Observable<UserI>;
  // user$ = new BehaviorSubject<UserI>(null);

  constructor(
    private store: Store,
    private userSvc: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private headerSvc: HeaderService,
    private chatSvc: ChatService,
  ) {}

  ngOnInit(): void {
    this.updateHeader();
    this.route.params.subscribe(params => {
      if (params['id']) {
        const uid = params['id'];
        this.user$ = this.store.select(specificUser(uid));
      }
    });
  }

  ngOnDestroy(): void {
    this.headerSvc.resetHeader();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  updateHeader = () => {
    setTimeout(() => delayedHeaderOperations());

    const delayedHeaderOperations = () => {
      this.watchForConnection();
      this.user$.pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
        if (user && user.fName)
          this.headerSvc.setHeaderText(`About ${user.fName}`);
      });

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
    };
  };

  watchForConnection = () =>
    combineLatest([this.user$, this.store.select(loggedInUser)])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(([user, loggedInUser]) => {
        if (user && loggedInUser?.contacts?.[user.uid]) {
          this.headerSvc.disableHeaderOption('addConnection');
          this.headerSvc.enableHeaderOption('removeContact');
        } else {
          this.headerSvc.enableHeaderOption('addConnection');
          this.headerSvc.disableHeaderOption('removeContact');
        }
      });

  onConnectClicked = () =>
    combineLatest([this.store.select(loggedInUser), this.user$])
      .pipe(take(1))
      .subscribe(([loggedInUser, user]) =>
        this.userSvc.addUserContact(loggedInUser.uid, user.uid),
      );

  onDisconnectClicked = () =>
    alert(
      'Please remind us to implement the disconnect feature if this is important',
    );

  onSeeConnectionsClicked = () =>
    this.user$
      .pipe(take(1))
      .subscribe(user =>
        this.router.navigateByUrl(`/guys/${user.uid}/connections`),
      );

  onChatClicked = () =>
    combineLatest([this.store.select(loggedInUser), this.user$])
      .pipe(
        take(1),
        switchMap(([loggedInUser, user]) =>
          from(this.chatSvc.createPairChat(loggedInUser.uid, user.uid)),
        ),
      )
      .subscribe(chatId => this.router.navigateByUrl(`/chat/${chatId}`));
}
