// src/app/features/user-selection/user-selection.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserSelectionRequest, UserSelectionResponse } from '../../models/user-selection.model';
import { UserSelectionSummary } from '../../models/user-selection-summary.model';

@Injectable({
  providedIn: 'root'
})
export class UserSelectionService {
  private apiUrl = '/api/UserSelection'; // Coincide con la ruta base de tu controlador UserSelection

  constructor(private http: HttpClient) { }

  // Método para crear una nueva selección de usuario (POST /api/UserSelection)
  createUserSelection(selection: UserSelectionRequest): Observable<UserSelectionResponse> {
    return this.http.post<UserSelectionResponse>(this.apiUrl, selection);
  }

  // NUEVO MÉTODO: Verificar si el usuario ya tiene una selección para una fecha dada
  // Asumimos que tu backend tiene un endpoint para esto.
  // Podría ser /api/UserSelection/countForDate?userId=...&date=...
  // o /api/UserSelection/userSelectionsForDate?userId=...&date=...
  // O incluso un filtro en GET /api/UserSelection
  userHasSelectionForDate(userId: number, date: string): Observable<boolean> {
    // ESTA URL ES UN EJEMPLO. DEBE COINCIDIR CON TU ENDPOINT REAL EN EL BACKEND
    // Si tu backend tiene un endpoint que devuelve un booleano:
    //console.log('Verificando si el usuario tiene una selección para la fecha:', userId, date);
    let params = new HttpParams()
      .set('userId', userId.toString())
      .set('date', date);
    return this.http.get<boolean>(`${this.apiUrl}/userHasSelectionForDate`, { params: params });
  }
    // ALTERNATIVA: Si tu backend devuelve una lista de selecciones y verificas el count > 0:
    // return this.http.get<UserSelectionResponse[]>(`${this.apiUrl}/some-endpoint-that-lists-user-selections`, { params: params })
    //   .pipe(
    //     map(selections => selections && selections.length > 0)
    //   );

  // Otros métodos que añadirás más tarde para los demás endpoints de UserSelection:
  // getUserSelectionById(id: number): Observable<UserSelectionResponse> {
  //   return this.http.get<UserSelectionResponse>(`<span class="math-inline">\{this\.apiUrl\}/</span>{id}`);
  // }

  cancelUserSelection(selectionId: number, userId: number): Observable<any> {
    const params = new HttpParams().set('userId', userId.toString());

    return this.http.put(`${this.apiUrl}/cancel/${selectionId}`, null, { params, 
      responseType: 'text' // <-- ¡Añade esta línea!
     });
  }

  getUserSelectionsSummary(userId: number, startDate: string): Observable<UserSelectionSummary[]> {
    const params = new HttpParams()
      .set('startDate', startDate);

    return this.http.get<UserSelectionSummary[]>(`${this.apiUrl}/summary/user/${userId}`, { params });
  }

  // getDailySelectionsSummary(): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}/summary/daily`);
  // }

  // getTotalSelectionsSummary(): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}/summary/total`);
  // }

  
}