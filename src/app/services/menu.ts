// src/app/services/menu.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DailyMenu, Menu } from '../models/menu.model'; // <-- Importa tus interfaces

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = '/api/Menu'; // Tu base URL para los endpoints de menú

  constructor(private http: HttpClient) { }

  // GET /api/Menu/{date} - Obtener menús para una fecha específica
  getDailyMenuByDate(date: string): Observable<DailyMenu> {
    // Asegúrate de que el formato de la fecha coincida con lo que espera tu backend (ej. 'YYYY-MM-DD')
    //return this.http.get<DailyMenu>(`<span class="math-inline">\{this\.apiUrl\}/</span>{date}`);
    // GET /api/Menu/{date} - Obtener menús para una fecha específica
    // ¡IMPORTANTE! Asegúrate de usar backticks (`) para la interpolación
    // Y que la URL sea '<span class="math-inline">\{this\.apiUrl\}/</span>{date}'
    return this.http.get<DailyMenu>(`${this.apiUrl}/${date}`);
  }

  // POST /api/Menu - Crear un nuevo menú
  createMenu(menu: Menu): Observable<Menu> {
    // Al crear, probablemente no envíes el 'id' ni el 'dailyMenuId' inicial
    const menuToCreate = {
      name: menu.name,
      category: menu.category
      // Si dailyMenuId se asigna al crear el menú, inclúyelo aquí
      // dailyMenuId: menu.dailyMenuId
    };
    return this.http.post<Menu>(this.apiUrl, menuToCreate);
  }

  // TODO: Añadir métodos para PUT (actualizar) y DELETE (eliminar)
  // Si tienes endpoints para estas operaciones en el controlador 'Menu'
  // Por ahora, solo tenemos GET por fecha y POST para crear.

  // Ejemplo de cómo sería un GET para un menú por ID (si existiera el endpoint)
  getMenuById(id: number): Observable<Menu> {
    //return this.http.get<Menu>(`<span class="math-inline">\{this\.apiUrl\}/</span>{id}`);
    return this.http.get<Menu>(`${this.apiUrl}/${id}`);
  }

  // Ejemplo de cómo sería un PUT para actualizar un menú (si existiera el endpoint)
  updateMenu(menu: Menu): Observable<any> {
    return this.http.put<any>(`<span class="math-inline">\{this\.apiUrl\}/</span>{menu.id}`, menu);
  }

  // Ejemplo de cómo sería un DELETE para eliminar un menú (si existiera el endpoint)
  deleteMenu(id: number): Observable<any> {
    return this.http.delete<any>(`<span class="math-inline">\{this\.apiUrl\}/</span>{id}`);
  }

  // Nuevo método para subir un archivo de texto
  uploadMenusFromFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file); // 'file' debe coincidir con el nombre del parámetro esperado en tu backend ASP.NET Core (ej. IFormFile file)

    // El endpoint es POST /api/Menu/upload-text-file
    return this.http.post<any>(`${this.apiUrl}/upload-text-file`, formData);
  }
}