import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { HomeComponent } from './home/home.component';
import { PlaceOrdersComponent } from './place-orders/place-orders.component';
import { MenuComponent } from './menu/menu.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { EditMenuComponent } from './edit-menu/edit-menu.component';


const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'menu/:id', component: MenuComponent},
      { path: 'place_order', component: PlaceOrdersComponent},
      { path: 'myorders', component: MyOrdersComponent},
      { path: 'edit-menu/:id', component: EditMenuComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
