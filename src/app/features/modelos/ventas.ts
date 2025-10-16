import { VentaDetalle } from "./ventaDetalle";

export interface Ventas {
  id?: number;
  numeroFactura: String;
  fecha: Date;
  cliente: String;
  total: number;
  detalles:VentaDetalle[];
}