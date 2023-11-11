import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';

@Component({
  selector: 'app-delivery-order-dialog',
  templateUrl: './delivery-order-dialog.component.html',
  styleUrls: ['./delivery-order-dialog.component.css']
})
export class DeliveryOrderDialogComponent {

  constructor(
    private _orderService: OrdersService,
    @Inject(MAT_DIALOG_DATA) public data
  ){
    console.log('Data received: ', data)
    data.forEach(ele => {
      ele['is_delivered'] = false
    });
      console.log('After transformation', data)
    }
    deliver(pendingOrder){
      
      console.log(pendingOrder)
      let body = {
        "restaurant_id": 1,
        "line_item_id": pendingOrder.line_item_id
      }
      console.log('This is body: ', body)
      this._orderService.deliverIndividualOrders(body).subscribe(
        data => { 
          pendingOrder.is_delivered =! pendingOrder.is_delivered
          console.log(pendingOrder.is_delivered)
          console.log('Order delivered successfuly', data)},
        error => { console.log('Error while delivering orders', error)}
      )
    }
  }
  
  