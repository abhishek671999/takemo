import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersHomeComponent } from '../orders-home/orders-home.component';
import { PendingOrdersComponent } from '../pending-orders/pending-orders.component';
import { OrdersHistoryComponent } from '../orders-history/orders-history.component';
import { CurrentOrdersComponent } from '../current-orders/current-orders.component';
import { CancelledOrdersComponent } from '../cancelled-orders/cancelled-orders.component';
import { UnconfirmedOrdersComponent } from '../unconfirmed-orders/unconfirmed-orders.component';
import { ConfirmedOrdersComponent } from '../confirmed-orders/confirmed-orders.component';
import { DeliveredOrdersComponent } from '../delivered-orders/delivered-orders.component';
import { RejectedOrdersComponent } from '../rejected-orders/rejected-orders.component';

const routes: Routes = [
  {
    path: '',
    component: OrdersHomeComponent,
    children: [
      { path: 'pending-orders', component: PendingOrdersComponent },
      { path: 'orders-history', component: OrdersHistoryComponent },
      { path: 'current-orders', component: CurrentOrdersComponent },
      { path: 'cancelled-orders', component: CancelledOrdersComponent },
      { path: 'unconfirmed-orders', component: UnconfirmedOrdersComponent },
      { path: 'confirmed-orders', component: ConfirmedOrdersComponent },
      { path: 'delivered-orders', component: DeliveredOrdersComponent },
      { path: 'rejected-orders', component: RejectedOrdersComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersManagementRoutingModule {}
