import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VentaListComponent } from './components/venta-list/venta-list.component';
import { VentaFormComponent } from './components/venta-form/venta-form.component';


const routes: Routes = [
  { path: '', component: VentaListComponent },
  { path: 'nuevo', component: VentaFormComponent },
  { path: 'editar/:id', component: VentaFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VentasRoutingModule {}

