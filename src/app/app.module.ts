import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home_screen/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './components/home_screen/header/header.component';
import { FooterComponent } from './components/home_screen/footer/footer.component';
import { SignupComponent } from './components/home_screen/signup/signup.component';
import { ForgotpasswordComponent } from './components/home_screen/forgotpassword/forgotpassword.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ContactUsComponent } from './components/home_screen/contact-us/contact-us.component';
import { LoginComponent } from './components/home_screen/login/login.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { AdminLandingComponent } from './components/admin/admin-landing/admin-landing.component';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { CurrentOrdersComponent } from './components/owner_view/orders/current-orders/current-orders.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PostLoginComponent } from './components/post-login/post-login.component';
import { Utility, meAPIUtility } from './shared/site-variable';
import { Login2Component } from './components/home_screen/login2/login2.component';
import { dateUtils } from './shared/utils/date_utils';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthInterceptorInterceptor } from './shared/services/auth-interceptor.interceptor';
import { ConfirmActionDialogComponent } from './components/shared/confirm-action-dialog/confirm-action-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { UploadFormComponent } from './components/shared/upload-form/upload-form.component';
import { SelectSubitemDialogComponent } from './components/shared/select-subitem-dialog/select-subitem-dialog.component';
import { AddItemNoteDialogComponent } from './components/shared/add-item-note-dialog/add-item-note-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { InputPasswordDialogComponent } from './components/shared/input-password-dialog/input-password-dialog.component';
import {MatCheckboxModule} from '@angular/material/checkbox';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    SignupComponent,
    ForgotpasswordComponent,
    routingComponents,
    NotfoundComponent,
    ContactUsComponent,
    LoginComponent,
    AdminLandingComponent,
    PostLoginComponent,
    Login2Component,
    ConfirmActionDialogComponent,
    SelectSubitemDialogComponent,
    AddItemNoteDialogComponent,
    InputPasswordDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    BrowserAnimationsModule,
    MaterialModule,
    CanvasJSAngularChartsModule,
    NgApexchartsModule,
    MatDialogModule,
    MatFormFieldModule,
     MatInputModule,
     MatCheckboxModule,
     MatTabsModule
    ],
  providers: [Utility, meAPIUtility, dateUtils, 
      { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
