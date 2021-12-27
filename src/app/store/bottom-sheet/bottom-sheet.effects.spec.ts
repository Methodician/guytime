import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { BottomSheetEffects } from './header.effects';

describe('HeaderEffects', () => {
  let actions$: Observable<any>;
  let effects: BottomSheetEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BottomSheetEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(BottomSheetEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
