import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpenseManagementHomeComponent } from './expense-management-home/expense-management-home.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { VendorSettingsComponent } from './vendor-settings/vendor-settings.component';

const routes: Routes = [
  {
    path: '',
    component: ExpenseManagementHomeComponent,
    children: [
      { path: 'expense', component: ExpensesComponent },
      { path: 'vendor', component: VendorSettingsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpenseManagementRoutingModule {}
