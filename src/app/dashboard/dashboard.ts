// src/app/dashboard/dashboard.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core'; // <-- Importa OnInit y OnDestroy
import { CommonModule } from '@angular/common'; // Siempre necesario para directivas como ngIf, ngFor
import { AuthService } from '../auth/auth'; // <-- Importa el AuthService
import { Subscription } from 'rxjs'; // <-- Importa Subscription
import { RouterLink } from '@angular/router'; // <-- ¡IMPORTA ESTO!

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink], // Asegúrate que CommonModule esté aquí
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit, OnDestroy { // <-- Implementa OnInit y OnDestroy
  username: string | null = null;
  userRoles: string[] = [];
  private subscriptions: Subscription[] = []; // Para manejar las suscripciones y evitar fugas de memoria

  constructor(public authService: AuthService) { } // <-- Inyecta AuthService

  ngOnInit(): void {
    // Suscribirse al username
    this.subscriptions.push(
      this.authService.getUsername().subscribe(name => {
        this.username = name;
      })
    );

    // Suscribirse a los roles
    this.subscriptions.push(
      this.authService.getUserRoles().subscribe(roles => {
        this.userRoles = roles;
      })
    );
  }

  ngOnDestroy(): void {
    // Desuscribirse de todas las suscripciones para evitar fugas de memoria
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  logout() {
    this.authService.logout(); // Llama al método logout del AuthService
  }
}