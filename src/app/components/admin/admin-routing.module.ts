import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminLandingComponent } from './admin-landing/admin-landing.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { BillingComponent } from './billing/billing.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'admin', component: AdminLandingComponent},
      { path: 'analytics', loadChildren: ()=> import('./analytics/analytics.module').then(m=>m.AnalyticsModule)},
      { path: 'user-management', component: UserManagementComponent},
      { path: 'billing', component: BillingComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
