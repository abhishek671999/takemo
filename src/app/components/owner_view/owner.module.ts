import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OwnerRoutingModule } from './owner-routing.module';
import { HomeComponent } from './home/home.component';
import { CurrentOrdersComponent } from './current-orders/current-orders.component';
import { PendingOrdersComponent } from './pending-orders/pending-orders.component';
import { OrdersHistoryComponent } from './orders-history/orders-history.component';
import {MatTabsModule} from '@angular/material/tabs';
import { DeliveryOrderDialogComponent } from './delivery-order-dialog/delivery-order-dialog.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { OrdersHomeComponent } from './orders-home/orders-home.component';
import { SharedModuleModule } from 'src/app/shared/shared-module/shared-module.module';


@NgModule({
  declarations: [
    HomeComponent,
    PendingOrdersComponent,
    OrdersHistoryComponent,
    DeliveryOrderDialogComponent,
    CurrentOrdersComponent,
    OrdersHomeComponent
  ],
  imports: [
    CommonModule,
    OwnerRoutingModule,
    MatTabsModule,
    ScrollingModule,
    MatDialogModule,
    MatSelectModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    SharedModuleModule
  ],
  exports: [
    
  ]
})
export class OwnerModule { }
