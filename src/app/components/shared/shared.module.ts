import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { EmployeeManagementComponent } from './attendence/employee-management/employee-management.component';
import { AttendenceHomeComponent } from './attendence/attendence-home/attendence-home.component';
import { AttendenceManagementComponent } from './attendence/attendence-management/attendence-management.component';
import { MatTabsModule } from '@angular/material/tabs';
import { SharedModuleModule } from 'src/app/shared/shared-module/shared-module.module';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ViewImageComponent } from './dialogbox/view-image/view-image.component';
import { ImageLoaderComponent } from './subcomponents/image-loader/image-loader.component';
import { MatTableModule } from '@angular/material/table';
import { CaptureImageComponent } from './subcomponents/capture-image/capture-image.component';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    AttendenceManagementComponent,
    AttendenceHomeComponent,
    EmployeeManagementComponent,
    HomeComponent,
    ViewImageComponent,
    ImageLoaderComponent,
    CaptureImageComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    MatTabsModule,
    SharedModuleModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    MatTableModule,
    MatDialogModule
  ],

})
export class SharedModule { }
