// src/app/features/reports/reports.component.ts
import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../services/reports';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para ngModel


@Component({
  selector: 'app-reports',
  imports: [CommonModule, FormsModule], // Importa FormsModule para los inputs
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  startDate: string;
  endDate: string;
  loading = false;
  errorMessage = '';

  weeklySummaryData: any[] = [];
  totalQuantitiesData: any[] = [];

  constructor(private reportsService: ReportsService) {
    // Inicializar con la semana actual
    const today = new Date();
    const monday = new Date(today.setDate(today.getDate() - today.getDay() + 1));
    const sunday = new Date(today.setDate(today.getDate() - today.getDay() + 7));
    this.startDate = monday.toISOString().substring(0, 10);
    this.endDate = sunday.toISOString().substring(0, 10);
  }

  ngOnInit(): void {
    // Al iniciar el componente, carga los reportes de la semana actual por defecto.
    this.loadReports();
  }

  loadReports(): void {
    this.loading = true;
    this.errorMessage = '';
    this.weeklySummaryData = [];
    this.totalQuantitiesData = [];

    // Cargar el resumen semanal
    this.reportsService.getWeeklyMenuSummary(this.startDate, this.endDate).subscribe({
      next: (data) => this.weeklySummaryData = data,
      error: (err) => {
        this.errorMessage = 'Error al cargar el resumen semanal.';
        console.error('Error al obtener resumen semanal:', err);
      }
    });

    // Cargar las cantidades totales
    this.reportsService.getTotalMenuQuantities(this.startDate, this.endDate).subscribe({
      next: (data) => {
        this.totalQuantitiesData = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar las cantidades totales.';
        this.loading = false;
        console.error('Error al obtener cantidades totales:', err);
      }
    });
  }

  downloadReport(reportType: 'weekly' | 'total'): void {
    this.loading = true;
    this.errorMessage = '';

    const downloadObs = reportType === 'weekly'
      ? this.reportsService.downloadWeeklyMenuSummaryExcel(this.startDate, this.endDate)
      : this.reportsService.downloadTotalMenuQuantitiesExcel(this.startDate, this.endDate);

    downloadObs.subscribe({
      next: (data: Blob) => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(data);
        a.href = objectUrl;
        a.download = reportType === 'weekly' ? 'resumen_semanal.xlsx' : 'cantidades_totales.xlsx';
        a.click();
        URL.revokeObjectURL(objectUrl);
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al descargar el archivo.';
        this.loading = false;
        console.error('Error al descargar el reporte:', err);
      }
    });
  }

  // ... (dentro de la clase ReportsComponent) ...

  getCategories(categories: any): string[] {
    if (!categories) {
      return [];
    }
    return Object.keys(categories);
  }
}