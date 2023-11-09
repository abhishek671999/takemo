import { Component } from '@angular/core';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';

@Component({
  selector: 'app-current-orders',
  templateUrl: './current-orders.component.html',
  styleUrls: ['./current-orders.component.css']
})
export class CurrentOrdersComponent {

  constructor(private _orderService: OrdersService ){}
  orderList = [];
  currentOrders;
  ngOnInit(){
    let params = {'restaurant_id': 1}
    this._orderService.getCurrentOrdersCards(params).subscribe(
      data =>{ 
        this.currentOrders = data
        console.log('Current Orders data: ', data)
        for (let item in this.currentOrders){
          this.orderList.push({itemName: item, quantity: this.currentOrders[item]['pending_order'].length})
        }
        console.log("Order list", this.orderList)
      }, 
      error => {
        console.log('Error while getting data: ', error)
      }
    )
    console.log('order list22', this.orderList)
  }
}
