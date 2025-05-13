import { Component, computed, inject } from '@angular/core';
import { ChatStateService } from '../../services/chat-state.service';

@Component({
    selector: 'mad-chat-header',
    imports: [],
    templateUrl: './chat-header.component.html',
    styleUrl: './chat-header.component.css'
})
export class ChatHeaderComponent {

    private readonly stateService = inject(ChatStateService)


    username = computed(() => {
        const currentUser = this.stateService.currentUser()
        if (!currentUser) return ''
        const userId = currentUser._id
        const username = this.stateService.knownUsers().find(u => u._id === userId)?.username
        if (!username) {
            console.warn(`Nom d'utilisateur non trouvé pour userId: ${userId}`);
            return ''
        }
       return username
    })
}

 