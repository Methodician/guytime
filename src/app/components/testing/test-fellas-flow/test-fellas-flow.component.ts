import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import {
  selectFellas,
  selectCurrentFella,
  selectContactIds,
} from '../../../store/user.selectors';
import { nextFella, addFella } from '../../../store/user.actions';
import { take } from 'rxjs/operators';

@Component({
  selector: 'gtm-test-fellas-flow',
  templateUrl: './test-fellas-flow.component.html',
  styleUrls: ['./test-fellas-flow.component.scss'],
})
export class TestFellasFlowComponent implements OnInit {
  fellas$ = this.store.pipe(select(selectFellas));
  currentFella$ = this.store.pipe(select(selectCurrentFella));
  contactsIds$ = this.store.pipe(select(selectContactIds));

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.fellas$.subscribe(console.log);
    this.currentFella$.subscribe(console.log);
    this.contactsIds$.subscribe(console.log);
  }

  onNext = () => this.store.dispatch(nextFella());
  onAdd = () =>
    this.currentFella$
      .pipe(take(1))
      .subscribe(fella => this.store.dispatch(addFella({ uid: fella.uid })));
}
