// src/app/services/reports.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private apiUrl = '/api/Reports'; // Asegúrate de que esta URL sea la correcta

  constructor(private http: HttpClient) { }

  getWeeklyMenuSummary(startDate: string, endDate: string): Observable<any[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<any[]>(`${this.apiUrl}/weekly-menu-summary-json`, { params });
  }

  getTotalMenuQuantities(startDate: string, endDate: string): Observable<any[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<any[]>(`${this.apiUrl}/total-menu-quantities-json`, { params });
  }

  downloadWeeklyMenuSummaryExcel(startDate: string, endDate: string): Observable<Blob> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get(`${this.apiUrl}/weekly-menu-summary-excel`, { params, responseType: 'blob' });
  }

  downloadTotalMenuQuantitiesExcel(startDate: string, endDate: string): Observable<Blob> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get(`${this.apiUrl}/total-menu-quantities-excel`, { params, responseType: 'blob' });
  }
}