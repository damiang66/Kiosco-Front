import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompraService } from '../compra.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductoService } from '../../productos/services/producto.service';


@Component({
  selector: 'app-compra-form',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './compra-form.component.html',
  
})
export class CompraFormComponent {
   compra: any = {fecha:Date, detalles: [] };
  productos: any[] = [];
  productoSeleccionado: any = null;
  cantidad: number = 1;
  idCompra: number | null = null;

  constructor(
    private CompraService: CompraService,
    private ProductoService: ProductoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.ProductoService.getAll().subscribe(data => this.productos = data);
    this.idCompra = this.route.snapshot.params['id'];
    if (this.idCompra) {
      this.CompraService.getById(this.idCompra).subscribe((data) => (this.compra = data));
    }
  }

  agregarProducto() {
    if (!this.productoSeleccionado || this.cantidad <= 0) return;

    const detalle = {
      producto: this.productoSeleccionado,
      cantidad: this.cantidad,
      precioUnitario: this.productoSeleccionado.precioCompra,
      subtotal: this.cantidad * this.productoSeleccionado.precioCompra,
    };

    this.compra.detalles.push(detalle);
    this.calcularTotal();
  }

  eliminarDetalle(index: number) {
    this.compra.detalles.splice(index, 1);
    this.calcularTotal();
  }

  calcularTotal() {
    this.compra.total = this.compra.detalles.reduce((acc: number, d: any) => acc + d.subtotal, 0);
  }

  guardarVenta() {
    console.log(this.compra);
    if (this.idCompra) {
      
      
      this.CompraService.actualizarCompra(this.idCompra, this.compra).subscribe({
        next: () => {
          Swal.fire('Éxito', 'compra actualizada correctamente', 'success');
          this.router.navigate(['/ventas']);
        },
        error: () => Swal.fire('Error', 'No se pudo actualizar la compra', 'error'),
      });
    } else {
      this.CompraService.save(this.compra).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Compra creada correctamente', 'success');
          this.router.navigate(['/ventas']);
        },
           
             
      
        error: () => Swal.fire('Error', 'No se pudo crear la compra', 'error'),
      });
    }
  }
}