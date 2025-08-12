// src/app/features/menu-management/menu-form/menu-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para ngModel
import { ActivatedRoute, Router } from '@angular/router'; // Para obtener parámetros de ruta y navegar
import { MenuService } from '../../../services/menu';
import { Menu } from '../../../models/menu.model'; // Importa la interfaz Menu
import { HttpErrorResponse } from '@angular/common/http'; // Para manejo de errores HTTP

@Component({
  selector: 'app-menu-form',
  standalone: true,
  imports: [CommonModule, FormsModule], // Asegúrate de incluir FormsModule
  templateUrl: './menu-form.component.html',
  styleUrls: ['./menu-form.component.scss']
})
export class MenuFormComponent implements OnInit {
  menu: Menu = { id: 0, name: '', category: '' }; // Objeto menú para el formulario
  isEditMode = false; // Bandera para saber si estamos editando o creando
  errorMessage: string | null = null; // Para mostrar errores de la API

  // Las categorías deben coincidir con lo que tu backend espera como string
  categories: string[] = ['Clásica', 'Express', 'Veggie', 'Especial'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private menuService: MenuService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); // Obtener el ID de la URL si existe

    if (id) {
      this.isEditMode = true;
      // ¡Aquí llamamos a getMenuById para precargar los datos!
      this.menuService.getMenuById(+id).subscribe({
        next: (menuData) => {
          this.menu = menuData; // Asigna los datos del menú al formulario
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error al cargar menú para edición:', err);
          if (err.status === 404 && typeof err.error === 'string') {
            this.errorMessage = err.error; // Mostrar el mensaje del backend si es un 404
          } else if (err.status === 401 || err.status === 403) {
            this.errorMessage = 'No tienes permisos para editar este menú.';
          } else {
            this.errorMessage = 'Ocurrió un error al cargar el menú para edición.';
          }
          // Opcional: Redirigir si el menú no existe
          // setTimeout(() => {
          //   this.router.navigate(['/menus']);
          // }, 3000);
        }
      });
    }
  }

  saveMenu(): void {
    this.errorMessage = null; // Limpiar errores anteriores

    if (this.isEditMode) {
      // Lógica para ACTUALIZAR un menú existente (PUT)
      this.menuService.updateMenu(this.menu).subscribe({
        next: () => {
          console.log('Menú actualizado exitosamente:', this.menu);
          this.router.navigate(['/menus']); // Volver a la lista de menús
        },
        error: (err) => {
          console.error('Error al actualizar el menú:', err);
          this.errorMessage = 'No se pudo actualizar el menú. Verifica los datos.';
        }
      });
    } else {
      // Lógica para CREAR un nuevo menú (POST)
      this.menuService.createMenu(this.menu).subscribe({
        next: () => {
          console.log('Menú creado exitosamente:', this.menu);
          this.router.navigate(['/menus']); // Volver a la lista de menús
        },
        error: (err) => {
          console.error('Error al crear el menú:', err);
          this.errorMessage = 'No se pudo crear el menú. Verifica los datos.';
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/menus']); // Volver a la lista de menús sin guardar
  }
}
