import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesAnalyticsComponent } from './sales-analytics/sales-analytics.component';
import { TimelyAnalyticsComponent } from './timely-analytics/timely-analytics.component';
import { AnalyticsHomeComponent } from './analytics-home/analytics-home.component';
import { AllRestaurantsCombinedComponent } from './all-restaurants-combined/all-restaurants-combined.component';


const routes: Routes = [
  { path: '', component: AnalyticsHomeComponent, children: [
    { path: 'sales-analytics', component: SalesAnalyticsComponent},
    { path: 'timely-analytics', component: TimelyAnalyticsComponent},
    { path: 'all-restaurants', component: AllRestaurantsCombinedComponent}
  ]}
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyticsRoutingModule { }
