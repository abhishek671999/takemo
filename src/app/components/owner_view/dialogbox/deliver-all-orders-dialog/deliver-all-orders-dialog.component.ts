import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { sessionWrapper } from 'src/app/shared/site-variable';

@Component({
  selector: 'app-deliver-all-orders-dialog',
  templateUrl: './deliver-all-orders-dialog.component.html',
  styleUrls: ['./deliver-all-orders-dialog.component.css']
})
export class DeliverAllOrdersDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private __orderService: OrdersService,
    private dialogRef: MatDialogRef<DeliverAllOrdersDialogComponent>,
    private __sessionWrapper: sessionWrapper
  ){
    console.log('selected ', data)
  }

  deliverAll(){
    let body = {"restaurant_id": this.__sessionWrapper.getItem('restaurant_id')}
    if(this.data){
      body['counter_id'] = this.data['counter']['counter_id']
    }
    this.__orderService.deliverAllOrders(body).subscribe(
      data => {
        console.log('Delivered all orders')
        this.dialogRef.close({success: 'ok'})
      },
      error => {
        this.dialogRef.close({success: 'failed'})
      }
    )
  }

  closeDialog(){
    this.dialogRef.close()
  }
}
