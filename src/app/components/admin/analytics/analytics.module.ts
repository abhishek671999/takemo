import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticsRoutingModule } from './analytics-routing.module';
import { AnalyticsHomeComponent } from './analytics-home/analytics-home.component';
import { NgApexchartsModule } from "ng-apexcharts";


@NgModule({
  declarations: [
    AnalyticsHomeComponent,
  ],
  imports: [
    CommonModule,
    AnalyticsRoutingModule,
    NgApexchartsModule
  ]
})
export class AnalyticsModule { }
