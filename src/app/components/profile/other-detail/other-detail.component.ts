import { Component, OnInit, OnDestroy } from '@angular/core';
import { combineLatest, from, Observable, Subject } from 'rxjs';
import { UserI } from '@models/user';
import { UserService } from '@services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '@app/services/chat.service';
import { switchMap, take, takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { loggedInUser, specificUser } from '@app/store/user/user.selectors';
import {
  addHeaderOptions,
  resetHeader,
  setHeaderText,
} from '@app/store/header/header.actions';

@Component({
  selector: 'gtm-other-detail',
  templateUrl: './other-detail.component.html',
  styleUrls: ['./other-detail.component.scss'],
})
export class OtherDetailComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject();
  user$: Observable<UserI>;

  constructor(
    private store: Store,
    private userSvc: UserService,
    private route: ActivatedRoute,
    private router: Router,
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
    this.store.dispatch(resetHeader());
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  updateHeader = () => {
    setTimeout(() => delayedHeaderOperations());

    const delayedHeaderOperations = () => {
      this.user$.pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
        if (user && user.fName) {
          this.store.dispatch(
            setHeaderText({ headerText: `About ${user.fName}` }),
          );
        }
      });

      const optionsToAdd = new Map([
        [
          'seeConnections',
          {
            iconName: 'people',
            optionText: 'See their contacts',
            isDisabled: false,
            onClick: this.onSeeConnectionsClicked,
          },
        ],
        [
          'sendMessage',
          {
            iconName: 'message',
            optionText: 'Chat with them',
            isDisabled: false,
            onClick: this.onChatClicked,
          },
        ],
        [
          'removeContact',
          {
            iconName: 'person_minus',
            optionText: 'Remove contact',
            isDisabled: false,
            onClick: this.onDisconnectClicked,
          },
        ],
      ]);

      this.store.dispatch(addHeaderOptions({ optionsToAdd }));
    };
  };

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
