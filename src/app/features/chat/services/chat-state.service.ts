import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { Conversation, conversations } from '../models/conversation';
import { Message, messages } from '../models/message';
import { User, users } from '../models/user';
import { ChatService } from './chat.service';
import { LocalStorageService } from './local-storage.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class ChatStateService {

  private readonly authService = inject(AuthService)
  private readonly chatService = inject(ChatService)
  private readonly localStorageService = inject(LocalStorageService)
  private readonly router = inject(Router)

  private messagesSignal: WritableSignal<messages> = signal([])
  private conversationsSignal: WritableSignal<conversations> = signal([])
  private currentConversationIdSignal: WritableSignal<string> = signal('')
  private usersSignal: WritableSignal<users> = signal<users>([])
  private knownUsersSignal: WritableSignal<users> = signal<users>([]); 
  private currentUserSignal: WritableSignal<User | null> = signal<User | null>(null)
  private participantsInTheCurrentConversationSignal: WritableSignal<users> = signal<users>([])


  conversations = this.conversationsSignal.asReadonly()
  messages = this.messagesSignal.asReadonly()
  users = this.usersSignal.asReadonly()
  knownUsers = this.knownUsersSignal.asReadonly()
  currentUser = this.currentUserSignal.asReadonly()
  currentConversationId = this.currentConversationIdSignal.asReadonly()
  participantsInTheCurrentConversation = this.participantsInTheCurrentConversationSignal.asReadonly()

 


  constructor() {
    this.loadCurrentUser()
  }


  //====================== GESTION DES MESSAGES =================================================================//


  addMessage(message: Message): void {
    const messages = this.messagesSignal()
    if (!messages.some(m => m._id === message._id)) {
      this.messagesSignal.set([...messages, message].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()))
    }
  }

  setMessages(messages: Message[]): void {
    this.messagesSignal.set([...messages].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()))
  }

  loadRecentMessages(conversationId: string): void {
    if (!conversationId) return
    const token = this.localStorageService.getItem<string>('token')
    if (token) {
      this.authService.getRecentMessagesByToken(token, conversationId).subscribe({
        next: (msgs) => this.setMessages(msgs),
        error: (err) => console.error('Erreur chargement messages:', err)
      })
    }
  }

  updateMessage(updatedMessage: Message): void {
    this.messagesSignal.update(msgs => 
      msgs.map(m => m._id === updatedMessage._id ? { ...m, status: updatedMessage.status } : m)
    )
  }

  //===========================  GESTION DES CONVERSATIONS =======================================================//


  addConversation(conversation: Conversation): void {
    if (!this.conversations().some(c => c._id === conversation._id)) {
      this.conversationsSignal.update(convs => [...convs, conversation])
    }
  }

  setConversations(convs: conversations): void {
    this.conversationsSignal.set(convs)
 }

  setCurrentConversation(conversationId: string): void {
    const conv = this.conversations().find(c => c._id === conversationId)
    if (conv) {
      this.currentConversationIdSignal.set(conversationId)
      this.loadRecentMessages(conversationId)
    }
  }

private loadCurrentUser(): void {
    const token = this.localStorageService.getItem<string>('token')
    if (!token) {
      this.currentUserSignal.set(null)
      this.router.navigate(['/connect'])
      return;
    }

  const existingUser = this.currentUserSignal()
    if (existingUser) {
      this.updateUsersWithOnlineStatus([existingUser])
      this.loadInitialData()
      return
    }

  this.authService.getUserByToken(token).subscribe({
      next: (user) => {
        if (user) {
          this.currentUserSignal.set(user)
          this.updateUsersWithOnlineStatus([user])
          this.loadInitialData()
        } else {
          this.currentUserSignal.set(null)
          this.router.navigate(['/connect'])
        }
      },
      error: (error) => {
        console.error('Erreur chargement utilisateur:', error)
        this.currentUserSignal.set(null)
        this.router.navigate(['/connect'])
      }
    })
  }

