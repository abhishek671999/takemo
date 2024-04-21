import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RestaurantManagementRoutingModule } from './restaurant-management-routing.module';
import { ManagmentHomeComponent } from './managment-home/managment-home.component';
import { ActivityLogComponent } from './activity-log/activity-log.component';
import {  MatPaginatorModule } from '@angular/material/paginator';
import { TableManagementComponent } from './table-management/table-management.component';
import { MatInputModule } from '@angular/material/input';



@NgModule({
  declarations: [
    ManagmentHomeComponent,
    ActivityLogComponent,
  ],
  imports: [
    CommonModule,
    RestaurantManagementRoutingModule,
    MatPaginatorModule,
    MatInputModule
  ]
})
export class RestaurantManagementModule { }
