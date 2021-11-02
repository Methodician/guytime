import { TestBed } from '@angular/core/testing';

import { IcebreakerService } from './icebreaker.service';

describe('IcebreakerService', () => {
  let service: IcebreakerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IcebreakerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
