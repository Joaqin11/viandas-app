// src/app/features/user-selection/user-menu-selection/user-menu-selection.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuService } from '../../../services/menu';
import { UserSelectionService } from '../user-selection';
import { AuthService } from '../../../../app/auth/auth';
import { DailyMenu, Menu } from '../../../models/menu.model'; // Asegúrate de que MenuCategory esté exportada
import { UserSelectionRequest, UserSelectionResponse } from '../../../../app/models/user-selection.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-menu-selection',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-menu-selection.component.html',
  styleUrls: ['./user-menu-selection.component.scss']
})
export class UserMenuSelectionComponent implements OnInit {
  dailyMenu: DailyMenu | null = null;
  selectedDate: string;
  selectedMenuId: number | null = null; // El ID del Menu (plato) seleccionado
  currentDailyMenuId: number | null = null; // El ID del DailyMenu cargado
  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  currentUserId: number | null = null;
  
  isObservationRequired: boolean = false; // <-- NUEVO: Bandera para controlar si la observación es requerida

  userObservation: string = '';
  // No necesitamos una propiedad 'selectedCategory' separada con [(ngModel)] en el HTML,
  // la obtendremos directamente del menú seleccionado.
  // Puedes mantenerla como una propiedad privada si la necesitas para el request.

  selectedMenuName: string | null = null; // <-- NUEVO: Para mostrar el nombre del menú seleccionado
  selectedMenuCategory: string | null = null; // <-- NUEVO: Para guardar la categoría del menú seleccionado automáticamente

  // Ya no necesitamos un array de menuCategories para un select
  // menuCategories: string[] = ['Clásica', 'Express', 'Veggie', 'Especial'];


  constructor(
    private menuService: MenuService,
    private userSelectionService: UserSelectionService,
    private authService: AuthService,
    private router: Router
  ) {
    this.selectedDate = new Date().toISOString().split('T')[0];
    //console.log('Fecha seleccionada por defecto:', this.selectedDate);
  }

  ngOnInit(): void {
    const userIdString = this.authService.getUserId();
    if (userIdString) {
        this.currentUserId = +userIdString;
    } else {
        this.errorMessage = 'No se pudo obtener el ID del usuario. Por favor, inicia sesión de nuevo.';
        this.router.navigate(['/login']);
        return;
    }
    this.loadDailyMenu();
  }

  loadDailyMenu(): void {
    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;
    this.dailyMenu = null;
    this.currentDailyMenuId = null;
    this.selectedMenuId = null;
    this.selectedMenuName = null; // Limpiar al cargar nuevo menú
    this.selectedMenuCategory = null; // Limpiar al cargar nuevo menú
    this.userObservation = '';

    // Reinicia el estado de la observación requerida al cargar un nuevo menú/fecha
    this.isObservationRequired = false; // <--- Reiniciar aquí

    if (!this.selectedDate) {
      this.errorMessage = 'Por favor, selecciona una fecha para cargar el menú.';
      this.loading = false;
      return;
    }

    this.menuService.getDailyMenuByDate(this.selectedDate).subscribe({
      next: (data) => {
        this.dailyMenu = data;
        this.currentDailyMenuId = data.id;
        this.loading = false;
        if (this.dailyMenu && this.dailyMenu.items && this.dailyMenu.items.length > 0) {
          this.selectedMenuId = this.dailyMenu.items[0].id;
          // Al preseleccionar el primer elemento, también actualiza el nombre y categoría
          this.updateSelectedMenuDetails(this.selectedMenuId);
        }
        // Después de cargar el menú, verifica si el usuario ya tiene una selección para esta fecha
        if (this.currentUserId) {
          //console.log('Verificando selecciones previas para el usuario y la fecha:', this.currentUserId, this.selectedDate);
          this.userSelectionService.userHasSelectionForDate(this.currentUserId, this.selectedDate).subscribe({
            next: (hasSelection) => {
              this.isObservationRequired = hasSelection; // <--- Actualiza la bandera
              //console.log('El usuario ya tiene una selección para esta fecha:', hasSelection);
              if (hasSelection) {
                this.errorMessage = 'Ya tienes una selección para esta fecha. La observación es obligatoria para guardar una segunda selección.';
              }
            },
            error: (err) => {
              console.error('Error al verificar selecciones previas:', err);
              // Podrías decidir qué hacer aquí, ej. asumir que la observación es obligatoria por seguridad
              // this.isObservationRequired = true;
            }
          });
        }

      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar el menú diario:', err);
        this.loading = false;
        this.dailyMenu = null;
        this.currentDailyMenuId = null;
        if (err.status === 404 && typeof err.error === 'string' && err.error.includes('No se encontró menú')) {
          //console.log(this.selectedDate)
          //console.log(this.selectedDate.split('T')[0])
          //console.log(this.selectedDate.split('-'))
          this.errorMessage = `No hay menú disponible para la fecha ${this.formatDateForDisplay2(this.selectedDate)}.`;
        } else if (err.status === 401 || err.status === 403) {
          this.errorMessage = 'No tienes permisos para ver los menús.';
        } else {
          this.errorMessage = 'Ocurrió un error al cargar el menú diario. Inténtalo de nuevo más tarde.';
        }
      }
    });
  }

  // NUEVO MÉTODO: Para actualizar el nombre y categoría del menú seleccionado
  onMenuSelectionChange(): void {
    if (this.selectedMenuId) {
      this.updateSelectedMenuDetails(this.selectedMenuId);
    } else {
      this.selectedMenuName = null;
      this.selectedMenuCategory = null;
    }
  }

