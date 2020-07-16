import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePreviewCardComponent } from './profile-preview-card.component';

describe('ProfilePreviewCardComponent', () => {
  let component: ProfilePreviewCardComponent;
  let fixture: ComponentFixture<ProfilePreviewCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilePreviewCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePreviewCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
