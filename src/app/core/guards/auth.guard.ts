import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { firstValueFrom } from 'rxjs'
import { ChatStateService } from '../../features/chat/services/chat-state.service'

export const authGuard: CanActivateFn = async (route, state) => {
  const chatStateService = inject(ChatStateService);
  const router = inject(Router);

  console.log('authGuard: Vérification de l’accès à', state.url);

  const currentUser = chatStateService.currentUser();
  console.log('authGuard: currentUser initial:', currentUser);

  if (currentUser) {
    console.log('authGuard: Utilisateur déjà chargé, accès autorisé');
    return true;
  }

  // Attendre que loadCurrentUser termine
  const token = chatStateService['localStorageService'].getItem<string>('token');
 // console.log('authGuard: Token présent ?', !!token);
  if (!token) {
    console.log('authGuard: Aucun token, redirection vers /connect');
    await router.navigate(['/connect']);
    return false;
  }

  try {
    console.log('authGuard: Attente de loadCurrentUser');
    const user = await firstValueFrom(chatStateService['authService'].getUserByToken(token));
    console.log('authGuard: Utilisateur reçu:', user);
    if (user) {
      chatStateService['currentUserSignal'].set(user);
      console.log('authGuard: Utilisateur chargé, accès autorisé');
      return true;
    } else {
      console.warn('authGuard: Aucun utilisateur retourné par getUserByToken');
      await router.navigate(['/connect']);
      return false;
    }
  } catch (error) {
    console.error('authGuard: Erreur chargement utilisateur:', error);
    await router.navigate(['/connect']);
    return false;
  }
}