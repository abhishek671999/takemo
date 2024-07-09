import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OwnerRoutingModule } from './owner-routing.module';
import { HomeComponent } from './home/home.component';
import { CurrentOrdersComponent } from './orders/current-orders/current-orders.component';
import { PendingOrdersComponent } from './orders/pending-orders/pending-orders.component';
import { OrdersHistoryComponent } from './orders/orders-history/orders-history.component';
import { MatTabsModule } from '@angular/material/tabs';
import { DeliveryOrderDialogComponent } from './dialogbox/delivery-order-dialog/delivery-order-dialog.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { OrdersHomeComponent } from './orders/orders-home/orders-home.component';
import { SharedModuleModule } from 'src/app/shared/shared-module/shared-module.module';
import { ConfirmOrderCancelComponent } from './dialogbox/confirm-order-cancel/confirm-order-cancel.component';
import { CancelledOrdersComponent } from './orders/cancelled-orders/cancelled-orders.component';
import { PointOfSaleComponent } from './point-of-sale/point-of-sale.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FoodCounterManagementComponent } from './restaurant_management/food-counter-management/food-counter-management.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { DeliverAllOrdersDialogComponent } from './dialogbox/deliver-all-orders-dialog/deliver-all-orders-dialog.component';
import { UnconfirmedOrdersComponent } from './orders/unconfirmed-orders/unconfirmed-orders.component';
import { ConfirmedOrdersComponent } from './orders/confirmed-orders/confirmed-orders.component';
import { DeliveredOrdersComponent } from './orders/delivered-orders/delivered-orders.component';
import { RejectedOrdersComponent } from './orders/rejected-orders/rejected-orders.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ExpensesComponent } from './expense-management/expenses/expenses.component';
import { VendorSettingsComponent } from './expense-management/vendor-settings/vendor-settings.component';
import { EcomPosOrdersComponent } from './dialogbox/ecom-pos-orders/ecom-pos-orders.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TableCockpitComponent } from './dine-in-order-management/table-cockpit/table-cockpit.component';
import { TableOrdersDialogComponent } from './dialogbox/table-orders-dialog/table-orders-dialog.component';
import { TableManagementComponent } from './restaurant_management/table-management/table-management.component';
import { UploadFormComponent } from '../shared/upload-form/upload-form.component';
import { AddItemDialogComponent } from './dialogbox/add-item-dialog/add-item-dialog.component';
import { AddPaymentDialogComponent } from './dialogbox/add-payment-dialog/add-payment-dialog.component';
import { AddExpenseDialogComponent } from './dialogbox/add-expense-dialog/add-expense-dialog.component';
import { EditExpenseDialogComponent } from './dialogbox/edit-expense-dialog/edit-expense-dialog.component';

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
    DeliverAllOrdersDialogComponent,
    UnconfirmedOrdersComponent,
    ConfirmedOrdersComponent,
    DeliveredOrdersComponent,
    RejectedOrdersComponent,
    ExpensesComponent,
    VendorSettingsComponent,
    EcomPosOrdersComponent,
    TableCockpitComponent,
    TableOrdersDialogComponent,
    TableManagementComponent,
    AddItemDialogComponent,
    AddPaymentDialogComponent,
    AddExpenseDialogComponent,
    EditExpenseDialogComponent,
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
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    PdfViewerModule,
    MatSnackBarModule,
    UploadFormComponent
  ],
  exports: [],
})
export class OwnerModule {}
