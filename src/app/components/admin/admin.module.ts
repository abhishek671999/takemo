import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { HomeComponent } from './home/home.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AddRulesDialogComponent } from './add-rules-dialog/add-rules-dialog.component';
import { EditRulesDialogComponent } from './edit-rules-dialog/edit-rules-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MatButtonModule } from '@angular/material/button';
import { AddUserToRuleComponent } from './add-user-to-rule/add-user-to-rule.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import {
  MAT_RADIO_DEFAULT_OPTIONS,
  MatRadioModule,
} from '@angular/material/radio';
import { SalesAnalyticsComponent } from './analytics/sales-analytics/sales-analytics.component';
import { TimelyAnalyticsComponent } from './analytics/timely-analytics/timely-analytics.component';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { EditUserToRuleDialogComponent } from './edit-user-to-rule-dialog/edit-user-to-rule-dialog.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SuccessMsgDialogComponent } from '../shared/success-msg-dialog/success-msg-dialog.component';
import { ErrorMsgDialogComponent } from '../shared/error-msg-dialog/error-msg-dialog.component';
import { DeleteConfirmationDialogComponent } from './delete-confirmation-dialog/delete-confirmation-dialog.component';
import { BillingComponent } from './billing/billing.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SharedModuleModule } from 'src/app/shared/shared-module/shared-module.module';
import { DeleteUserConfirmationComponent } from './delete-user-confirmation/delete-user-confirmation.component';
import { DeleteRuleConfirmationComponent } from './delete-rule-confirmation/delete-rule-confirmation.component';
import { Time24to12Format } from './time24to12.pipe';
import { CurrentOrdersComponent } from './current-orders/current-orders.component';
import { OrdersHomeComponent } from './orders-home/orders-home.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import {  MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DummyUploadImagesComponent } from './dummy-upload-images/dummy-upload-images.component';
import { UploadFormComponent } from '../shared/upload-form/upload-form.component';

@NgModule({
  declarations: [
    HomeComponent,
    UserManagementComponent,
    AddRulesDialogComponent,
    EditRulesDialogComponent,
    AddUserToRuleComponent,
    SalesAnalyticsComponent,
    TimelyAnalyticsComponent,
    EditUserToRuleDialogComponent,
    SuccessMsgDialogComponent,
    ErrorMsgDialogComponent,
    DeleteConfirmationDialogComponent,
    BillingComponent,
    DeleteUserConfirmationComponent,
    DeleteRuleConfirmationComponent,
    Time24to12Format,
    CurrentOrdersComponent,
    OrdersHomeComponent,
    DummyUploadImagesComponent
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
    CanvasJSAngularChartsModule,
    MatAutocompleteModule,
    PdfViewerModule,
    MatCheckboxModule,
    SharedModuleModule,
    MatTableModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    UploadFormComponent
  ],
  providers: [
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'primary' },
    },
  ],
})
export class AdminModule {}
