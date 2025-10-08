import { Routes } from '@angular/router';
import { ProductoListComponent } from './features/productos/components/producto-list/producto-list.component';
import { ProductoFormComponent } from './features/productos/components/producto-form/producto-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/productos', pathMatch: 'full' },
  { path: 'productos', component: ProductoListComponent },
  { path: 'productos/nuevo', component: ProductoFormComponent },
  { path: 'productos/editar/:id', component: ProductoFormComponent },
  { path: '**', redirectTo: '/productos' }
];

