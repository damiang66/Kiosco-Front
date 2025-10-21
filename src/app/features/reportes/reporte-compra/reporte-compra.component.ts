import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-reporte-compra',
  imports: [CommonModule,FormsModule],
  templateUrl: './reporte-compra.component.html',
  styleUrl: './reporte-compra.component.css'
})
export class ReporteCompraComponent {
fechaInicio: string = '';
  fechaFin: string = '';
  compras: any[] = [];
  total: number = 0;
  apiUrl = 'http://localhost:8080/api/compras';

  constructor(private http: HttpClient) {}

  buscar() {
    if (!this.fechaInicio || !this.fechaFin) return;
    const url = `${this.apiUrl}/entre-fechas?inicio=${this.fechaInicio}&fin=${this.fechaFin}`;
    this.http.get<any[]>(url).subscribe((data) => {
      this.compras = data;
      this.total = this.compras.reduce((acc, c) => acc + (c.total || 0), 0);
    });
  }
}
