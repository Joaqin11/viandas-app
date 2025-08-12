// src/app/auth/auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth'; // Importa tu AuthService
import { map } from 'rxjs/operators';
import { of } from 'rxjs'; // Necesario para 'of' si el servicio devuelve un observable

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si el usuario está logueado, permite el acceso
  if (authService.isLoggedIn()) {
    return true;
  } else {
    // Si no está logueado, redirige a la página de login
    router.navigate(['/login']);
    return false;
  }
};