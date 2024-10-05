import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RestaurantManagementRoutingModule } from './restaurant-management-routing.module';
import { ManagmentHomeComponent } from './managment-home/managment-home.component';
import { ActivityLogComponent } from './activity-log/activity-log.component';
import {  MatPaginatorModule } from '@angular/material/paginator';
import { TableManagementComponent } from './table-management/table-management.component';
import { MatInputModule } from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { EditMenuComponent } from './edit-menu/edit-menu.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SharedModuleModule } from 'src/app/shared/shared-module/shared-module.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { EditFormDialogComponent } from '../dialogbox/edit-form-dialog/edit-form-dialog.component';
@NgModule({
  declarations: [
    ManagmentHomeComponent,
    ActivityLogComponent,
    EditMenuComponent,
    EditFormDialogComponent
  ],
  imports: [
    CommonModule,
    RestaurantManagementRoutingModule,
    MatPaginatorModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatExpansionModule,
    ScrollingModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    SharedModuleModule,
    MatSelectModule,
    MatSnackBarModule,
    MatBadgeModule,
    MatTabsModule
  ]
})
export class RestaurantManagementModule { }
