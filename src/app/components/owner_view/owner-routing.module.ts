import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CurrentOrdersComponent } from './current-orders/current-orders.component';
import { PendingOrdersComponent } from './pending-orders/pending-orders.component';
import { OrdersHistoryComponent } from './orders-history/orders-history.component';

const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent,
    children: [
      { path: 'pending-orders', component: PendingOrdersComponent},
      { path: 'orders-history', component: OrdersHistoryComponent},
      { path: 'current-orders',  component: CurrentOrdersComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OwnerRoutingModule { }
