// src/app/features/menu-management/menu-upload/menu-upload.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para *ngIf
import { Router } from '@angular/router'; // Para navegar
import { MenuService } from '../../../services/menu'; // Nuestro servicio de menús
import { HttpErrorResponse } from '@angular/common/http'; // Para manejo de errores HTTP

@Component({
  selector: 'app-menu-upload',
  standalone: true,
  imports: [CommonModule], // Asegúrate de tener CommonModule
  templateUrl: './menu-upload.component.html',
  styleUrls: ['./menu-upload.component.scss']
})
export class MenuUploadComponent {
  selectedFile: File | null = null;
  selectedFileName: string = '';
  fileContent: string | null = null;
  errorMessage: string | null = null; // Mensajes de error del frontend (ej. tipo de archivo)
  apiErrorMessage: string | null = null; // Mensajes de error de la API
  successMessage: string | null = null; // Mensajes de éxito

  constructor(
    private menuService: MenuService,
    private router: Router
  ) { }

  onFileSelected(event: Event): void {
    this.selectedFile = null;
    this.selectedFileName = '';
    this.fileContent = null;
    this.errorMessage = null;
    this.apiErrorMessage = null;
    this.successMessage = null;

    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      // Validar tipo de archivo (opcional, pero buena práctica)
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        this.selectedFile = file;
        this.selectedFileName = file.name;
        this.readFileContent(file);
      } else {
        this.errorMessage = 'Por favor, selecciona un archivo de texto (.txt).';
        input.value = ''; // Limpiar el input para permitir seleccionar de nuevo
      }
    }
  }

  readFileContent(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.fileContent = reader.result as string;
    };
    reader.onerror = (e) => {
      console.error('Error al leer el archivo:', e);
      this.errorMessage = 'No se pudo leer el contenido del archivo.';
      this.fileContent = null;
    };
    reader.readAsText(file); // Lee el contenido del archivo como texto
  }

  uploadFile(): void {
    this.apiErrorMessage = null;
    this.successMessage = null;

    if (this.selectedFile) {
      this.menuService.uploadMenusFromFile(this.selectedFile).subscribe({
        next: (response) => {
          console.log('Archivo cargado exitosamente:', response);
          this.successMessage = response.message || 'Menús cargados exitosamente.';
          // Opcional: Redirigir a la lista de menús después de un éxito
          setTimeout(() => {
            this.router.navigate(['/menus']);
          }, 2000);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error al cargar el archivo:', err);
          // Asumiendo que el backend envía un mensaje de error en err.error.message o directamente en err.error
          if (err.error && typeof err.error === 'string') {
            this.apiErrorMessage = err.error; // Si el error es un string directo (ej. tu 404 del backend)
          } else if (err.error && err.error.message) {
            this.apiErrorMessage = err.error.message;
          } else {
            this.apiErrorMessage = 'Ocurrió un error al cargar los menús. Por favor, revisa el archivo y el servidor.';
          }
        }
      });
    } else {
      this.errorMessage = 'Por favor, selecciona un archivo primero.';
    }
  }

  goBack(): void {
    this.router.navigate(['/menus']); // Volver a la lista de menús
  }
}