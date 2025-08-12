import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // <-- Importa esto
import { routes } from './app.routes';
import { jwtInterceptor } from './auth/jwt-interceptor'; // <-- Importa tu interceptor
// ¡Importa estos dos!
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
// También necesitarás el token de localización
import { LOCALE_ID } from '@angular/core';
// ¡Registra el idioma español!
registerLocaleData(localeEs, 'es');



export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtInterceptor])), // <-- Añade esta línea
    // ¡Añade este proveedor para establecer la localización por defecto a español!
    { provide: LOCALE_ID, useValue: 'es' }
  ]
};
