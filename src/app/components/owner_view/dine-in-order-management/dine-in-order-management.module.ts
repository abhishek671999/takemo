import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DineInOrderManagementRoutingModule } from './dine-in-order-management-routing.module';
import { HomeComponent } from './home/home.component';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    DineInOrderManagementRoutingModule
  ]
})
export class DineInOrderManagementModule { }