  private updateSelectedMenuDetails(menuId: number): void {
    if (this.dailyMenu && this.dailyMenu.items) {
      const selectedMenuItem = this.dailyMenu.items.find(item => item.id === menuId);
      if (selectedMenuItem) {
        this.selectedMenuName = selectedMenuItem.name;
        this.selectedMenuCategory = selectedMenuItem.category;
      } else {
        this.selectedMenuName = null;
        this.selectedMenuCategory = null;
      }
    }
  }


  submitSelection(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.currentUserId === null) {
      this.errorMessage = 'No se pudo identificar al usuario para la selección.';
      return;
    }

    if (this.selectedMenuId === null || this.selectedMenuCategory === null) { // Asegurarse que tenemos la categoría
      this.errorMessage = 'Por favor, selecciona una opción de menú válida.';
      return;
    }

    if (this.currentDailyMenuId === null) {
      this.errorMessage = 'No se ha cargado un menú diario válido. Por favor, recarga el menú.';
      return;
    }

    // Lógica de VALIDACIÓN CONDICIONAL para la observación
    if (this.isObservationRequired && !this.userObservation.trim()) {
        this.errorMessage = 'Como ya tienes una selección para este día, la observación es obligatoria.';
        return;
    }

    // La Observación sigue siendo un campo libre, pero ahora es el único que el usuario llena.
    // Si Observation puede ser opcional en el backend, puedes quitar esta validación.
    // Pero dado el "field is required" anterior, la mantendremos.
    // if (!this.userObservation.trim()) {
    //     this.errorMessage = 'El campo Observación es requerido.';
    //     return;
    // }


    const selectionRequest: UserSelectionRequest = {
      userId: this.currentUserId,
      dailyMenuId: this.currentDailyMenuId,
      selectionDateTime: new Date().toISOString(),
      observation: this.userObservation,
      selectedCategory: this.selectedMenuCategory // <-- ¡Ahora usamos la categoría que se autoseleccionó!
    };

    this.userSelectionService.createUserSelection(selectionRequest).subscribe({
      next: (response) => {
        console.log('Selección realizada exitosamente:', response);
        this.successMessage = 'Tu selección ha sido guardada con éxito.';
        // Limpiar y resetear el estado después de una selección exitosa
        this.selectedMenuId = null;
        this.selectedMenuName = null;
        this.selectedMenuCategory = null;
        this.userObservation = '';
        // Opcional: recargar el menú diario para reflejar posibles cambios o para que el usuario pueda hacer otra selección
        // this.loadDailyMenu();
        // setTimeout(() => this.router.navigate(['/dashboard']), 2000);
        // Después de guardar, vuelve a verificar si la observación es ahora requerida (si se hizo una segunda selección)
        // Esto es importante si el usuario va a seguir haciendo selecciones el mismo día.
        if (this.currentUserId && this.selectedDate) {
          this.userSelectionService.userHasSelectionForDate(this.currentUserId, this.selectedDate).subscribe({
            next: (hasSelection) => {
              this.isObservationRequired = hasSelection;
              if (hasSelection) {
                this.errorMessage = 'Ya tienes una selección para esta fecha. La observación es obligatoria para guardar una segunda selección.';
              }
            }
          });
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al guardar la selección:', err);
        if (err.error && err.error.errors) {
          let errorMessages = '';
          for (const key in err.error.errors) {
            if (err.error.errors.hasOwnProperty(key)) {
              errorMessages += `${key}: ${err.error.errors[key].join(', ')}\n`;
            }
          }
          this.errorMessage = `Errores de validación del servidor:\n${errorMessages}`;
        } else if (err.error && typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'No se pudo guardar tu selección. Inténtalo de nuevo.';
        }
      }
    });
  }

  formatDateForDisplay(dateString: string): string {
    if (!dateString) { return ''; }
    const date = new Date(dateString);
    //console.log(date)
    if (isNaN(date.getTime())) {
      console.error('Error al parsear la fecha:', dateString);
      return dateString;
    }
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Método auxiliar para formatear la fecha para mostrar en la UI
  //  return `${day}/${month}/${year}`;
  formatDateForDisplay2(dateString: string): string {
    if (!dateString) {
      return ''; // Devuelve una cadena vacía si no hay fecha
    }

    // Paso 1: Crea un objeto Date de JavaScript a partir de la cadena de fecha.
    // Date() de JS puede parsear automáticamente los formatos ISO 8601.
    // Divide el string en sus partes (año, mes, día) usando el guion como separador
    const parts = dateString.split('-');
    // Verifica que tengamos 3 partes (año, mes, día)
  if (parts.length !== 3) {
    console.error('Formato de fecha inesperado:', dateString);
    return dateString; // Devuelve el string original o maneja el error como prefieras
  }

    // Paso 2: Extrae día, mes y año.
    // getUTCDate(), getUTCMonth(), getUTCFullYear() son útiles si quieres
    // asegurarte de no tener problemas con zonas horarias.
    // Si siempre manejas la fecha sin hora o la hora no importa, getDay(), getMonth(), getFullYear() también son válidos.
    // Para consistencia con el formato que ya tenías, usaremos el local.
    // const day = date.getDate().toString().padStart(2, '0'); // Añade '0' si es un solo dígito
    // const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() es base 0 (enero es 0)
    // const year = date.getFullYear();
    const year = parts[0];
    const month = parts[1]; // El mes ya viene con ceros iniciales si es necesario (ej. "06")
    const day = parts[2];   // El día ya viene con ceros iniciales si es necesario (ej. "21")

    // Paso 4: Retorna la fecha formateada
    return `${day}/${month}/${year}`;
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}

  
