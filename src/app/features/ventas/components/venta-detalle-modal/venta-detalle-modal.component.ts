import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ventas } from '../../../modelos/ventas';

@Component({
  selector: 'app-venta-detalle-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './venta-detalle-modal.component.html',
  styleUrls: ['./venta-detalle-modal.component.css']
})
export class VentaDetalleModalComponent {
  @Input() venta: Ventas | null = null; // Venta seleccionada
  @Input() visible = false;             // Controla si se muestra el modal
  @Output() close = new EventEmitter<void>(); // Evento para cerrar

  cerrar() {
    this.close.emit();
    console.log(this.venta);
    
  }
}
