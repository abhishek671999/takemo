import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticsRoutingModule } from './analytics-routing.module';
import { AnalyticsHomeComponent } from './analytics-home/analytics-home.component';
 



@NgModule({
  declarations: [
    AnalyticsHomeComponent
  ],
  imports: [
    CommonModule,
    AnalyticsRoutingModule,
  ]
})
export class AnalyticsModule { }
