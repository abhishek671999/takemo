import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { PlaceOrdersComponent } from './place-orders/place-orders.component';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MenuComponent } from './menu/menu.component'
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    UserComponent,
    MenuComponent,
    ],
  imports: [CommonModule, UserRoutingModule, MatProgressSpinnerModule, MatExpansionModule],
})
export class UserModule {}
