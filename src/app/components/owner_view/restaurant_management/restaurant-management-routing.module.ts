import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagmentHomeComponent } from './managment-home/managment-home.component';
import { EditMenuComponent } from './edit-menu/edit-menu.component';
import { FoodCounterManagementComponent } from './food-counter-management/food-counter-management.component';
import { ActivityLogComponent } from './activity-log/activity-log.component';
import { TableManagementComponent } from './table-management/table-management.component';

const routes: Routes = [
  {
    path: '',
    component: ManagmentHomeComponent,
    children: [
      { path: 'edit-menu/:id', component: EditMenuComponent },
      { path: 'food-counter-management', component: FoodCounterManagementComponent },
      { path: 'activity-log', component: ActivityLogComponent },
      { path: 'table-management', component: TableManagementComponent}
  ]}
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RestaurantManagementRoutingModule { }
