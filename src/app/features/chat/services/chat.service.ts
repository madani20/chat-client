import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';
import { API_ENDPOINTS_PERSIST } from '../../../core/config/api-urls';
import { Conversation, conversations } from '../models/conversation';
import { Message, messages } from '../models/message';
import { users } from '../models/user';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})

export class ChatService {

  private readonly http = inject(HttpClient)
  private readonly localStorageService = inject(LocalStorageService)
 
  private getHeaders(): HttpHeaders {
    const token = this.localStorageService.getItem<string>('token')
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders()
  }
  /**
   * Persiste un message
   * 
   * @param message 
   * @returns Les messages persistés
   */
  persistMessage(message: Message): Observable<Message> {
    const messageToSend = { ...message, status: 'sent' }
    return this.http.post<Message>(API_ENDPOINTS_PERSIST.saveMessages, messageToSend, { headers: this.getHeaders() })
      .pipe(
        retry(2),
    )
  }
  /**
   * Récupère les messages récents d'une conversation
   * 
   * @param conversationId 
   * @returns Les messages d'une conversation
   */
  getRecentMessages(conversationId: string): Observable<messages> {
    return this.http.get<messages>(API_ENDPOINTS_PERSIST.getMessagesByConversationId(conversationId), { headers: this.getHeaders() })
      .pipe(
        retry(2))
      }
  /**
   *  Récupère toutes les conversations 
   * 
   * @returns Toutes les conversations
   */
  getAllConversations(): Observable<conversations> {
   return this.http.get<conversations>(API_ENDPOINTS_PERSIST.getAllConversations, { headers: this.getHeaders() })
      .pipe(
        retry(2),
      )
  }
  /**
   * Persiste une conversation
   * 
   * @param conversation 
   * @returns Les conversations persistées
   */
  persistConversation(conversation: Conversation): Observable<Conversation> {
    return this.http.post<Conversation>(API_ENDPOINTS_PERSIST.saveConversation, conversation, { headers: this.getHeaders() })
      .pipe(
        retry(2)
      )
  }
  /**
   * Récupère tous les utilisateurs
   * 
   * @returns Tous les utilisateurs
   */
  getUsers(): Observable<users> {
    return this.http.get<users>(API_ENDPOINTS_PERSIST.getUsers, { headers: this.getHeaders() })
      .pipe(
        retry(2)
      )
  }
}
