import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cierre-caja',
  imports: [CommonModule,FormsModule],
  templateUrl: './cierre-caja.component.html',
  styleUrl: './cierre-caja.component.css'
})
export class CierreCajaComponent implements OnInit {
  ventas: any[] = [];
  total: number = 0;
  apiUrl = 'http://localhost:8080/api/caja';
  caja:number=0;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarVentas();
  }

  cargarVentas() {
    this.http.get<any[]>(`${this.apiUrl}/abiertas`).subscribe((data) => {
      this.ventas = data;
   this.ventas.forEach(v=>{
    this.caja=this.caja+ v.total
   })
    });
// este metodo no funciona
    this.http.get<number>(`${this.apiUrl}/total`).subscribe((data) => {
      this.total = data ?? 0;
    });
  }

  cerrarCaja() {
    Swal.fire({
      title: '¿Cerrar caja?',
      text: 'Esto marcará todas las ventas como cerradas.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.post(`${this.apiUrl}/cerrar`, {}).subscribe(() => {
          Swal.fire('Caja cerrada', 'Las ventas fueron cerradas correctamente', 'success');
          this.cargarVentas();
        });
      }
    });
  }
}