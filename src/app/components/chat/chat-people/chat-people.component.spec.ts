import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatPeopleComponent } from './chat-people.component';

describe('ChatPeopleComponent', () => {
  let component: ChatPeopleComponent;
  let fixture: ComponentFixture<ChatPeopleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatPeopleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatPeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
