import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherDetailComponent } from './other-detail.component';

describe('OtherDetailComponent', () => {
  let component: OtherDetailComponent;
  let fixture: ComponentFixture<OtherDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
