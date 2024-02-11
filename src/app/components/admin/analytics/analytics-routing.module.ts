import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesAnalyticsComponent } from './sales-analytics/sales-analytics.component';
import { TimelyAnalyticsComponent } from './timely-analytics/timely-analytics.component';
import { AnalyticsHomeComponent } from './analytics-home/analytics-home.component';


const routes: Routes = [
  { path: '', component: AnalyticsHomeComponent, children: [
    { path: 'sales-analytics', component: SalesAnalyticsComponent},
    { path: 'timely-analytics', component: TimelyAnalyticsComponent}
  ]}
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyticsRoutingModule { }
