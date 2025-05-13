import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, retry, tap, throwError, timeout } from 'rxjs';
import { environment } from '../../../core/config/environment';
import { messages } from '../../chat/models/message';
import { User } from '../../chat/models/user';
import { UserResponse } from '../../chat/models/user-response';
import { LocalStorageService } from '../../chat/services/local-storage.service';
import { conversations } from '../../chat/models/conversation';
import { API_ENDPOINTS_AUTH, API_ENDPOINTS_PERSIST } from '../../../core/config/api-urls';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient)
  private readonly baseUrl = environment.api_docker
  private readonly localStorageService = inject(LocalStorageService)

  private getHeaders(token?: string): HttpHeaders {
    const storedToken = token || this.localStorageService.getItem<string>('token');
    return storedToken ? new HttpHeaders({ Authorization: `Bearer ${storedToken}` }) : new HttpHeaders();
  }
  /**
  * Connexion au compte
  * 
  * @param email 
  * @param password 
  * @returns 
  */
  logIn(email: string, password: string): Observable<User> {
    const profil = { email, password }
    
    return this.http.post<UserResponse>(API_ENDPOINTS_AUTH.login, profil, {headers: this.getHeaders()}).pipe(
      map(response => ({
        _id: response.userId,
        username: response.username,
        email: response.email,
        status: response.status ?? 'online',
        token: response.token
      })),

      tap(response => {
        if (response && response.token) {
          this.localStorageService.clear()
          this.localStorageService.setItem('token', response.token)
          this.localStorageService.setItem('email', response.email)
          this.localStorageService.setItem('_id', response._id)
          this.localStorageService.setItem('username', response.username)
        }
      }),
      catchError(error => {
        console.error('Erreur login:', error);
        return throwError(() => error)
      })
    )
  }
  /**
   * Création de compte
   * 
   * @param username 
   * @param password 
   * @param email 
   * @returns 
   */
  signUp(username: string, password: string, email: string): Observable<User> {
    const profil = { userName: username, password: password, email: email
    }
    return this.http.post<UserResponse>(API_ENDPOINTS_AUTH.register, profil).pipe(
      map(response => ({
        _id: response.userId,
        username: response.username,
        email: response.email,
        status: response.status ?? 'offline',
        token: response.token,
      })),
      catchError(error => {
        console.error('Erreur dans signUp', error)
        return throwError(error);
      })
    )
  }
  /**
   * Vérifie si l'utilisateur est connecté
   * 
   * @returns Un utilisateur
   */
  getUserByToken(token: string): Observable<User> {
    return this.http.get<User>(API_ENDPOINTS_AUTH.me, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
    })
      .pipe(
        retry(2),
        map(user => ({
          ...user,
          status: user.status ?? 'offline',
        })),
        catchError(error => {
          console.error('Erreur getUserByToken:', error);
          return throwError(() => error);
        }),
      )
  }

  getUserById(userId: string): Observable<User> {
    const token = inject(LocalStorageService).getItem<string>('token')
    return this.http.get<User>(API_ENDPOINTS_AUTH.getUserById(userId), {
      headers: { Authorization: `Bearer ${token}` }
    })
      .pipe(
        timeout(5000),
        retry(2),
        map(user => ({
          ...user,
          status: user.status ?? 'offline',
        })),
        catchError(error => {
          console.error('Erreur getUserById:', error);
          return throwError(() => error);
        }),
      )
  }

  getRecentMessagesByToken(token: string, conversationId: string): Observable<messages> {
    return this.http.get<messages>(API_ENDPOINTS_PERSIST.getMessagesByConversationId(conversationId), {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
    })
      .pipe(
        retry(2),
        catchError(error => {
          console.error('Erreur getRecentMessagesByToken:', error);
          return throwError(() => error);
        })
      )
  }

  getAllConversations(token: string): Observable<conversations> {
    return this.http.get<conversations>(API_ENDPOINTS_PERSIST.getAllConversations, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
    }).pipe(
      retry(2),
      catchError(error => {
        console.error('Erreur getAllConversations:', error)
        return throwError(() => error)
      })
    )
  }
  
  public logOut(): void {
    this.localStorageService.clear()
  }

}