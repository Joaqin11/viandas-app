import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
//import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) { }

  onRegister() {
    const registerPayload = {
      userName: this.username, // Coincide con el nombre de la propiedad en tu DTO de registro del backend
      emailAddress: this.email,
      password: this.password,
      roleName: 'User'
    };

    this.authService.register(registerPayload).subscribe({ // <-- Usa authService.register
      next: (response) => {
        console.log('Registro exitoso:', response);
        alert('Registro exitoso. ¡Ahora puedes iniciar sesión!');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error durante el registro:', error);
        if (error.error && error.error.errors) {
          const errors = error.error.errors;
          let errorMsg = 'Errores de registro:\n';
          for (const key in errors) {
            if (errors.hasOwnProperty(key)) {
              errorMsg += `- ${key}: ${errors[key].join(', ')}\n`;
            }
          }
          alert(errorMsg);
        } else {
          alert('Ocurrió un error al intentar registrarse.');
        }
      }
    });
  }
}