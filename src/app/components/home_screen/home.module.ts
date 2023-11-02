import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SuccessfulDialogComponent } from './successful-dialog/successful-dialog.component';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';

@NgModule({
  declarations: [
    SuccessfulDialogComponent,
    ErrorDialogComponent,
    PrivacyPolicyComponent,
    TermsAndConditionsComponent,
 ],
  imports: [
    CommonModule, 
    HomeRoutingModule,
    ReactiveFormsModule,
    MatDialogModule
    
  ],
})
export class HomeModule {}
