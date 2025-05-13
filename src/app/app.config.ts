import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { jwtInterceptor } from './features/auth/interceptors/jwt.interceptor';
import { logginInterceptor } from './features/auth/interceptors/loggin.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors([
        jwtInterceptor, // Ajout de l'intercepteur JWT
        logginInterceptor // Ajout de l'intercepteur de journalisation
      ])  

    ),
    provideRouter(routes)]
};
