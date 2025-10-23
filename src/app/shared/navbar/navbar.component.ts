import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LowStockService } from '../../features/productos/services/low-stock.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  downloading = false;
  constructor(private lowStock: LowStockService) {}

  async generarResumen() {
    try {
      this.downloading = true;
      const res = await this.lowStock.generarResumenYDescargar(10);
      // opcional: mostrar notificación simple por consola
      console.info(`Resumen generado: ${res.fileName}, productos: ${res.count}`);
    } catch (err) {
      console.error('Error al generar resumen de bajo stock', err);
    } finally {
      this.downloading = false;
    }
  }
}
