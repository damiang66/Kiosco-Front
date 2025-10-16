import { Routes } from '@angular/router';
import { ProductoListComponent } from './features/productos/components/producto-list/producto-list.component';
import { ProductoFormComponent } from './features/productos/components/producto-form/producto-form.component';
import { CompraListComponent } from './features/compra/compra-list/compra-list.component';
import { CompraFormComponent } from './features/compra/compra-form/compra-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'productos', pathMatch: 'full' },
  { path: 'productos', component: ProductoListComponent },
  { path: 'productos/nuevo', component: ProductoFormComponent },
  { path: 'productos/editar/:id', component: ProductoFormComponent },
  { path: 'compras', component: CompraListComponent },
  { path: 'compras/nueva', component: CompraFormComponent },
  { path: '**', redirectTo: 'productos' },
];


