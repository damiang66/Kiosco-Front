import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductoService } from '../../../productos/services/producto.service';
import { VentaService } from '../../services/venta.service';

@Component({
  selector: 'app-venta-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgbModule],
  templateUrl: './venta-form.component.html',
})
export class VentaFormComponent implements OnInit {
  @ViewChild('modalProductos') modalProductos!: TemplateRef<any>;

  venta: any = { fecha: new Date().toISOString().split('T')[0], detalles: [] };
  productos: any[] = [];
  productosFiltrados: any[] = [];
  terminoBusqueda: string = '';
  productoSeleccionado: any = null;
  cantidad: number = 1;
  idVenta: number | null = null;

  constructor(
    private ventaService: VentaService,
    private productoService: ProductoService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.productoService.getAll().subscribe(data => {
      this.productos = data;
      this.productosFiltrados = data;
    });

    this.idVenta = this.route.snapshot.params['id'];
    if (this.idVenta) {
      this.ventaService.getVentaById(this.idVenta).subscribe((data) => (this.venta = data));
    }
  }

  abrirModal() {
    this.modalService.open(this.modalProductos, { size: 'lg' });
  }

  buscarProducto() {
    const termino = this.terminoBusqueda.toLowerCase();
    this.productosFiltrados = this.productos.filter(
      (p) =>
        p.descripcion.toLowerCase().includes(termino) ||
        p.codigo.toString().includes(termino)
    );
  }

  seleccionarProducto(producto: any, modal: any) {
    this.productoSeleccionado = producto;
    modal.close();
    Swal.fire({
      title: 'Cantidad',
      input: 'number',
      inputLabel: `Ingrese cantidad para "${producto.descripcion}"`,
      inputAttributes: { min: '1' },
      showCancelButton: true,
      confirmButtonText: 'Agregar',
    }).then((result) => {
      if (result.isConfirmed && result.value > 0) {
        this.agregarProducto(producto, result.value);
      }
    });
  }

  agregarProducto(producto: any, cantidad: number) {
    const detalle = {
      producto,
      cantidad,
      precioUnitario: producto.precioVenta,
      subtotal: cantidad * producto.precioVenta,
    };
    console.log(detalle);
    
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

/// ver el tema del vuelto





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

