import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomGhostBannerComponent } from './bottom-ghost-banner.component';

describe('BottomGhostBannerComponent', () => {
  let component: BottomGhostBannerComponent;
  let fixture: ComponentFixture<BottomGhostBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BottomGhostBannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BottomGhostBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
