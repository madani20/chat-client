import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatStatusIndicatorComponent } from './chat-status-indicator.component';

describe('ChatStatusIndicatorComponent', () => {
  let component: ChatStatusIndicatorComponent;
  let fixture: ComponentFixture<ChatStatusIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatStatusIndicatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatStatusIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
