import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatGroupComponent } from './chat-group.component';

describe('ChatGroupComponent', () => {
  let component: ChatGroupComponent;
  let fixture: ComponentFixture<ChatGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
