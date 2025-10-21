import { Injectable } from '@angular/core';
import { ProductoService } from './producto.service';
import { Producto } from '../../modelos/producto';

@Injectable({
  providedIn: 'root'
})
export class LowStockService {
  constructor(private productoService: ProductoService) {}

  /**
   * Obtiene productos con cantidad menor o igual a `threshold`.
   */
  async obtenerBajoStock(threshold = 10): Promise<Producto[]> {
    return new Promise((resolve, reject) => {
      this.productoService.getAll().subscribe({
        next: (productos) => {
          const bajos = productos.filter(p => p.cantidad <= threshold);
          resolve(bajos);
        },
        error: (err) => reject(err)
      });
    });
  }

  /**
   * Genera un archivo .txt con el resumen de productos de bajo stock y dispara la descarga.
   */
  async generarResumenYDescargar(threshold = 10) {
    const bajos = await this.obtenerBajoStock(threshold);
    const fecha = new Date().toLocaleString();
    let contenido = `Resumen de productos con stock <= ${threshold}\r\nFecha: ${fecha}\r\n\r\n`;
    if (bajos.length === 0) {
      contenido += 'No hay productos con stock bajo.';
    } else {
      contenido += 'ID\tCodigo\tDescripcion\tCantidad\tPrecioCompra\r\n';
      for (const p of bajos) {
        contenido += `${p.id ?? ''}\t${p.codigo}\t${p.descripcion}\t${p.cantidad}\t${p.precioCompra}\r\n`;
      }
    }

    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    a.download = `bajo-stock-${ts}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    return { fileName: a.download, count: bajos.length };
  }
}
