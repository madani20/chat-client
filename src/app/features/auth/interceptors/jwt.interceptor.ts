import { HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { catchError, tap, throwError } from 'rxjs'
import { LocalStorageService } from '../../chat/services/local-storage.service'

export const jwtInterceptor: HttpInterceptorFn = (request, next) => {
  console.log('Init jwtInterceptor')
  
  const localStorageService = inject(LocalStorageService)
  // Récupération du token
  const token = localStorageService.getItem('token')

  //console.log('Token récupéré:', token) // Affichez le token dans la console
  // Récupération de l'id
  
    //==========
        // if (token != null) {
        //    const parts = token.split('.');
        //    console.log("Token parts:", parts); // Affiche les parties du token  
        //    console.log("Valid token:", parts.length === 3); // Vérifiez si le token est valide
        // }
        //==========
  // Si le token existe (présent dans localStorage), on l'ajoute dans l'en-tête de la requête
  if (token) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    })
  }
  // On affiche la requête dans la console
 // console.log('Requête interceptée depuis jwtInterceptor:', request)

  // On retourne la requête et affiche la réponse dans la console
  return next(request)
  .pipe(
    tap((event) => {
     // console.log('Réponse interceptée depuis jwtInterceptor:', event)
    }),
    catchError((error) => {
      console.error('Erreur interceptée:', error)
      return throwError(error)
    })
  )
}

