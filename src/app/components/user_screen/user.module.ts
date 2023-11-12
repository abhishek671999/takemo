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
import {MatTabsModule} from '@angular/material/tabs';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatDialog, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import {MatButtonModule} from '@angular/material/button';
import { EditMenuComponent } from './edit-menu/edit-menu.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import { EditFormDialogComponent } from './edit-form-dialog/edit-form-dialog.component';
import { DeleteConfirmationDialogComponent } from './delete-confirmation-dialog/delete-confirmation-dialog.component';
import { AddCategoryDialogComponent } from './add-category-dialog/add-category-dialog.component';
import { AddItemDialogComponent } from './add-item-dialog/add-item-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox'
import {MAT_RADIO_DEFAULT_OPTIONS, MatRadioModule} from '@angular/material/radio';
import { SuccessfulDialogComponent } from './successful-dialog/successful-dialog.component';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { DeleteCategoryConfirmationDialogComponent } from './delete-category-confirmation-dialog/delete-category-confirmation-dialog.component';
import { PostPaymentComponent } from './post-payment/post-payment.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    UserComponent,
    MenuComponent,
    MyOrdersComponent,
    ConfirmationDialogComponent,
    EditMenuComponent,
    EditFormDialogComponent,
    DeleteConfirmationDialogComponent,
    AddCategoryDialogComponent,
    AddItemDialogComponent,
    SuccessfulDialogComponent,
    ErrorDialogComponent,
    DeleteCategoryConfirmationDialogComponent,
    PostPaymentComponent,
    ],
  imports: [CommonModule,FormsModule, UserRoutingModule, MatProgressSpinnerModule, MatExpansionModule, ScrollingModule, 
    MatTabsModule, MatTableModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatButtonModule, 
    MatIconModule, MatButtonToggleModule, MatCheckboxModule, MatRadioModule, ReactiveFormsModule, MatSlideToggleModule],
  providers:[{
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'primary' },
    }]
})
export class UserModule {}
