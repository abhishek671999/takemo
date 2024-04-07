import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpenseManagementRoutingModule } from './expense-management-routing.module';
import { ExpenseManagementHomeComponent } from './expense-management-home/expense-management-home.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
  declarations: [ExpenseManagementHomeComponent],
  imports: [
    CommonModule,
    ExpenseManagementRoutingModule,
    MatSnackBarModule
  ]
})
export class ExpenseManagementModule { }
