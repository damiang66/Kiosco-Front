import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CompraService } from '../compra.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-compra-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './compra-list.component.html',
})
export class CompraListComponent implements OnInit {
  compras: any[] = [];

  constructor(private compraService: CompraService, private router: Router) {}

  ngOnInit(): void {
    this.cargarCompras();
  }

  cargarCompras() {
    this.compraService.getAll().subscribe((data) => (this.compras = data));
  }

  nuevaCompra() {
    this.router.navigate(['/compras/nueva']);
  }

  eliminar(id: number) {
    Swal.fire({
      title: '¿Eliminar compra?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
    }).then((r) => {
      if (r.isConfirmed) {
        this.compraService.delete(id).subscribe(() => {
          Swal.fire('Eliminado', 'La compra fue eliminada', 'success');
          this.cargarCompras();
        });
      }
    });
  }
}
