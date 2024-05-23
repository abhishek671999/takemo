import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminLandingComponent } from './admin-landing/admin-landing.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { BillingComponent } from './billing/billing.component';
import { OrdersHomeComponent } from './orders-home/orders-home.component';
import { CurrentOrdersComponent } from './current-orders/current-orders.component';
import { DummyUploadImagesComponent } from './dummy-upload-images/dummy-upload-images.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'analytics',
        loadChildren: () =>
          import('./analytics/analytics.module').then((m) => m.AnalyticsModule),
      },
      { path: 'user-management', component: UserManagementComponent },
      { path: 'billing', component: BillingComponent },
      {
        path: 'orders',
        component: OrdersHomeComponent,
        children: [
          { path: '', component: CurrentOrdersComponent },
          { path: 'current-orders', component: CurrentOrdersComponent },
        ],
      },
    ],
  },
  {
    path: 'images',
    component: DummyUploadImagesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
