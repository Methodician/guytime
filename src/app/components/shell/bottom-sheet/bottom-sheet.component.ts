import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { BehaviorSubject, Subject, Subscription }                             from 'rxjs';
import { Store }                                                              from '@ngrx/store';
import {
  isBottomSheetOpen
}                                                                             from '@app/store/bottom-sheet/bottom-sheet.selectors';
import { closeBottomSheet }                                                   from '@app/store/bottom-sheet/bottom-sheet.actions';
import { loggedInUser, userListByIdMap }                                      from '@app/store/user/user.selectors';
import { takeUntil }                                                          from 'rxjs/operators';
import { ChatGroupI }                                                         from '@models/chat-group';
import { UserI }                                                              from '@models/user';
import { ChatService }            from '@services/chat.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'gtm-bottom-sheet',
  templateUrl: './bottom-sheet.component.html',
  styleUrls: [ './bottom-sheet.component.scss' ],
})
export class BottomSheetComponent implements OnDestroy, AfterViewInit {
  private unsubscribe$: Subject<void> = new Subject();
  isOpenSubscription: Subscription;
  @ViewChild(':host') bottomSheet;

  isBottomSheetOpen$        = this.store.select(isBottomSheetOpen);

  chatGroup$: BehaviorSubject<ChatGroupI> = new BehaviorSubject(null);
  selectedUsers                           = {};
  users$: BehaviorSubject<UserI[]>        = new BehaviorSubject([]);
  doesUserHaveContacts                    = false;
  wasUserReturned                         = false;

  constructor(
    private store: Store,
    private elementRef: ElementRef,
    private chatSvc: ChatService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.isOpenSubscription = this.isBottomSheetOpen$.subscribe((isOpen) => {
      if (isOpen) {
        this.open();
      }
      if (!isOpen) {
        this.close();
      }
    });
  }

  ngAfterViewInit() {
    this.close();
    this.route.params.subscribe(params => {
      if ( !params['id'] ) {
        return;
      }
      const { id } = params;
      this.chatSvc
        .chatGroupDoc(id)
        .valueChanges()
        .subscribe(group => {
          this.chatGroup$.next({ id, ...group });
        });
    });
    this.initializeContactList();
  }

  ngOnDestroy(): void {
    this.isOpenSubscription.unsubscribe();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  open = () => {
    if (this.elementRef) {
      this.elementRef.nativeElement.style.bottom = `-54px`;
    }
  }

  close = () => {
    if (this.elementRef) {
      const bottomValue = `-${document.documentElement.clientHeight}px`;
      this.elementRef.nativeElement.style.bottom = bottomValue;
    }
  }

  onCancelClick = () => {
    this.store.dispatch(closeBottomSheet());
  }

  watchChatGroup = () => {
    this.chatGroup$.subscribe(group => {
      if ( !group ) {
        return;
      }
      const { participantsMap } = group;
      const participantIds      = Object.keys(participantsMap);
      for ( const uid of participantIds ) {
        this.selectedUsers[uid] = true;
      }
    });
  }

  initializeContactList = () => {
    this.store
      .select(loggedInUser)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(user => {
        if ( user && user.uid ) {
          this.wasUserReturned         = true;
          this.selectedUsers[user.uid] = true;
        }
        if ( user && user.contacts && Object.keys(user.contacts).length > 0 ) {
          this.doesUserHaveContacts = true;
          this.store
            .select(userListByIdMap(user.contacts))
            .subscribe(contacts => {
              this.users$.next(contacts);
              this.watchChatGroup();
            });
        }
      });
  }

  toggleSelectedUser = (uid: string) => {
    const userSelected = !!this.selectedUsers[uid];

    if (userSelected) {
      delete this.selectedUsers[uid];
    }

    if (!userSelected) {
      this.selectedUsers[uid] = true;
    }
  }

  handleCreateClick = async ( ) => {
    const uids = Object.entries(this.selectedUsers)
      .filter(( [ _, isSelected ] ) => !!isSelected)
      .map(( [ uid, _ ] ) => uid);
    const groupId = await this.chatSvc.createGroupChat(uids);
    this.store.dispatch(closeBottomSheet());
    return this.router.navigateByUrl(`/chat/${groupId}`);
  }

}
