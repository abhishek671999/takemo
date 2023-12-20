import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { ConfirmOrderCancelComponent } from '../confirm-order-cancel/confirm-order-cancel.component';

@Component({
  selector: 'app-delivery-order-dialog',
  templateUrl: './delivery-order-dialog.component.html',
  styleUrls: ['./delivery-order-dialog.component.css']
})
export class DeliveryOrderDialogComponent {

  constructor(
    private _orderService: OrdersService,
    @Inject(MAT_DIALOG_DATA) public data,
    private _dialog: MatDialog
  ){
    console.log('Data received: ', data)
    data.obj.forEach(ele => {
      ele['is_delivered'] = false
    });
  }

  ngOnInit(){
    console.log('In ngOnitit', this.data.obj)
    this.data = this.data.obj.filter(ele => {
      ele.is_delivered == false
    })
  }

  updateStatusToDelivered(order){
    let body = {
      "restaurant_id": sessionStorage.getItem('restaurant_id'),
      "line_item_id": order.line_item_id,
      "status": !order.is_ready ? "delivered" : "ready_and_delivered" 
    }
    console.log('Delivered: ', body)
    this._orderService.updateOrderStatus(body).subscribe(
      data => {
        order.is_delivered = true
        order.is_ready = true
        this.ngOnInit()
      },
      error => {
        console.log('Error while delivering orders')
      }
    )
  }

  updateStatusToReady(order){
    let body = {
      "restaurant_id": sessionStorage.getItem('restaurant_id'),
      "line_item_id": order.line_item_id,
      "status": "ready"
    }
    console.log('Ready: ', body)
    this._orderService.updateOrderStatus(body).subscribe(
      data => {
        order.is_ready =! order.is_ready
      },
      error => {
        console.log('Error while delivering orders')
      }
    )
  }

  cancelOrder(order){
    let dialogRef = this._dialog.open(ConfirmOrderCancelComponent, {data: order})    
  }

}
  
  