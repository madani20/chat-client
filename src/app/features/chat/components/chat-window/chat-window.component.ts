import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { SocketService } from '../../../../core/services/socket.service';
import { sanitizeContent } from '../../../../shared/tools/sanitizeContent';
import { Conversation } from '../../models/conversation';
import { Message } from '../../models/message';
import { ChatStateService } from '../../services/chat-state.service';
import { ChatService } from '../../services/chat.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { ChatConversationsListComponent } from "../chat-conversations-list/chat-conversations-list.component";
import { ChatHeaderComponent } from "../chat-header/chat-header.component";
import { ChatInputComponent } from '../chat-input/chat-input.component';
import { ChatLogoutComponent } from "../chat-logout/chat-logout.component";
import { ChatMessagesListComponent } from "../chat-messages-list/chat-messages-list.component";
import { ChatStatusIndicatorComponent } from '../chat-status-indicator/chat-status-indicator.component';
import { ChatUsersListComponent } from "../chat-users-list/chat-users-list.component";

@Component({
  selector: 'mad-chat-window',
  imports: [ChatMessagesListComponent, ChatInputComponent, ChatConversationsListComponent, 
    ChatHeaderComponent, ChatStatusIndicatorComponent, ChatUsersListComponent, ChatLogoutComponent],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.css'
})
export class ChatWindowComponent implements OnInit, OnDestroy {

  private readonly chatService = inject(ChatService)
  private readonly socketService = inject(SocketService)
  private readonly stateService = inject(ChatStateService)
  localStorageService = inject(LocalStorageService)
  private destroy$ = new Subject<void>()


  currentConversationId = computed(() => this.stateService.currentConversationId())
  currentUser = computed(() => this.stateService.currentUser())

  //==========================================================================================================================/

  typingTimeout: any // Minuteur pour le statut de l'utilisateur en train de taper un message
  errorMessage = signal<string | null>(null)

  constructor() {
    this.socketService.onMessage()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (message) => {
          if (message && message.content) {
            this.stateService.addMessage(message)
          }
        },
        error: (err) => console.error('Erreur réception message:', err)
      })
  }

  ngOnInit(): void {
    //console.log('ChatWindowComponent: ngOnInit appelé')
    this.initChat()
    this.socketService.connect()
    this.socketService.updateStatus('online')
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
    this.localStorageService.clear()
    this.socketService.disconnect()
  }

  readyToSendMessage(content: string): void {
  if (!content.trim()) { return }

    const user = this.currentUser()
    const convId = this.stateService.currentConversationId()
    if (!user || !convId) {
      console.error('Aucun utilisateur courant ou conversationId');
      return;
    }
    if (user && convId && content) {
      //Mise en forme du message
      const message: Message = {
        _id: uuidv4(),
        conversationId: convId,
        userId: user._id,
        timestamp: new Date().toISOString(),
        content: sanitizeContent(content),
        status: 'sending',
      }

      clearTimeout(this.typingTimeout)
      this.socketService.sendMessage(message)
      this.chatService.persistMessage(message).subscribe({
        next: (persistedMessage) => {
          this.stateService.addMessage(persistedMessage)
          //  console.info('Persisté: ', persistedMessage)
        },
        error: (err) => console.error('Erreur: ', err)
      })
    } else {
      console.warn('Aucun utilisateur courant ou conversationId')
    }

  }
  //Mise à jour du statut de l'utilisateur
  onTyping(): void {
    clearTimeout(this.typingTimeout)
    this.socketService.updateStatus('typing')
    this.typingTimeout = setTimeout(() => {
      this.socketService.updateStatus('online')
    }, 2000)
  }
  //Gestion de l'erreur
  retryLoad(): void {
    this.errorMessage.set(null)
    this.initChat()
  }

  //==================================== PRIVATE METHODS ====================================/

  private initChat(): void {
    console.log('Init initChat ')

    combineLatest([
      this.chatService.getAllConversations(),
      this.chatService.getUsers()
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ([conversations, users]) => {
          this.stateService.setConversations(conversations || [])
          this.stateService.setUsers(users || [])
          if (conversations && conversations.length > 0) {
            this.stateService.setCurrentConversation(conversations[0]._id)
            this.loadMessages(conversations[0]._id)
            const currentUser = this.currentUser()
            if (currentUser) {
              this.stateService.addUserInConversation(currentUser)
            }
          } else {
            this.loadDefaultConversationWithDefaultMessage()
          }
        },
        error: (err) => {
          console.error('Erreur chargement initial:', err)
          this.errorMessage.set('Erreur lors du chargement du chat. Veuillez réessayer.')
        }
      })
  }

  private loadMessages(conversationId: string): void {
    this.chatService.getRecentMessages(conversationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (messages) => {
          this.stateService.setMessages(messages || [])
         // console.log('Messages récents chargés:', messages);
        },
        error: (err) => {
          console.error('Erreur chargement messages:', err)
          this.errorMessage.set('Erreur lors du chargement des messages.')
        }
      });
  }

  private loadDefaultConversationWithDefaultMessage(): void {
   const currentUser = this.stateService.currentUser()

    if (!currentUser) {
      console.error('Aucun utilisateur courant pour créer une conversation par défaut')
      return
    }
    if (currentUser) {
     // console.log('Utilisateur courant chargé:', currentUser)

      const newConversation: Conversation = {
        _id: uuidv4(),
        name: 'Conversation par défaut',
        participants: [currentUser._id],
        lastMessageId: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      this.chatService.persistConversation(newConversation).subscribe({
        next: (persistedConversation) => {
          this.stateService.addConversation(persistedConversation);
          this.stateService.setCurrentConversation(persistedConversation._id);

          const welcomeMessage: Message = {
            _id: uuidv4(),
            conversationId: persistedConversation._id,
            userId: currentUser._id,
            timestamp: new Date().toISOString(),
            content: `Bonjour ${this.currentUser()?.username}, bienvenue dans une nouvelle conversation.`,
            status: 'sent'
          }

          this.chatService.persistMessage(welcomeMessage).subscribe({
            next: (persistedMessage) => {
              this.stateService.addMessage(persistedMessage);
            },
            error: (err) => {
              console.error('Erreur persistance message:', err)
              this.errorMessage.set('Erreur lors de la création du message par défaut.')
            }
          })
        },
        error: (err) => {
          console.error('Erreur persistance conversation:', err)
          this.errorMessage.set('Erreur lors de la création de la conversation.')
        }
      })
    }
  }
}