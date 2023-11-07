import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';

import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { UserManagementComponent } from './user-management/user-management.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { AddRulesDialogComponent } from './add-rules-dialog/add-rules-dialog.component';
import { EditRulesDialogComponent } from './edit-rules-dialog/edit-rules-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {NgxMatTimepickerModule} from 'ngx-mat-timepicker';
import {MatButtonModule} from '@angular/material/button';
import { AddUserToRuleComponent } from './add-user-to-rule/add-user-to-rule.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import { SalesAnalyticsComponent } from './analytics/sales-analytics/sales-analytics.component';
import { TimelyAnalyticsComponent } from './analytics/timely-analytics/timely-analytics.component';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
 

@NgModule({
  declarations: [
    HeaderComponent,
    HomeComponent,
    FooterComponent,
    AnalyticsComponent,
    UserManagementComponent,
    AddRulesDialogComponent,
    EditRulesDialogComponent,
    AddUserToRuleComponent,
    SalesAnalyticsComponent,
    TimelyAnalyticsComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatExpansionModule,
    ScrollingModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMatTimepickerModule,
    MatButtonModule,
    MatTabsModule,
    MatSelectModule,
    MatRadioModule,
    CanvasJSAngularChartsModule
  ]
})
export class AdminModule { }
