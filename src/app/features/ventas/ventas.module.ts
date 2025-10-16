import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { VentasRoutingModule } from './ventas-routing.module';


@NgModule({
  declarations: [
   //VentaListComponent,
    //VentaFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    VentasRoutingModule
  ]
})
export class VentasModule { }


