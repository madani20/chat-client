import { Component, computed, inject } from '@angular/core';
import { ChatStateService } from '../../services/chat-state.service';

@Component({
  selector: 'mad-chat-status-indicator',
  imports: [],
  templateUrl: './chat-status-indicator.component.html',
  styleUrl: './chat-status-indicator.component.css'
})
export class ChatStatusIndicatorComponent {

  //====================  SERVICES =======================/
  private readonly stateService = inject(ChatStateService)
  currentUser = computed(() => this.stateService.currentUser())
  //======================================================/


  // Vérifie si un participant (autre que l'utilisateur courant) est en train d'écrire
  isTyping = computed(() => {
    const currentConvId = this.stateService.currentConversationId();
    const conversations = this.stateService.conversations();
    const users = this.stateService.users()
    
    const currentConv = conversations.find(conv => conv._id === currentConvId)

    if (!currentConv || !currentConv.participants) {
    //  console.log('Pas de conversation courante ou participants');
      return false;
    }

    const otherParticipants = currentConv.participants.filter(id => id !== this.currentUser()?._id)
    if (otherParticipants.length === 0) {
     // console.log('Pas d\'autres participants');
      return false
    }
    const someOneTyping = otherParticipants.some(id => {
      const user = users.find(u => u._id === id)
      return user?.status === 'typing'
    })
   // console.log('Someone typing:', someOneTyping);
    return someOneTyping
  })

  userTyping = computed(() => { 
    const currentConvId = this.stateService.currentConversationId();
    const conversations = this.stateService.conversations();
    const users = this.stateService.users()
    
    const currentConv = conversations.find(conv => conv._id !== currentConvId)

    if (!currentConv || !currentConv.participants) {
    //  console.log('Pas de conversation courante ou participants');
      return false;
    }

    const otherParticipants = currentConv.participants.filter(id => id !== this.currentUser()?._id)
    if (otherParticipants.length === 0) {
    //  console.log('Pas d\'autres participants');
      return false
    }
    const someOneTyping = otherParticipants.some(id => {
      const user = users.find(u => u._id === id)
      return user?.status === 'typing'
    })
    return otherParticipants.map(id => {
      const user = users.find(u => u._id === id)
      return user?.username
    }
    )
  })  
  } 



