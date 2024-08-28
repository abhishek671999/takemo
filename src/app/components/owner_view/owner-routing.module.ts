import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EditMenuComponent } from './restaurant_management/edit-menu/edit-menu.component';
import { PointOfSaleComponent } from './point-of-sale/point-of-sale.component';

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
        path: 'edit-menu/',
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
