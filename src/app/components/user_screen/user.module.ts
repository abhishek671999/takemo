import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MenuComponent } from './menu/menu.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { EditMenuComponent } from '../owner_view/restaurant_management/edit-menu/edit-menu.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { EditFormDialogComponent } from '../owner_view/dialogbox/edit-form-dialog/edit-form-dialog.component';
import { DeleteConfirmationDialogComponent } from '../owner_view/dialogbox/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { AddCategoryDialogComponent } from '../owner_view/dialogbox/add-category-dialog/add-category-dialog.component';
import { AddItemDialogComponent } from '../owner_view/dialogbox/add-item-dialog/add-item-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {
  MAT_RADIO_DEFAULT_OPTIONS,
  MatRadioModule,
} from '@angular/material/radio';
import { SuccessfulDialogComponent } from '../owner_view/dialogbox/successful-dialog/successful-dialog.component';
import { ErrorDialogComponent } from '../owner_view/dialogbox/error-dialog/error-dialog.component';
import { DeleteCategoryConfirmationDialogComponent } from '../owner_view/dialogbox/delete-category-confirmation-dialog/delete-category-confirmation-dialog.component';
import { PostPaymentComponent } from './post-payment/post-payment.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SharedModuleModule } from 'src/app/shared/shared-module/shared-module.module';
import { CurrentOrdersComponent } from './current-orders/current-orders.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { CancelledOrdersComponent } from './cancelled-orders/cancelled-orders.component';
import { MatSelectModule } from '@angular/material/select';
import { OrderMoreDetailsDialogComponent } from '../shared/order-more-details-dialog/order-more-details-dialog.component';
import { SupportComponent } from './support/support.component';
import { WalletComponent } from './wallet/wallet.component';
import { RechargeWalletDialogComponent } from './recharge-wallet-dialog/recharge-wallet-dialog.component';
import { PostRechargePaymentComponent } from './post-recharge-payment/post-recharge-payment.component';
import { ClickOutsideCartDirective, ClickOutsideDirective } from 'src/app/shared/utils/clickOutside';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { ProfileComponent } from '../shared/profile/profile.component';
import {MatBadgeModule} from '@angular/material/badge';
import { UploadFormComponent } from "../shared/upload-form/upload-form.component";
import { ParcelDialogComponent } from './parcel-dialog/parcel-dialog.component';
import { PrepareLaterDialogComponent } from './prepare-later-dialog/prepare-later-dialog.component';


@NgModule({
    declarations: [
        HomeComponent,
        UserComponent,
        MenuComponent,
        MyOrdersComponent,
        ConfirmationDialogComponent,
        DeleteConfirmationDialogComponent,
        AddCategoryDialogComponent,
        SuccessfulDialogComponent,
        ErrorDialogComponent,
        DeleteCategoryConfirmationDialogComponent,
        PostPaymentComponent,
        CurrentOrdersComponent,
        OrderHistoryComponent,
        CancelledOrdersComponent,
        OrderMoreDetailsDialogComponent,
        SupportComponent,
        WalletComponent,
        RechargeWalletDialogComponent,
        PostRechargePaymentComponent,
        ClickOutsideCartDirective,
        ProfileComponent,
        ParcelDialogComponent,
        PrepareLaterDialogComponent
    ],
    exports: [],
    imports: [
        CommonModule,
        FormsModule,
        UserRoutingModule,
        MatProgressSpinnerModule,
        MatExpansionModule,
        ScrollingModule,
        MatTabsModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatButtonToggleModule,
        MatCheckboxModule,
        MatRadioModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
        SharedModuleModule,
        MatSelectModule,
        MatSnackBarModule,
        MatBadgeModule,
        UploadFormComponent,
        MatProgressSpinnerModule,
        MatChipsModule
    ]
})
export class UserModule {}
