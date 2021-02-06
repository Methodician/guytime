import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseFellasComponent } from './browse-fellas.component';

describe('BrowseFellasComponent', () => {
  let component: BrowseFellasComponent;
  let fixture: ComponentFixture<BrowseFellasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrowseFellasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseFellasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