private loadInitialData(): void {
    const token = this.localStorageService.getItem<string>('token')
    if (!token) return

    this.authService.getAllConversations(token).subscribe({
      next: (convs) => {
        this.setConversations(convs)
        if (convs.length > 0) {
          this.setCurrentConversation(convs[0]._id)
        } else {
          this.loadDefaultConversationWithDefaultMessage()
        }
      },
      error: (err) => console.error('Erreur chargement conversations:', err)
    })

    this.chatService.getUsers().subscribe({
      next: (users) => {
        const currentUser = this.currentUser()
        if (currentUser && !users.some(u => u._id === currentUser._id)) {
          users = [...users, currentUser]
        }
        this.setUsers(users)
      },
      error: (err) => console.error('Erreur chargement utilisateurs:', err)
    })
  }

private loadDefaultConversationWithDefaultMessage(): void {
    const user = this.currentUser()
    if (!user) return

    const newConversation: Conversation = {
      _id: uuidv4(),
      name: 'Conversation par défaut',
      participants: [user._id],
      lastMessageId: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.chatService.persistConversation(newConversation).subscribe({
      next: (persistedConversation) => {
        this.addConversation(persistedConversation)
        this.setCurrentConversation(persistedConversation._id)

        const message: Message = {
          _id: uuidv4(),
          conversationId: persistedConversation._id,
          userId: user._id,
          timestamp: new Date().toISOString(),
          content: 'Bonjour',
          status: 'sent'
        }

        this.chatService.persistMessage(message).subscribe({
          next: (persistedMessage) => this.addMessage(persistedMessage),
          error: (err) => console.error('Erreur persistance message:', err)
        })
      },
      error: (err) => console.error('Erreur persistance conversation:', err)
    })
  }

  //===========================  GESTION DES UTILISATEURS =======================================================//

  addUserInConversation(user: User): void {
    const exists = this.participantsInTheCurrentConversationSignal().some(u => u._id === user._id)
    if (!exists) {
      this.participantsInTheCurrentConversationSignal.update(users => [...(users || []), user])
    }
  }
  removeUserInConversation(user: User): void {
    const exists = this.participantsInTheCurrentConversationSignal().some(u => u._id === user._id)
    if (exists) {
      this.participantsInTheCurrentConversationSignal.update(users => users.filter(u => u._id !== user._id))
    }
  }

  getCurrentUserId(): string {
    const currentUser = this.currentUserSignal()
    return currentUser ? currentUser._id : ''
  }

  setUsers(users: User[]): void {
    this.usersSignal.set(users)
    this.updateKnownUsers(users)
  }

  setCurrentUser(user: User): void {
   this.currentUserSignal.set(user)
   console.log('setCurrentUser appelé avec:', user)
  }

  setUser(user: User): void {
    this.currentUserSignal.set(user)
  }

 updateUsers(users: User[]): void {
    this.usersSignal.set(users)
    this.updateKnownUsers(users)
  }
  private updateUsersWithOnlineStatus(users: User[]): void {
    const updatedUsers = users.map(u => ({ ...u, status: 'online' as 'online' }))
    this.usersSignal.update(current => [
      ...current.filter(u => !users.some(ou => ou._id === u._id)),
      ...updatedUsers.map(u => ({ ...u, status: 'online' as 'online' }))
    ])
    this.updateKnownUsers(updatedUsers)
  }

  private updateKnownUsers(users: User[]): void {
    this.knownUsersSignal.update(current => [
      ...current.filter(u => !users.some(ou => ou._id === u._id)),
      ...users
    ]);
  }
  //=============================== [ METHODE RESET POUR TESTS ] =======================================================//

  reset(): void {
    this.messagesSignal.set([])
    this.currentConversationIdSignal.set('')
    this.conversationsSignal.set([])
    this.usersSignal.set([])
    this.currentUserSignal.set(null)
  }

}
