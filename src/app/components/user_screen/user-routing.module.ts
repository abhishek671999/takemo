import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { PostPaymentComponent } from './post-payment/post-payment.component';
import { CurrentOrdersComponent } from './current-orders/current-orders.component';
import { CancelledOrdersComponent } from './cancelled-orders/cancelled-orders.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { SupportComponent } from './support/support.component';
import { WalletComponent } from './wallet/wallet.component';
import { PostRechargePaymentComponent } from './post-recharge-payment/post-recharge-payment.component';
import { ProfileComponent } from '../shared/profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'profile', component: ProfileComponent},
      { path: 'menu/:id', component: MenuComponent },
      { 
        path: 'myorders', 
        component: MyOrdersComponent,
        children: [
          { path: 'current-orders', component: CurrentOrdersComponent},
          { path: 'cancelled-orders', component: CancelledOrdersComponent},
          { path: 'order-history', component: OrderHistoryComponent}
        ]
      },
      { path: 'order-acknowledgement', component: PostPaymentComponent },
      { path: 'support', component: SupportComponent},
      { path: 'wallet', component: WalletComponent},
      { path: 'recharge-acknowledgement', component: PostRechargePaymentComponent}
    ],
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
