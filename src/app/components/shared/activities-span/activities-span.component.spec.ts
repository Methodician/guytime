import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesSpanComponent } from './activities-span.component';

describe('ActivitiesSpanComponent', () => {
  let component: ActivitiesSpanComponent;
  let fixture: ComponentFixture<ActivitiesSpanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivitiesSpanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitiesSpanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
