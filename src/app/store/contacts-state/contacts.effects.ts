import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { UserService } from '@app/services/user.service';
import { loadUserContacts, USER_CONTACTS_LOADED } from './contacts.actions';
import { exhaustMap, map, mergeMap, switchMap } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';

@Injectable()
export class ContactsEffects {
  constructor(private actions$: Actions, private userSvc: UserService) {}

  loadUserContacts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUserContacts),
      exhaustMap(action => {
        const { user } = action;

        const { uid, contacts } = user;
        if (!uid || !user)
          throw new Error('the effect does not work unless the user has an id');
        if (!contacts) return of({ type: USER_CONTACTS_LOADED, contacts: {} });

        const contactIds = Object.keys(contacts);
        const userObservables = contactIds.map(uid =>
          this.userSvc.userRef(uid).valueChanges(),
        );
        const users$ = combineLatest(userObservables);
        const contactSlice$ = users$.pipe(map(users => ({ [uid]: users })));
        contactSlice$.subscribe(console.log);
        return contactSlice$.pipe(
          map(slice => ({ type: USER_CONTACTS_LOADED, contacts: slice })),
        );
      }),
    ),
  );

  //   loadUserContacts$ = createEffect(() =>
  //     this.actions$.pipe(
  //       ofType(loadUserContacts),
  //       exhaustMap(action => {
  //         const { user } = action;
  //         const { uid, contacts } = user;
  //         const contactIds = Object.keys(contacts);
  //         const users = contactIds.map(uid =>
  //           this.userSvc.userRef(uid).valueChanges(),
  //         );
  //         const users$ = combineLatest(users);
  //         return users$.pipe(switchMap(users => of({[uid]: users}))
  //       }),
  //       switchMap(contactsSlice => of({ type: USER_CONTACTS_LOADED, contacts: contactsSlice })),
  //     ),
  //   );
}
