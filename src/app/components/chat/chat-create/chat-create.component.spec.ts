import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatCreateComponent } from './add-people.component';

describe('AddPeopleComponent', () => {
  let component: ChatCreateComponent;
  let fixture: ComponentFixture<ChatCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
