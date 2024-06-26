import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ErrorMsgDialogComponent } from 'src/app/components/shared/error-msg-dialog/error-msg-dialog.component';
import { SuccessMsgDialogComponent } from 'src/app/components/shared/success-msg-dialog/success-msg-dialog.component';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { sessionWrapper } from 'src/app/shared/site-variable';

@Component({
  selector: 'app-ecom-pos-orders',
  templateUrl: './ecom-pos-orders.component.html',
  styleUrls: ['./ecom-pos-orders.component.css'],
})
export class EcomPosOrdersComponent {
  constructor(
    private _fb: FormBuilder,
    private orderService: OrdersService,
    private matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public summary,
    public dialogRef: MatDialogRef<EcomPosOrdersComponent>,
    private __sessionWrapper: sessionWrapper
  ) {}

  customerDetailsForm = this._fb.group({
    customer_name: ['', [Validators.required]],
    address: ['', [Validators.required, Validators.minLength(4)]],
    transaction_id: [
      '',
      [
        Validators.required,
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
      ],
    ],
  });
  disablePlace = false;

  ngOnInit() {}

  placeOrder() {
    this.disablePlace = true;
    let itemList = [];
    this.summary.itemList.forEach((ele) => {
      itemList.push({
        item_id: ele.item_id,
        quantity: ele.quantity +  (ele.parcelQuantity? ele.parcelQuantity: 0),
        parcel_quantity: ele.parcelQuantity,
      });
    });
    let body = {
      customer_name: this.customerDetailsForm.value.customer_name,
      address: this.customerDetailsForm.value.address,
      transaction_id: this.customerDetailsForm.value.transaction_id,
      order_list: itemList,
      restaurant_id: this.__sessionWrapper.getItem('restaurant_id'),
    };
    this.orderService.createEcomOrders(body).subscribe(
      (data) => {
        let dialogRef = this.matDialog.open(SuccessMsgDialogComponent, {
          data: {
            msg: `Order created successfully. Order No: ${data['order_no']}`,
          },
        });
        dialogRef.afterClosed().subscribe((data) => {
          this.ngOnInit();
        });
        this.disablePlace = false;
        this.dialogRef.close({result: true});
      },
      (error) => {
        console.log('Place order response', error);
        let errorMsg =
          error.status != 0
            ? `Failed to create Order. ${error.error.description}`
            : 'Failed to create order. No internet';
        this.matDialog.open(ErrorMsgDialogComponent, {
          data: { msg: errorMsg },
        });
        this.disablePlace = false;
      }
    );
  }

  closeDialog() {
    this.dialogRef.close({result: false});
  }
}
