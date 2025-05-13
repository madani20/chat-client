import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { ChatStateService } from '../../services/chat-state.service';

@Component({
  selector: 'mad-chat-messages-list',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './chat-messages-list.component.html',
  styleUrls: ['./chat-messages-list.component.css']
})
export class ChatMessagesListComponent {

  readonly stateService = inject(ChatStateService)

  currentUser = this.stateService.currentUser
 
  constructor() {
    effect(() => {
      console.log('Effect: currentUser changé:', this.currentUser());
    })
  }

  msgs = computed(() => {
    const messages = this.stateService.messages();
    const convId = this.stateService.currentConversationId();
    if (!convId) {
      console.warn('Aucune conversation courante trouvée');
      return [];
    }
    const filteredMessages = messages
      .filter(m => m.conversationId === convId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
     return filteredMessages;
  })

  getUserName = computed(() => {
    const knownUsers = this.stateService.knownUsers()
    return (userId: string) => {
      if (!userId) return 'Inconnu (ID manquant)'
      const user = knownUsers.find(u => u._id === userId)
      return user ? user.username : `Inconnu (ID: ${userId})`
    }
  })

}



