import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticsRoutingModule } from './analytics-routing.module';
import { AnalyticsHomeComponent } from './analytics-home/analytics-home.component';
import { NgApexchartsModule } from "ng-apexcharts";
import { MatTabsModule } from '@angular/material/tabs';


@NgModule({
  declarations: [
    AnalyticsHomeComponent,
  ],
  imports: [
    CommonModule,
    AnalyticsRoutingModule,
    NgApexchartsModule,
    MatTabsModule
  ]
})
export class AnalyticsModule { }
