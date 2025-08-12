import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
//import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) { } // <-- Inyecta AuthService

  onLogin() {
    const loginPayload = {
      username: this.username,
      password: this.password
    };

    this.authService.login(loginPayload).subscribe({ // <-- Usa authService.login
      next: (response) => {
        console.log('Login exitoso:', response);
        // El token ya se guarda dentro de authService.login
        this.router.navigate(['/dashboard']); // Redirige al dashboard (lo crearemos luego)
      },
      error: (error) => {
        console.error('Error durante el login:', error);
        if (error.status === 401) {
          alert('Credenciales inválidas.');
        } else if (error.error && error.error.errors) {
          const errors = error.error.errors;
          let errorMsg = 'Errores de login:\n';
          for (const key in errors) {
            if (errors.hasOwnProperty(key)) {
              errorMsg += `- ${key}: ${errors[key].join(', ')}\n`;
            }
          }
          alert(errorMsg);
        }
        else {
          alert('Ocurrió un error al intentar iniciar sesión.');
        }
      }
    });
  }
}