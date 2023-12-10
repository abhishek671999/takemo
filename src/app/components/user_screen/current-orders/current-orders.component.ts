import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { Observable,Subscription, interval  } from 'rxjs';


@Component({
  selector: 'app-current-orders',
  templateUrl: './current-orders.component.html',
  styleUrls: ['./current-orders.component.css']
})
export class CurrentOrdersComponent {

  public currentOrders = []
  displayedColumns: string[] = ['Order No', 'Order details', 'OrderStatus', 'Amount', 'OrderedAt', 'Location' ];
  public currentOrdersDataSource = new MatTableDataSource(this.currentOrders)

  constructor(private _ordersService: OrdersService){}

  updateSubscription: Subscription;
  refreshInterval = 5 // seconds

  ngOnInit(){
    this.updateSubscription = interval(this.refreshInterval * 1000).subscribe(
      (val) => {
        this.getMyOrders()
      }
    )
    
  }

  getMyOrders(){
    let body = {
      "time_frame": "current"
    }
    this._ordersService.getMyOrders(body).subscribe(
      data => {
        console.log('This is data: ', data['order_list'])
        data['order_list'].map(ele => {
            this.currentOrders.push(this.unparseCurrentOrder(ele))
            this.currentOrdersDataSource.data = this.currentOrders
          }
        )
      },
      error => {
        console.log('this is error: ', error)
      }
    )
  }

  unparseCurrentOrder(order){
    let done_time = order.done_time ? new Date(order.done_time).toLocaleString() : null
    let ordered_time = order.ordered_time ? new Date(order.ordered_time).toLocaleString() : null
    return { 
      orderno : order.order_no,
      order_detail: order.line_items.length != 1?
          order.line_items.map(this.addOrderDetails).reduce((a,b)=>{return `${a.details} <br> ${b.details}`}) : 
          order.line_items.map(this.addOrderDetails)[0].details,
      amount: order.total_amount,
      OrderedAt: ordered_time,
      OrderStatus: order.line_items.length != 1?
        order.line_items.map(this.addOrderStatus).reduce((a,b)=>{return `${a.status} <br> ${b.status}`}) : 
        order.line_items.map(this.addOrderStatus)[0].status,
      Location: order.restaurant_name
    }
  }

  addOrderDetails(order){
    return { details: `${order.item_name} ${order.item_quantity} X ${order.item_price} = ₹ ${(order.item_quantity*order.item_price)}`}
  }

  addOrderStatus(order){
    let status = order.ready_quantity == 0 ? `<p class="text-warning"> being prepared </p>` : `<p class="text-success">${order.ready_quantity} of ${order.item_quantity} ready<p>`
    return { 
      status: `<b>${order.item_name}</b> ${status}`
    }
  }

  applyFilter(filterValue){
    this.currentOrdersDataSource.filter = (filterValue as HTMLInputElement).value.trim().toLowerCase()
  }

  ngOnDestroy(){
    this.updateSubscription.unsubscribe()
  }
}
