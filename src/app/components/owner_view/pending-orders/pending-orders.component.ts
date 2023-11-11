import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { DeliveryOrderDialogComponent } from '../delivery-order-dialog/delivery-order-dialog.component';

@Component({
  selector: 'app-pending-orders',
  templateUrl: './pending-orders.component.html',
  styleUrls: ['./pending-orders.component.css']
})
export class PendingOrdersComponent {

  constructor(private _orderService: OrdersService, 
    private _dialog: MatDialog){}

  orderList = [];
  currentOrders;
  ngOnInit(){
    let params = {'restaurant_id': 1}
    this._orderService.getCurrentOrdersCards(params).subscribe(
      data =>{ 
        this.currentOrders = data
        console.log('Current Orders data: ', data)
        for (let item in this.currentOrders){
          this.orderList.push({obj: this.currentOrders[item]['pending_order'], name: item, quantity: this.currentOrders[item]['pending_order'].length})
        }
        console.log("Order list", this.orderList)
      }, 
      error => {
        console.log('Error while getting data: ', error)
      }
    )
    console.log('order list22', this.orderList)
  }

  itemClicked(item){
    console.log('This item is clicked: ', item)
    let dialogRef = this._dialog.open(DeliveryOrderDialogComponent, {data: item.obj})


  }
}
