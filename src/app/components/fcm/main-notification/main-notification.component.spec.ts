import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainNotificationComponent } from './main-notification.component';

describe('MainNotificationComponent', () => {
  let component: MainNotificationComponent;
  let fixture: ComponentFixture<MainNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainNotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
