import { Producto } from "./producto";
import { Ventas } from "./ventas";

export interface VentaDetalle {
  id: number;
  producto: Producto;
  cantidad: string;
  precioUnitario: number;
  subTotal: number;
  venta:Ventas;
}
