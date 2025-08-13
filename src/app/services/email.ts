// src/app/services/email.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = '/api/Email'; // Ajusta la URL de tu backend

  constructor(private http: HttpClient) { }

  sendCustomEmail(emailData: any): Observable<any> {
    // Agrega { responseType: 'text' } para que Angular no intente analizar la respuesta como JSON
    return this.http.post(`${this.apiUrl}/send-custom`, emailData, { responseType: 'text' });
  }
}