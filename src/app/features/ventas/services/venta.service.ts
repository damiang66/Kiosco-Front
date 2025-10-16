import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private baseUrl = 'http://localhost:8080/ventas';

  constructor(private http: HttpClient) {}

  getVentas(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getVentaById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  crearVenta(venta: any): Observable<any> {
    return this.http.post(this.baseUrl, venta);
  }

  actualizarVenta(id: number, venta: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, venta);
  }

  eliminarVenta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

