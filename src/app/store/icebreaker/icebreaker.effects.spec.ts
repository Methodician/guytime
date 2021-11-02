import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { IcebreakerEffects } from './icebreaker.effects';

describe('IcebreakerEffects', () => {
  const actions$: Observable<any>;
  let effects: IcebreakerEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IcebreakerEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(IcebreakerEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
