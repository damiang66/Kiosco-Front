import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { VentaService } from '../../../services/venta.service';
import { ProductoService } from '../../productos/services/producto.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { log } from 'console';



@Component({
  selector: 'app-venta-form',
    standalone: true,
    imports: [CommonModule, FormsModule],
  templateUrl: './venta-form.component.html',
  styleUrls: ['./venta-form.component.css']
})
export class VentaFormComponent implements OnInit {

  venta: any = { cliente: '', numeroFactura: '', detalles: [] };
  productos: any[] = [];
  productoSeleccionado: any = null;
  cantidad: number = 1;
  idVenta: number | null = null;

  constructor(
    private ventaService: VentaService,
    private ProductoService: ProductoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.ProductoService.getAll().subscribe(data => this.productos = data);
    this.idVenta = this.route.snapshot.params['id'];
    if (this.idVenta) {
      this.ventaService.getVentaById(this.idVenta).subscribe((data) => (this.venta = data));
    }
  }

  agregarProducto() {
    if (!this.productoSeleccionado || this.cantidad <= 0) return;

    const detalle = {
      producto: this.productoSeleccionado,
      cantidad: this.cantidad,
      precioUnitario: this.productoSeleccionado.precioVenta,
      subtotal: this.cantidad * this.productoSeleccionado.precioVenta,
    };

    this.venta.detalles.push(detalle);
    this.calcularTotal();
  }

  eliminarDetalle(index: number) {
    this.venta.detalles.splice(index, 1);
    this.calcularTotal();
  }

  calcularTotal() {
    this.venta.total = this.venta.detalles.reduce((acc: number, d: any) => acc + d.subtotal, 0);
  }

  guardarVenta() {
    console.log(this.venta);
    if (this.idVenta) {
      
      
      this.ventaService.actualizarVenta(this.idVenta, this.venta).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Venta actualizada correctamente', 'success');
          this.router.navigate(['/ventas']);
        },
        error: () => Swal.fire('Error', 'No se pudo actualizar la venta', 'error'),
      });
    } else {
      this.ventaService.crearVenta(this.venta).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Venta creada correctamente', 'success');
          this.router.navigate(['/ventas']);
        },
           
             
      
        error: () => Swal.fire('Error', 'No se pudo crear la venta', 'error'),
      });
    }
  }
}

