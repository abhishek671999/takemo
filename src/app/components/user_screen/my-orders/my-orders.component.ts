import { Component } from '@angular/core';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import {MatTableDataSource} from '@angular/material/table';
import { Router } from '@angular/router';


@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})


export class MyOrdersComponent {

  displayedColumns: string[] = ['Order No', 'Order details', 'OrderStatus', 'Amount', 'OrderedAt', 'Location' ];
  historyColumns: string[] = ['Order No', 'Order details', 'Amount', 'OrderedAt', 'DelieveredAt', 'Location']
  
  public currentOrders = []
  public previousOrders = []
  private _cancelledOrders = []

  public currentOrdersDataSource = new MatTableDataSource(this.currentOrders)
  public previousOrdersDataSource = new MatTableDataSource(this.previousOrders)

  navLinks = [
    {
      label: 'Current',
      link: '/user/myorders/current-orders',
        index: 0
    },
    {
      label: 'History',
      link: '/user/myorders/order-history',
      index: 1
    },
    {
        label: 'Cancelled',
        link: '/user/myorders/cancelled-orders',
        index: 2
    },
];  

  constructor(private _ordersService: OrdersService, private _router: Router){}

  ngOnInit(){    
    this._router.navigate(['user/myorders/current-orders'])
  }


  // this.previousOrders.push(this.unParsedOrder(ele))
  // console.log('in false', this.previousOrders)
  // this.previousOrdersDataSource.data = this.previousOrders
  

  addOrderDetails(order){
    return { details: `${order.item_name} ${order.item_quantity} X ${order.item_price} = ₹ ${(order.item_quantity*order.item_price)}`}
  }

  addOrderStatus(order){
    let status = order.ready_quantity == 0 ? `<p class="text-warning"> being prepared </p>` : `<p class="text-success">${order.ready_quantity} of ${order.item_quantity} ready<p>`
    return { 
      status: `<b>${order.item_name}</b> ${status}`
    }
  }

  unparsePastOrders(order){
    let done_time = order.done_time ? new Date(order.done_time).toLocaleString() : null
    let ordered_time = order.ordered_time ? new Date(order.ordered_time).toLocaleString() : null
    return { 
      orderno : order.order_no,
      order_detail: order.line_items.length != 1?
          order.line_items.map(this.addOrderDetails).reduce((a,b)=>{return `${a.details} <br> ${b.details}`}) : 
          order.line_items.map(this.addOrderDetails)[0].details,
      amount: order.total_amount,
      OrderedAt: ordered_time,
      DelieveredAt: done_time,
      Location: order.restaurant_name
    }
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

  applyFilter(filterValue){
    this.currentOrdersDataSource.filter = (filterValue as HTMLInputElement).value.trim().toLowerCase()
  }

  onClick(){
    console.log(this.currentOrdersDataSource)
  }
}
