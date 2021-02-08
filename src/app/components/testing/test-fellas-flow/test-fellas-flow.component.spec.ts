import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestFellasFlowComponent } from './test-fellas-flow.component';

describe('TestFellasFlowComponent', () => {
  let component: TestFellasFlowComponent;
  let fixture: ComponentFixture<TestFellasFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestFellasFlowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestFellasFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
