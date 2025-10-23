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
  // markupOption: '30' | '40' | '50' | 'manual'
  markupOption: string = '30';
  manualPrecioVenta = false;

  constructor(
    private service: ProductoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.service.getById(+id).subscribe(p => {
        this.producto = p;
        // Detectar si el precioVenta corresponde a alguno de los markups o es manual
        this.detectMarkup();
      });
    }
    // si se crea nuevo, aplicar markup por defecto
    if (!this.editMode) {
      this.applyMarkup();
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

  onPrecioCompraChange(value: any) {
    // ngModelChange puede enviar string
    const v = Number(value) || 0;
    this.producto.precioCompra = v;
    if (!this.manualPrecioVenta) {
      this.applyMarkup();
    }
  }

  onMarkupChange(value: string) {
    if (value === 'manual') {
      this.manualPrecioVenta = true;
      this.markupOption = 'manual';
    } else {
      this.manualPrecioVenta = false;
      this.markupOption = value;
      this.applyMarkup();
    }
  }

  applyMarkup() {
    const compra = Number(this.producto.precioCompra) || 0;
    if (this.markupOption === 'manual') return;
    const percent = Number(this.markupOption) / 100;
    // redondear a 2 decimales
    this.producto.precioVenta = Number((compra * (1 + percent)).toFixed(2));
  }

  private detectMarkup() {
    const compra = Number(this.producto.precioCompra) || 0;
    const venta = Number(this.producto.precioVenta) || 0;
    const options = ['30', '40', '50'];
    const eps = 0.01; // tolerancia para comparar decimales
    let matched = false;
    for (const opt of options) {
      const percent = Number(opt) / 100;
      const expected = Number((compra * (1 + percent)).toFixed(2));
      if (Math.abs(expected - venta) <= eps) {
        this.markupOption = opt;
        this.manualPrecioVenta = false;
        matched = true;
        break;
      }
    }
    if (!matched) {
      // No coincide con ningún markup: dejar manual
      this.markupOption = 'manual';
      this.manualPrecioVenta = true;
    }
  }
}

