import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';

import { take } from 'rxjs/operators';
import { addFella, LOAD_FELLAS, nextFella } from '@app/store/fella.actions';
import {
  selectCurrentFella,
  selectFellas,
  selectOneFella,
} from '@app/store/fella.selectors';
import { selectLoggedinUser } from '@app/store/user.selectors';
import { LOAD_USER_CONTACTS } from '@app/store/contacts-state/contacts.actions';

@Component({
  selector: 'gtm-test-fellas-flow',
  templateUrl: './test-fellas-flow.component.html',
  styleUrls: ['./test-fellas-flow.component.scss'],
})
export class TestFellasFlowComponent implements OnInit {
  fellas$ = this.store.pipe(select(selectFellas));
  currentFella$ = this.store.pipe(select(selectCurrentFella));
  // contactsIds$ = this.store.pipe(select(selectContactIds));
  loggedInUser$ = this.store.pipe(select(selectLoggedinUser));

  oneFella$;

  constructor(private store: Store) {}

  ngOnInit(): void {
    // this.fellas$.subscribe(console.log);
    // this.currentFella$.subscribe(console.log);
    // this.contactsIds$.subscribe(console.log);
    // this.loggedInUser$.subscribe(console.log);

    this.store.dispatch({ type: LOAD_FELLAS });
    this.loggedInUser$.subscribe(
      user =>
        user.uid && this.store.dispatch({ type: LOAD_USER_CONTACTS, user }),
    );

    this.fellas$.subscribe(users =>
      users.map(user =>
        this.store.dispatch({ type: LOAD_USER_CONTACTS, user }),
      ),
    );

    setTimeout(() => {
      this.oneFella$ = this.store.pipe(
        select(selectOneFella, { uid: '28ddR9G2ZETqBUBFjRgnxBhwDV93' }),
      );
      this.oneFella$.subscribe(console.info);
    }, 1000);
  }

  onNext = () => this.store.dispatch(nextFella());
  onAdd = () =>
    this.currentFella$
      .pipe(take(1))
      .subscribe(fella => this.store.dispatch(addFella({ uid: fella.uid })));
}
