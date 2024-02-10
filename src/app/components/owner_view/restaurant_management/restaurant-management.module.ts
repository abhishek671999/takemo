import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RestaurantManagementRoutingModule } from './restaurant-management-routing.module';
import { ManagmentHomeComponent } from './managment-home/managment-home.component';



@NgModule({
  declarations: [
    ManagmentHomeComponent
  ],
  imports: [
    CommonModule,
    RestaurantManagementRoutingModule,
  ]
})
export class RestaurantManagementModule { }
