import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CurrentOrdersComponent } from './current-orders/current-orders.component';
import { PendingOrdersComponent } from './pending-orders/pending-orders.component';
import { OrdersHistoryComponent } from './orders-history/orders-history.component';
import { EditMenuComponent } from './restaurant_management/edit-menu/edit-menu.component';
import { OrdersHomeComponent } from './orders-home/orders-home.component';
import { CancelledOrdersComponent } from './cancelled-orders/cancelled-orders.component';
import { PointOfSaleComponent } from './point-of-sale/point-of-sale.component';
import { UnconfirmedOrdersComponent } from './unconfirmed-orders/unconfirmed-orders.component';
import { ConfirmedOrdersComponent } from './confirmed-orders/confirmed-orders.component';
import { DeliveredOrdersComponent } from './delivered-orders/delivered-orders.component';
import { RejectedOrdersComponent } from './rejected-orders/rejected-orders.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: OrdersHomeComponent,
        children: [
          { path: 'pending-orders', component: PendingOrdersComponent },
          { path: 'orders-history', component: OrdersHistoryComponent },
          { path: 'current-orders', component: CurrentOrdersComponent },
          { path: 'cancelled-orders', component: CancelledOrdersComponent },
          { path: 'unconfirmed-orders', component: UnconfirmedOrdersComponent},
          { path: 'confirmed-orders', component: ConfirmedOrdersComponent},
          { path: 'delivered-orders', component: DeliveredOrdersComponent},
          { path: 'rejected-orders', component: RejectedOrdersComponent}
        ],
      },
      { path: 'point-of-sale', component: PointOfSaleComponent },
      {
        path: 'edit-menu/:id',
        component: EditMenuComponent,
      },
      {
        path: 'settings',
        children : [
          { path: '', loadChildren: ()=> import('./restaurant_management/restaurant-management.module').then(m=>m.RestaurantManagementModule)},
          
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
