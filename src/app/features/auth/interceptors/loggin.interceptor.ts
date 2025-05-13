import { HttpInterceptorFn } from '@angular/common/http';

export const logginInterceptor: HttpInterceptorFn = (request, next) => {
  console.log('Init logginInterceptor')
  
  // console.log(`LoggingInterceptor: Requête vers ${request.url}`)

  // console.log(`Réponse reçu du backend body: ${request.body}`)
  // console.log(`Réponse reçu du backend headers: ${request.headers}`)
  console.log('Fin logginInterceptor')
  return next(request)
}