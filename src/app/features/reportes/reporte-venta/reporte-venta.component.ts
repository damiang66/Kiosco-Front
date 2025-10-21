import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reporte-venta',
  imports: [CommonModule,FormsModule],
  templateUrl: './reporte-venta.component.html',
  styleUrl: './reporte-venta.component.css'
})
export class ReporteVentaComponent {
fechaInicio: string = '';
  fechaFin: string = '';
  ventas: any[] = [];
  total: number = 0;
  apiUrl = 'http://localhost:8080/ventas';

  constructor(private http: HttpClient) {}

  buscar() {
    if (!this.fechaInicio || !this.fechaFin) return;
    const url = `${this.apiUrl}/entre-fechas?inicio=${this.fechaInicio}&fin=${this.fechaFin}`;
    this.http.get<any[]>(url).subscribe((data) => {
      this.ventas = data;
      this.total = this.ventas.reduce((acc, v) => acc + (v.total || 0), 0);
    });
  }
}
