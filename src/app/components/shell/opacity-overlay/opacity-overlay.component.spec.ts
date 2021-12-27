import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpacityOverlayComponent } from './bottom-sheet.component';

describe('BottomSheetComponent', () => {
  let component: OpacityOverlayComponent;
  let fixture: ComponentFixture<OpacityOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpacityOverlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpacityOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
