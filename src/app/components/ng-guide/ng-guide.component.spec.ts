import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgGuideComponent } from './ng-guide.component';

describe('NgGuideComponent', () => {
  let component: NgGuideComponent;
  let fixture: ComponentFixture<NgGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
