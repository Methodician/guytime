import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeDetailComponent } from './me-detail.component';

describe('MeDetailComponent', () => {
  let component: MeDetailComponent;
  let fixture: ComponentFixture<MeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
