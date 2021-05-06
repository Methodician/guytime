import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatGroupI } from '@app/models/chat-group';
import { UserI } from '@app/models/user';
import { ChatService } from '@app/services/chat.service';
import { UserService } from '@app/services/user.service';
import { resetHeader, setHeaderText } from '@app/store/header/header.actions';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, of, Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'gtm-chat-people',
  templateUrl: './chat-people.component.html',
  styleUrls: ['./chat-people.component.scss'],
})
export class ChatPeopleComponent implements OnInit {
  private unsubscribe$: Subject<void> = new Subject();

  chatId$: BehaviorSubject<string> = new BehaviorSubject(null);
  chatGroup$: BehaviorSubject<ChatGroupI> = new BehaviorSubject(null);
  chatUsers$: BehaviorSubject<UserI[]> = new BehaviorSubject(null);

  constructor(
    private store: Store,
    private chatSvc: ChatService,
    private userSvc: UserService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        const chatId = params['id'];
        this.chatId$.next(chatId);
        this.watchChatGroup(chatId);
        this.watchChatUsers();
        setTimeout(() => this.updateHeader());
      }
    });
  }

  ngOnDestroy(): void {
    this.store.dispatch(resetHeader());
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  watchChatGroup = (id: string) => {
    this.chatSvc
      .chatGroupDoc(id)
      .valueChanges()
      .pipe(
        takeUntil(this.unsubscribe$),
        map(val => ({ id, ...val })),
      )
      .subscribe(group => this.chatGroup$.next(group));
  };

  watchChatUsers = () => {
    this.chatGroup$
      .pipe(
        switchMap(group => {
          if (!group) return of(null);

          const userIds = Object.keys(group.participantsMap);
          const userObservables = userIds.map(uid =>
            this.userSvc
              .userRef(uid)
              .valueChanges()
              .pipe(map(user => ({ uid, ...user }))),
          );
          return combineLatest(userObservables);
        }),
      )
      .subscribe(users => this.chatUsers$.next(users));
  };

  updateHeader = () => {
    setTimeout(() => delayedHeaderOperations());

    const delayedHeaderOperations = () => {
      this.store.dispatch(setHeaderText({ headerText: 'People in the Chat' }));
    };
  };

  onAddPeopleClicked = () =>
    this.router.navigateByUrl(`chat/${this.chatId$.value}/people/add`);
}
