import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagmentHomeComponent } from './managment-home/managment-home.component';
import { EditMenuComponent } from './edit-menu/edit-menu.component';
import { FoodCounterManagementComponent } from './food-counter-management/food-counter-management.component';

const routes: Routes = [
  { path: '', component: ManagmentHomeComponent, children: [
    { path: 'edit-menu/:id', component: EditMenuComponent},
    { path: 'food-counter-management', component: FoodCounterManagementComponent}
  ]}
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RestaurantManagementRoutingModule { }
