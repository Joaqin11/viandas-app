// src/app/auth/role.guard.ts
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth'; // Asegúrate de la ruta correcta
import { map, catchError } from 'rxjs/operators'; // ¡Importa map y catchError!
import { of } from 'rxjs'; // ¡Importa of!

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRoles = route.data['roles'] as string[]; // Roles que la ruta espera

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  // ¡Aquí es donde manejamos el Observable<string[]>!
  return authService.getUserRoles().pipe( // Suscribimos al Observable de roles
    map(userRoles => { // 'userRoles' ahora es string[]
      // Verificar si alguno de los roles del usuario está en los roles esperados
      const hasRequiredRole = expectedRoles.some(expectedRole => userRoles.includes(expectedRole));

      if (hasRequiredRole) {
        return true; // El usuario tiene al menos uno de los roles requeridos
      } else {
        router.navigate(['/dashboard']);
        alert('Acceso denegado. No tienes los permisos necesarios.');
        return false;
      }
    }),
    catchError((err) => {
      console.error('Error al verificar roles:', err);
      router.navigate(['/dashboard']);
      alert('Error al verificar permisos. Acceso denegado.');
      return of(false); // En caso de error, denegar el acceso
    })
  );
};