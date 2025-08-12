// src/app/features/menu-management/menu-list/menu-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService } from '../../../services/menu'; // <-- Importa el servicio
import { DailyMenu, Menu, } from '../../../models/menu.model'; // <-- Importa los modelos
import { FormsModule } from '@angular/forms'; // Necesario para ngModel si añadimos input de fecha
import { RouterLink } from '@angular/router'; // <-- ¡Asegúrate de importar RouterLink!
import { AuthService } from '../../../auth/auth'; // ¡Importa AuthService!

@Component({
  selector: 'app-menu-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], // Asegúrate de tener FormsModule si usas ngModel
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss']
})
export class MenuListComponent implements OnInit {
  dailyMenu: DailyMenu | null = null;
  selectedDate: string; // Para el input de fecha
  loading = false;
  error: string | null = null;
  isAdmin = false; // ¡Nueva propiedad!

  // Un mapeo para mostrar los nombres de las categorías de forma legible
  // menuCategoryNames = {
  //   [MenuCategory.Clasica]: 'Clásica',
  //   [MenuCategory.Express]: 'Express',
  //   [MenuCategory.Veggie]: 'Veggie',
  //   [MenuCategory.Especial]: 'Especial'
  // };

  constructor(private menuService: MenuService, private authService: AuthService){ // ¡Inyecta AuthService!) {
    // Inicializa la fecha con la fecha actual en formato YYYY-MM-DD
    this.selectedDate = new Date().toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.loadDailyMenu();
    // Verifica el rol del usuario al inicializar el componente
    this.isAdmin = this.authService.getUserRole() === 'Admin';
  }

  loadDailyMenu(): void {
    if (!this.selectedDate) {
      this.error = 'Por favor, selecciona una fecha.';
      return;
    }

    this.loading = true;
    this.error = null;
    this.menuService.getDailyMenuByDate(this.selectedDate).subscribe({
      next: (data) => {
        this.dailyMenu = data;
        this.loading = false;
        console.log('Menú diario cargado:', data);
      },
      error: (err) => {
        console.error('Error al cargar el menú diario:', err);
        this.error = 'No se pudo cargar el menú diario. Asegúrate de que la fecha existe o revisa los permisos.';
        this.loading = false;
        this.dailyMenu = null; // Limpiar el menú si hay un error

        // Verifica si es un 404 con un mensaje específico de "no encontrado"
        if (err.status === 404 && typeof err.error === 'string' && err.error.includes('No se encontró menú para la fecha')) {
          this.error = `No se encontró un menú para la fecha ${this.selectedDate}.`;
          // O incluso podrías mostrar el mensaje literal del backend:
          // this.error = err.error;
        } else if (err.status === 401 || err.status === 403) {
          this.error = 'No tienes permisos para ver este menú. Inicia sesión o verifica tus roles.';
        } else {
          this.error = 'Ocurrió un error inesperado al cargar el menú. Inténtalo de nuevo más tarde.';
        }
      }
    });
  }

  // Método para obtener el nombre de la categoría a partir de su valor numérico
  // getCategoryName(category: MenuCategory): string {
  //   return this.menuCategoryNames[category] || 'Desconocida';
  // }

  // TODO: Métodos para ir a la edición de un menú o eliminarlo
  // (cuando tengamos los componentes y endpoints de edición/eliminación)
  // editMenu(menu: Menu): void {
  //   console.log('Editar menú:', menu);
  //   // Implementar navegación a componente de edición con el ID del menú
  // }

  // deleteMenu(menuId: number): void {
  //   console.log('Eliminar menú:', menuId);
  //   // Implementar llamada al servicio para eliminar el menú
  // }
}