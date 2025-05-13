import { effect, inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Message } from '../../features/chat/models/message';
import { User, users } from '../../features/chat/models/user';
import { ChatStateService } from '../../features/chat/services/chat-state.service';
import { LocalStorageService } from '../../features/chat/services/local-storage.service';
import { environment } from '../config/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private readonly stateService = inject(ChatStateService)
  private readonly localStorageService = inject(LocalStorageService)

  private socket: WebSocket | null = null
  private messageSubject = new Subject<Message>()
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private isConnecting = false
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null

  constructor() {
    effect(() => {
      const user = this.stateService.currentUser()
      if (user && !this.socket && !this.isConnecting) {
        this.connect()
      }
    })

    window.addEventListener('beforeunload', () => {
      this.disconnect()
    })
  }

  public connect(): void {
    if (this.isConnecting || (this.socket && this.socket.readyState === WebSocket.OPEN))
      return

    const token = this.localStorageService.getItem<string>('token')
    if (!token) {
      console.error('Aucun token pour WebSocket, connexion annulée')
      this.isConnecting = false
      return
    }
    this.isConnecting = true;
    this.socket = new WebSocket(`${environment.api_docker.webSocketUrl}?Authorization=Bearer ${token}`)

    this.socket.onopen = () => {
      //console.log('WebSocket connecté sur', new Date(), 'Session ID:', this.socket?.url)
      this.reconnectAttempts = 0
      this.isConnecting = false
      this.startHeartbeat()
      this.updateStatus('online')
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout)
        this.reconnectTimeout = null
      }
    }

    this.socket.onmessage = (event) => {
      try {
        const { event: eventType, data } = JSON.parse(event.data) as { event: string; data: any }
        switch (eventType) {
          case 'ping':
            this.socket?.send(JSON.stringify({ event: 'pong' }))
            break
          case 'userStatus':
            this.handleUserStatus(data as User[])
            break
          case 'message':
            this.handleMessage(data as Message)
            break
        }
      } catch (e) {
        console.error('Erreur parsing message WebSocket:', e, event.data)
      }
    }

    this.socket.onclose = (ev) => {
      console.warn('WebSocket fermé, code:', ev.code, 'raison:', ev.reason);
      this.stopHeartbeat();
      this.isConnecting = false;
      this.socket = null;
      if (this.reconnectAttempts < this.maxReconnectAttempts && ev.code !== 1000) {
        this.reconnectTimeout = setTimeout(() => {
          console.log('Tentative de reconnexion:', this.reconnectAttempts + 1);
          this.connect();
          this.reconnectAttempts++;
        }, 3000);
      } else {
        console.error('Max tentatives de reconnexion atteint ou fermeture normale')
      }
    }

    this.socket.onerror = (error) => {
      console.error('Erreur WebSocket:', error);
      this.stopHeartbeat();
      this.isConnecting = false;
      this.socket = null;
    }
  }

  private handleUserStatus(newUsers: users): void {
    const currentUsers = this.stateService.users() || []
    const currentUser = this.stateService.currentUser()
    const mergedUsers = [...currentUsers, ...newUsers.filter(u => !currentUsers.some(cu => cu._id === u._id))]
    if (currentUser && !mergedUsers.some(u => u._id === currentUser._id)) {
      mergedUsers.push({ ...currentUser, status: 'online' });
    }
    this.stateService.updateUsers(mergedUsers)
    this.updateConversationParticipants(mergedUsers)
  }

  private handleMessage(message: Message): void {
    const currentMessages = this.stateService.messages()
    if (!currentMessages.some(m => m._id === message._id)) {
      this.stateService.addMessage(message)
      this.messageSubject.next(message)
    }
  }
  /**
   * Met à jour les participants de la conversation courante
   * @param users Liste des utilisateurs
   */
  private updateConversationParticipants(users: User[]) {
    const currentUser = this.stateService.currentUser();

    if (!currentUser) return
    const convId = this.stateService.currentConversationId()
    if (!convId) return;

    let conversations = this.stateService.conversations()
    let currentConversation = conversations.find(c => c._id === convId)
    if (!currentConversation) {
      currentConversation = {
        _id: convId,
        participants: [currentUser._id],
        name: 'New Conversation',
        lastMessageId: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      const onlineUserIds = new Set(users.filter(u => u.status === 'online').map(u => u._id))
      currentConversation.participants = Array.from(new Set([
        currentUser._id,
        ...(currentConversation.participants || []).filter(id => onlineUserIds.has(id))
      ]))
      this.stateService.setConversations([currentConversation, ...conversations.filter(c => c._id !== convId)])
    }
  }

  private ensureConnection(): boolean {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      if (!this.isConnecting) this.connect();
      return false;
    }
    return true;
  }
  private startHeartbeat() {
    this.stopHeartbeat()
    this.heartbeatInterval = setInterval(() => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ event: 'ping' }))
      }
    }, 30000)
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  onMessage(): Observable<Message> {
    return this.messageSubject.asObservable();
  }

  sendMessage(message: Message): void {
    if (!this.ensureConnection()) {
      this.stateService.addMessage(message)
      return
    }

    const user = this.stateService.currentUser()
    if (!user || !message.conversationId) return

    message.userId = user._id
    message.status = 'sending'
    this.stateService.addMessage(message)

    this.socket!.send(JSON.stringify({ event: 'message', data: message }))
    message.status = 'sent'
  }

  updateStatus(status: User['status']): void {
    if (!this.ensureConnection()) return

    const user = this.stateService.currentUser()
    if (!user) return;

    this.socket!.send(JSON.stringify({ event: 'userStatus', data: { userId: user._id, status } }))
  }

  disconnect(): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.close(1000, 'Déconnexion volontaire');
    
    this.socket = null
    this.isConnecting = false
    this.reconnectAttempts = 0
    this.stopHeartbeat()
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }
    }
  }
}
