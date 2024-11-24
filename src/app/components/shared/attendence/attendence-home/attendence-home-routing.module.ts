import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendenceManagementComponent } from '../attendence-management/attendence-management.component';
import { EmployeeManagementComponent } from '../employee-management/employee-management.component';
import { AttendenceHomeComponent } from './attendence-home.component';

const routes: Routes = [
  {
    path: '',
    component: AttendenceHomeComponent,
    children: [
      {path: 'attendance', component: AttendenceManagementComponent},
      {path: 'employees', component: EmployeeManagementComponent}
    ]
  }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendenceHomeRoutingModule { }
