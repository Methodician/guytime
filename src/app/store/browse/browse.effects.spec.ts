import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { BrowseEffects } from './browse.effects';

describe('BrowseEffects', () => {
  let actions$: Observable<any>;
  let effects: BrowseEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BrowseEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(BrowseEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
