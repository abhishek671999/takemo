import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { SuccessMsgDialogComponent } from '../../shared/success-msg-dialog/success-msg-dialog.component';
import { ErrorMsgDialogComponent } from '../../shared/error-msg-dialog/error-msg-dialog.component';

@Component({
  selector: 'app-confirm-order-cancel',
  templateUrl: './confirm-order-cancel.component.html',
  styleUrls: ['./confirm-order-cancel.component.css']
})
export class ConfirmOrderCancelComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<ConfirmOrderCancelComponent>,
    private _orderService: OrdersService,
    private dialog: MatDialog
  ){
    console.log('Data received: ', data)
  }

  amount = 10

  close(){
    this.dialogRef.close({cancelled: false})
  }

  cancel(){
    let body = {   
      "order_id": this.data.order_id
  }
    this._orderService.cancelOrder(body).subscribe(
      data => {
        console.log('Success', data)
        let dialogRef = this.dialog.open(SuccessMsgDialogComponent, {data: 'Order Cancel successfully'})
        this.closeDialogDisplay(dialogRef)
        this.dialogRef.close({cancelled: true})
      },
      error => {
        console.log('Failed', error)
        let dialogRef = this.dialog.open(ErrorMsgDialogComponent, {data: 'Order could not be cancelled'})
        this.closeDialogDisplay(dialogRef)
        this.dialogRef.close({cancelled: false})
      }
    )
   
  }

  closeDialogDisplay(dialogRef){
    setTimeout(() => {
      dialogRef.close()
    }, 3000);
  }

}
