import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseGuysListComponent } from './browse-guys-list.component';

describe('BrowseGuysListComponent', () => {
  let component: BrowseGuysListComponent;
  let fixture: ComponentFixture<BrowseGuysListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowseGuysListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseGuysListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
