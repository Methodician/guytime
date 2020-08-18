import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherConnectionsListComponent } from './other-connections-list.component';

describe('OtherConnectionsListComponent', () => {
  let component: OtherConnectionsListComponent;
  let fixture: ComponentFixture<OtherConnectionsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherConnectionsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherConnectionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
