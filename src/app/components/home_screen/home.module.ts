import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SuccessfulDialogComponent } from './successful-dialog/successful-dialog.component';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Login2Component } from './login2/login2.component';
import { RefundCancellationPolicyComponent } from './refund-cancellation-policy/refund-cancellation-policy.component';

@NgModule({
  declarations: [
    SuccessfulDialogComponent,
    ErrorDialogComponent,
    PrivacyPolicyComponent,
    TermsAndConditionsComponent,
    RefundCancellationPolicyComponent,
 ],
  imports: [
    CommonModule, 
    HomeRoutingModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
  ],
})
export class HomeModule {}
