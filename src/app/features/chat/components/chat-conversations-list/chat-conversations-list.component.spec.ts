import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatConversationsListComponent } from './chat-conversations-list.component';

describe('ChatConversationsListComponent', () => {
  let component: ChatConversationsListComponent;
  let fixture: ComponentFixture<ChatConversationsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatConversationsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatConversationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
