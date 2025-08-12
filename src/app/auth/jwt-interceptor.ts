// src/app/auth/jwt.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth';  // Importa el AuthService

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService); // Inyecta el AuthService
  const token = authService.getToken(); // Obtiene el token

  // Clona la solicitud y añade el encabezado de autorización si hay un token
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
