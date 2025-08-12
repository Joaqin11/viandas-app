// src/app/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode'; // Importa jwtDecode

// Si jwt-decode da error al importar, puedes necesitar instalarlo:
// npm install jwt-decode

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'jwt_token';
  private userRolesSubject = new BehaviorSubject<string[]>([]);
  private usernameSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    // Al inicializar el servicio, intentar cargar los roles y username si ya hay un token
    this.loadUserDataFromToken(); // <-- Llama a este método más completo
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>('/api/Auth/login', credentials).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem(this.tokenKey, response.token);
          this.loadUserDataFromToken(); // <-- Cargar todos los datos del token después del login
        }
      })
    );
  }

  // Método para manejar el registro
  register(userData: any): Observable<any> {
    return this.http.post<any>('/api/Auth/register', userData, { responseType: 'text' as 'json' });
    // NOTA: 'responseType: 'text' as 'json'' es una solución temporal
    // Si tu backend SIEMPRE devuelve JSON (incluso para éxito como {message: '...'}),
    // puedes quitar '{ responseType: 'text' as 'json' }'.
    // Si tu backend devuelve un STRING para el éxito, y JSON para el error,
    // esto es una forma de engañar a Angular para que no intente parsear el string como JSON.
    // La mejor práctica es que el backend devuelva SIEMPRE JSON.
  }

  // Obtener el token JWT
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Verificar si el usuario está logueado
  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  private loadUserDataFromToken(): void {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);

        // ACTUALIZADO: Usar el nombre de claim exacto de tu token para el username
        const username = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || null;
        this.usernameSubject.next(username);

        // ACTUALIZADO: Usar el nombre de claim exacto de tu token para los roles
        const roleClaim = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        const roles = roleClaim ? (Array.isArray(roleClaim) ? roleClaim : [roleClaim]) : [];
        this.userRolesSubject.next(roles);

      } catch (e) {
        console.error('Error decodificando el token o al cargar datos de usuario:', e);
        this.logout();
      }
    } else {
      this.usernameSubject.next(null);
      this.userRolesSubject.next([]);
    }
  }

  // Nuevo método para obtener el username
  getUsername(): Observable<string | null> {
    return this.usernameSubject.asObservable();
  }

  // Obtener los roles del usuario (como Observable para que los componentes puedan suscribirse)
  getUserRoles(): Observable<string[]> {
    return this.userRolesSubject.asObservable();
  }

  // Puedes mantener getUserRole() para compatibilidad si solo esperas un rol principal
  getUserRole(): string | null {
    const roles = this.userRolesSubject.value; // Accede al valor actual
    return roles.length > 0 ? roles[0] : null; // Devuelve el primer rol, o null
  }

  // Verificar si el usuario tiene un rol específico
  hasRole(role: string): boolean {
    const currentRoles = this.userRolesSubject.getValue();
    return currentRoles.includes(role);
  }

  // Verificar si el token ha expirado
  private isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      if (decoded.exp) {
        const expirationDate = new Date(0);
        expirationDate.setUTCSeconds(decoded.exp);
        return expirationDate.valueOf() < new Date().valueOf();
      } else {
        return false; // No hay fecha de expiración, asumimos que no expira
      }
    } catch (error) {
      return true; // Si hay un error al decodificar, el token no es válido o expiró
    }
  }

  // ¡Nuevo método para obtener el ID del usuario!
  getUserId(): string | null {
    const token = this.getToken();//this.usernameSubject.value?.token;
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        // El claim de ID de usuario en tu JWT es "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        const userIdClaim = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
        return decodedToken[userIdClaim] || null;
      } catch (e) {
        console.error('Error decodificando token JWT para obtener ID:', e);
        return null;
      }
    }
    return null;
  }

  // Cerrar sesión
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.userRolesSubject.next([]); // Limpiar los roles
    this.usernameSubject.next(null); // <-- Limpia el username al cerrar sesión
    this.router.navigate(['/login']);
  }
}