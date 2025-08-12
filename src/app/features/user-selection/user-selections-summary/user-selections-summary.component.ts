// src/app/features/user-selection/user-selections-summary/user-selections-summary.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para ngModel
import { Router } from '@angular/router';
// Importa los servicios y modelos que necesitas
import { UserSelectionService } from '../user-selection';
import { AuthService } from '../../../../app/auth/auth'; // Asegúrate de tener un servicio de autenticación
import { UserSelectionSummary } from '../../../models/user-selection-summary.model' // Este es el modelo del backend


@Component({
  selector: 'app-user-selections-summary',
  imports: [CommonModule, FormsModule], // Importa FormsModule para los inputs
  templateUrl: './user-selections-summary.component.html',
  styleUrl: './user-selections-summary.component.scss'
})
export class UserSelectionsSummaryComponent implements OnInit {

  userId: number = 0; // Este ID se obtendrá del servicio de autenticación
  startDate: string; // Usaremos ngModel para esta variable
  selections: UserSelectionSummary[] = [];
  loading = false;
  errorMessage = '';
  successMessage: string | null = null;

  constructor(
    private userSelectionService: UserSelectionService,
    private authService: AuthService,
    private router: Router
  ) {
    // Inicializa la fecha de inicio a la fecha actual en formato YYYY-MM-DD
    const today = new Date();
    this.startDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    // Obtiene el ID del usuario al iniciar el componente
    const userIdString = this.authService.getUserId();
    if (userIdString) {
        this.userId = +userIdString;
    } else {
        this.errorMessage = 'No se pudo obtener el ID del usuario. Por favor, inicia sesión de nuevo.';
        this.router.navigate(['/login']);
        return;
    }
    this.loadUserSelections();
  }

  loadUserSelections(): void {
    if (!this.userId || !this.startDate) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = null;

    // Llama al servicio para obtener los datos
    this.userSelectionService.getUserSelectionsSummary(this.userId, this.startDate).subscribe({
      next: (data) => {
        this.selections = data;
        this.loading = false;
        console.log('Datos cargados:', this.selections);
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar las selecciones.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  // --- ¡Añade este nuevo método! ---
  cancelSelection(selectionId: number): void {
    if (this.userId && confirm('¿Estás seguro de que quieres cancelar esta vianda?')) {
      this.loading = true;
      this.userSelectionService.cancelUserSelection(selectionId, this.userId).subscribe({
        next: () => {
          console.log(`Selección con ID ${selectionId} cancelada.`);
          // Vuelve a cargar las selecciones para reflejar el cambio
          this.loadUserSelections();
          this.successMessage = 'Tu vianda ha sido cancelada con éxito.'; 
        },
        error: (err) => {
          this.errorMessage = 'Error al cancelar la selección.';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }
  // ---------------------------------

  // Método para agrupar las selecciones por fecha, útil para la vista
  groupSelectionsByDate(): { date: string, items: UserSelectionSummary[] }[] {
    const grouped = new Map<string, UserSelectionSummary[]>();
    this.selections.forEach(sel => {
      const date = sel.menuDate.split('T')[0];
      if (!grouped.has(date)) {
        grouped.set(date, []);
      }
      grouped.get(date)?.push(sel);
    });

    return Array.from(grouped.entries()).map(([date, items]) => ({ date, items }));
  }
}