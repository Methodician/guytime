import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { TagEffects } from './tag.effects';

describe('UserEffects', () => {
  let actions$: Observable<any>;
  let effects: TagEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TagEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(TagEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
