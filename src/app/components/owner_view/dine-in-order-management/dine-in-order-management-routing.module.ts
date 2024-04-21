import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableCockpitComponent } from './table-cockpit/table-cockpit.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: 'table-cockpit', component: TableCockpitComponent 
  },
  {
    path: '',
    component: HomeComponent,
    children: [
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DineInOrderManagementRoutingModule { }
