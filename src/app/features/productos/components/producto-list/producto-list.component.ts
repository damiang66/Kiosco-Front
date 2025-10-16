import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductoService } from '../../services/producto.service';

import Swal from 'sweetalert2';
import { Producto } from '../../../modelos/producto';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-producto-list',
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './producto-list.component.html',
  styleUrls: ['./producto-list.component.css']
})
export class ProductoListComponent implements OnInit {

  productos: Producto[] = [];
   productosFiltrados: Producto[] = [];
  filtroDescripcion: string = '';
  filtroCodigo: string = '';

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productoService.getAll().subscribe(data => this.productos = data);
    this.productoService.getAll().subscribe(data => this.productosFiltrados = data);
  }

  eliminar(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.productoService.delete(id).subscribe(() => {
          this.cargarProductos();
          Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success');
        });
      }
    });
  }
   filtrarProductos(): void {
    const desc = this.filtroDescripcion.toLowerCase();
    const cod = this.filtroCodigo.toString().toLowerCase();

    this.productosFiltrados = this.productos.filter((p) => {
      const coincideDescripcion = p.descripcion.toLowerCase().includes(desc);
      const coincideCodigo = cod ? p.codigo.toString().includes(cod) : true;
      return coincideDescripcion && coincideCodigo;
    });
  }
}

