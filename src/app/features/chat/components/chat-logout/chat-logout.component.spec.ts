import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatLogoutComponent } from './chat-logout.component';

describe('ChatLogoutComponent', () => {
  let component: ChatLogoutComponent;
  let fixture: ComponentFixture<ChatLogoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatLogoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatLogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
