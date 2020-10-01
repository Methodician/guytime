import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatGroupI } from '@app/models/chat-group';
import { UserI } from '@app/models/user';
import { ChatService } from '@app/services/chat.service';
import { HeaderService } from '@app/services/header.service';
import { UserService } from '@app/services/user.service';
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
    private headerSvc: HeaderService,
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
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.headerSvc.resetHeader();
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

          const userIds = Object.keys(group.participantIds);
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
    this.headerSvc.setHeaderText('People in the Chat');
    this.chatId$.subscribe(id => {
      if (!id) return;

      this.headerSvc.setDefaultXUrl(`/chat/${id}`);
    });
  };

  onAddPeopleClicked = () =>
    this.router.navigateByUrl(`chat/${this.chatId$.value}/add`);
}
