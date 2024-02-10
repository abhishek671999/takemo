import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OwnerRoutingModule } from './owner-routing.module';
import { HomeComponent } from './home/home.component';
import { CurrentOrdersComponent } from './current-orders/current-orders.component';
import { PendingOrdersComponent } from './pending-orders/pending-orders.component';
import { OrdersHistoryComponent } from './orders-history/orders-history.component';
import { MatTabsModule } from '@angular/material/tabs';
import { DeliveryOrderDialogComponent } from './delivery-order-dialog/delivery-order-dialog.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { OrdersHomeComponent } from './orders-home/orders-home.component';
import { SharedModuleModule } from 'src/app/shared/shared-module/shared-module.module';
import { ConfirmOrderCancelComponent } from './confirm-order-cancel/confirm-order-cancel.component';
import { CancelledOrdersComponent } from './cancelled-orders/cancelled-orders.component';
import { PointOfSaleComponent } from './point-of-sale/point-of-sale.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {JsonPipe} from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FoodCounterManagementComponent } from './restaurant_management/food-counter-management/food-counter-management.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { AddCounterDialogComponent } from './add-counter-dialog/add-counter-dialog.component';

@NgModule({
  declarations: [
    HomeComponent,
    PendingOrdersComponent,
    OrdersHistoryComponent,
    DeliveryOrderDialogComponent,
    CurrentOrdersComponent,
    OrdersHomeComponent,
    ConfirmOrderCancelComponent,
    CancelledOrdersComponent,
    PointOfSaleComponent,
    FoodCounterManagementComponent,
    AddCounterDialogComponent,
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
    SharedModuleModule,
    FormsModule,
    JsonPipe,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatCheckboxModule, 
    MatRadioModule,
    MatPaginatorModule,
    MatExpansionModule,
    FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule
  ],
  exports: [],
})
export class OwnerModule {}
