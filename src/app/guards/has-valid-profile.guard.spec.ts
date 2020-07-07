import { TestBed } from '@angular/core/testing';

import { HasValidProfileGuard } from './has-valid-profile.guard';

describe('HasValidProfileGuard', () => {
  let guard: HasValidProfileGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(HasValidProfileGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
