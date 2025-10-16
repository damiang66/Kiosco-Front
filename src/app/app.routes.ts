import { Routes } from '@angular/router';
import { ProductoListComponent } from './features/productos/components/producto-list/producto-list.component';
import { ProductoFormComponent } from './features/productos/components/producto-form/producto-form.component';
import { CompraListComponent } from './features/compra/compra-list/compra-list.component';
import { CompraFormComponent } from './features/compra/compra-form/compra-form.component';
import { VentaListComponent } from './features/ventas/components/venta-list/venta-list.component';
import { VentaFormComponent } from './features/ventas/components/venta-form/venta-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'productos', pathMatch: 'full' },
  { path: 'productos', component: ProductoListComponent },
  { path: 'productos/nuevo', component: ProductoFormComponent },
  { path: 'productos/editar/:id', component: ProductoFormComponent },
  { path: 'compras', component: CompraListComponent },
  { path: 'compras/nueva', component: CompraFormComponent },
  { path: 'compras/editar/:id', component: CompraFormComponent },
  { path: 'ventas', component: VentaListComponent },
  { path: 'ventas/nuevo', component: VentaFormComponent },
  { path: 'ventas/editar/:id', component: VentaFormComponent },
  { path: '**', redirectTo: 'productos' },
];


