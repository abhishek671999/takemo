import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CurrentOrdersComponent } from './orders/current-orders/current-orders.component';
import { PendingOrdersComponent } from './orders/pending-orders/pending-orders.component';
import { OrdersHistoryComponent } from './orders/orders-history/orders-history.component';
import { EditMenuComponent } from './restaurant_management/edit-menu/edit-menu.component';
import { OrdersHomeComponent } from './orders/orders-home/orders-home.component';
import { CancelledOrdersComponent } from './orders/cancelled-orders/cancelled-orders.component';
import { PointOfSaleComponent } from './point-of-sale/point-of-sale.component';
import { UnconfirmedOrdersComponent } from './orders/unconfirmed-orders/unconfirmed-orders.component';
import { ConfirmedOrdersComponent } from './orders/confirmed-orders/confirmed-orders.component';
import { DeliveredOrdersComponent } from './orders/delivered-orders/delivered-orders.component';
import { RejectedOrdersComponent } from './orders/rejected-orders/rejected-orders.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'orders',
        children: [
          {
            path: '',
            loadChildren: () =>
              import(
                './orders/orders-management/orders-management.module'
              ).then((m) => m.OrdersManagementModule),
          },
        ],
      },
      { path: 'point-of-sale', component: PointOfSaleComponent },
      {
        path: 'edit-menu/:id',
        component: EditMenuComponent,
      },
      {
        path: 'settings',
        children: [
          {
            path: '',
            loadChildren: () =>
              import(
                './restaurant_management/restaurant-management.module'
              ).then((m) => m.RestaurantManagementModule),
          },
        ],
      },
      {
        path: 'expense',
        children: [
          {
            path: '',
            loadChildren: () => import('./expense-management/expense-management.module').then(m => m.ExpenseManagementModule)
          }
        ]
      },
      {
        path: 'dine-in',
        children: [
          {
            path: '',
            loadChildren: () => import('./dine-in-order-management/dine-in-order-management.module').then(m => m.DineInOrderManagementModule)
          }
        ]
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OwnerRoutingModule {}
