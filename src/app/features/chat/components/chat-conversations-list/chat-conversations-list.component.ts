import { Component, computed, inject } from '@angular/core';
import { ChatStateService } from '../../services/chat-state.service';

@Component({
    selector: 'mad-chat-conversations-list',
    imports: [],
    templateUrl: './chat-conversations-list.component.html',
    styleUrl: './chat-conversations-list.component.css'
})
export class ChatConversationsListComponent {

  //======= [ SERVICES ]=======================================/
  private readonly chatStateService = inject(ChatStateService)

  //===========================================================/
  conversations = computed(() => this.chatStateService.conversations())
 

}
