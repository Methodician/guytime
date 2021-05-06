import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { HeaderEffects } from './header.effects';

describe('HeaderEffects', () => {
  let actions$: Observable<any>;
  let effects: HeaderEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HeaderEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(HeaderEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
