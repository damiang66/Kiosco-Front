import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

import Swal from 'sweetalert2';
import { CompraService } from '../compra.service';
import { ProductoService } from '../../productos/services/producto.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-compra-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgbModule],
  templateUrl: './compra-form.component.html',
})
export class CompraFormComponent implements OnInit {
  compra: any = { fecha: new Date(), detalles: [], total: 0 };
  productos: any[] = [];
  productosFiltrados: any[] = [];
  productoSeleccionado: any = null;
  cantidad: number = 1;
  filtro: string = '';
  idCompra: number | null = null;

  constructor(
    private compraService: CompraService,
    private productoService: ProductoService,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.productoService.getAll().subscribe((data) => {
      this.productos = data;
      this.productosFiltrados = data;
    });

    this.idCompra = this.route.snapshot.params['id'];
    if (this.idCompra) {
      this.compraService.getById(this.idCompra).subscribe((data) => {
        this.compra = data;
      });
    }
  }

  // 🔍 Filtrado en el modal
  filtrarProductos() {
    const filtro = this.filtro.toLowerCase();
    this.productosFiltrados = this.productos.filter(
      (p) =>
        p.descripcion.toLowerCase().includes(filtro) ||
        p.codigo.toString().includes(filtro)
    );
  }

  abrirModal(content: any) {
    this.filtro = '';
    this.productosFiltrados = this.productos;
    this.modalService.open(content, { size: 'lg' });
  }

  seleccionarProducto(producto: any, modal: any) {
    this.productoSeleccionado = producto;
    modal.close();
  }

  agregarProducto() {
    if (!this.productoSeleccionado || this.cantidad <= 0) {
      Swal.fire('Error', 'Seleccione un producto y cantidad válida', 'warning');
      return;
    }

    const detalle = {
      producto: this.productoSeleccionado,
      cantidad: this.cantidad,
      precioUnitario: this.productoSeleccionado.precioCompra,
      subtotal: this.cantidad * this.productoSeleccionado.precioCompra,
    };

    this.compra.detalles.push(detalle);
    this.calcularTotal();
    this.productoSeleccionado = null;
    this.cantidad = 1;
  }

  eliminarDetalle(index: number) {
    this.compra.detalles.splice(index, 1);
    this.calcularTotal();
  }

  calcularTotal() {
    this.compra.total = this.compra.detalles.reduce(
      (acc: number, d: any) => acc + d.subtotal,
      0
    );
  }

  guardarCompra() {
    if (this.compra.detalles.length === 0) {
      Swal.fire('Error', 'Debe agregar al menos un producto', 'warning');
      return;
    }

    const request = this.idCompra
      ? this.compraService.actualizarCompra(this.idCompra, this.compra)
      : this.compraService.save(this.compra);

    request.subscribe({
      next: () => {
        Swal.fire(
          'Éxito',
          this.idCompra ? 'Compra actualizada' : 'Compra creada',
          'success'
        );
        this.router.navigate(['/compras']);
      },
      error: () => Swal.fire('Error', 'No se pudo guardar la compra', 'error'),
    });
  }
}
