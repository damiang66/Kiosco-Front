import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../../services/producto.service';

import Swal from 'sweetalert2';
import { Producto } from '../../../modelos/producto';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.css']
})
export class ProductoFormComponent implements OnInit {
  producto: Producto = {
    codigo: 0,
    descripcion: '',
    cantidad: 0,
    precioCompra: 0,
    precioVenta: 0
  };

  editMode = false;

  constructor(
    private service: ProductoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.service.getById(+id).subscribe(p => this.producto = p);
    }
  }

  guardar() {
    if (this.editMode) {
      this.service.update(this.producto.id!, this.producto).subscribe(() => {
        Swal.fire('Actualizado', 'El producto se actualizó correctamente', 'success');
        this.router.navigate(['/productos']);
      });
    } else {
      this.service.create(this.producto).subscribe(() => {
        Swal.fire('Creado', 'El producto se creó correctamente', 'success');
        this.router.navigate(['/productos']);
      });
    }
  }
  cancelar(){
 this.router.navigate(['/productos']);
  }
}

