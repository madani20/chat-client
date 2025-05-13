import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ChatStateService } from '../../services/chat-state.service';

@Component({
  selector: 'mad-chat-users-list',
  imports: [],
  templateUrl: './chat-users-list.component.html',
  styleUrl: './chat-users-list.component.css'
})
export class ChatUsersListComponent {

  //==============  SERVICE ==========================================
  private readonly stateService = inject(ChatStateService)
  private readonly router = inject(Router)

  //==============  PROPRIETES =======================================
  currentUser = this.stateService.currentUser
  allUsers = this.stateService.users
  knownUsers = this.stateService.knownUsers
  participantsInCurrentConversation = this.stateService.participantsInTheCurrentConversation

  allUserOnline = computed(() => {
    const allUsersOnline = this.allUsers() || []
    const onlineUsers = allUsersOnline.filter(user => user.status === 'online')
    return onlineUsers
  })

}
 





