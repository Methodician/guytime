import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatGroupAvatarComponent } from './chat-group-avatar.component';

describe('ChatGroupAvatarComponent', () => {
  let component: ChatGroupAvatarComponent;
  let fixture: ComponentFixture<ChatGroupAvatarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatGroupAvatarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatGroupAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
