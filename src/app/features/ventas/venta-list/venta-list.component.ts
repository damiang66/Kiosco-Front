import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { VentaService } from '../../../services/venta.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-venta-list',
  standalone: true,
    imports: [CommonModule, FormsModule],
  templateUrl: './venta-list.component.html',
  styleUrls: ['./venta-list.component.css']
})
export class VentaListComponent implements OnInit {

  ventas: any[] = [];

  constructor(private ventaService: VentaService, private router: Router) {}

  ngOnInit(): void {
    this.cargarVentas();
  }

  cargarVentas() {
    this.ventaService.getVentas().subscribe({
      next: (data) => (this.ventas = data),
      error: () => Swal.fire('Error', 'No se pudieron cargar las ventas', 'error'),
    });
  }

  nuevaVenta() {
    this.router.navigate(['/ventas/nuevo']);
  }

  editarVenta(id: number) {
    this.router.navigate(['/ventas/editar', id]);
  }

  eliminarVenta(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la venta permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.ventaService.eliminarVenta(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'La venta fue eliminada', 'success');
            this.cargarVentas();
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar la venta', 'error'),
        });
      }
    });
  }
}

