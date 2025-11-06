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
  @ViewChild('modalPago') modalPago!: TemplateRef<any>;

  venta: any = { fecha: new Date().toISOString().split('T')[0], detalles: [], total: 0 };
  productos: any[] = [];
  productosFiltrados: any[] = [];
  terminoBusqueda: string = '';
  productoSeleccionado: any = null;
  cantidad: number = 1;
  idVenta: number | null = null;

  montoCliente: number = 0;
  vuelto: number = 0;

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
      this.ventaService.getVentaById(this.idVenta).subscribe((data) => {
        this.venta = data;

        if (!this.venta.total) this.calcularTotal();
      });
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
        this.agregarProducto(producto, Number(result.value));
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

  abrirModalPago() {
    if (!this.venta.detalles || this.venta.detalles.length === 0) {
      Swal.fire('Atención', 'Debe agregar al menos un producto.', 'warning');
      return;
    }

    this.montoCliente = 0;
    this.vuelto = 0;

    this.modalService.open(this.modalPago, { centered: true, backdrop: 'static' });
  }


  calcularVuelto() {
    const monto = Number(this.montoCliente || 0);
    const total = Number(this.venta.total || 0);
    this.vuelto = parseFloat((monto - total).toFixed(2)); 
  }


  guardarVentaDesdeModal(modalRef: any) {
    const total = Number(this.venta.total || 0);
    const monto = Number(this.montoCliente || 0);

    if (monto < total) {
      Swal.fire('Monto insuficiente', 'El monto ingresado no cubre el total.', 'error');
      return;
    }


    this.venta.montoEntregado = monto;
    this.venta.vuelto = parseFloat((monto - total).toFixed(2));


    if (this.idVenta) {
      this.ventaService.actualizarVenta(this.idVenta, this.venta).subscribe({
        next: (resp) => {
  
          modalRef.close();
          Swal.fire({
            icon: 'success',
            title: 'Venta actualizada',
            html: `Venta actualizada correctamente.<br><b>Vuelto a entregar:</b> ${this.formatoCurrency(this.venta.vuelto)}`,
          }).then(() => this.router.navigate(['/ventas']));
        },
        error: (err) => {
          Swal.fire('Error', 'No se pudo actualizar la venta', 'error');
        },
      });
    } else {
      this.ventaService.crearVenta(this.venta).subscribe({
        next: (resp) => {
          modalRef.close();
          Swal.fire({
            icon: 'success',
            title: 'Venta creada',
            html: `Venta creada correctamente.<br><b>Vuelto a entregar:</b> ${this.formatoCurrency(this.venta.vuelto)}`,
          }).then(() => this.router.navigate(['/ventas']));
        },
        error: (err) => {
          Swal.fire('Error', 'No se pudo crear la venta', 'error');
        },
      });
    }
  }


  formatoCurrency(valor: number) {
    return valor.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
  }


  guardarVenta() {
    console.log('Usar el modal de pago para guardar la venta.');
    this.abrirModalPago();
  }
}