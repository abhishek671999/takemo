import { Component } from '@angular/core';
import { OrdersService } from 'src/app/orders.service';
import {MatTableDataSource} from '@angular/material/table';


@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})


export class MyOrdersComponent {

  displayedColumns: string[] = ['Order No', 'Order details', 'Amount', 'OrderedAt', 'DelieveredAt', 'Location' ];
  
  public currentOrders = []
  public previousOrders = []
  private _cancelledOrders = []

  public currentOrdersDataSource = new MatTableDataSource(this.currentOrders)
  public previousOrdersDataSource = new MatTableDataSource(this.previousOrders)

  constructor(private _ordersService: OrdersService){}

  ngOnInit(){
    this._ordersService.getCurrentOrders().orders.map(order => {
      if(order.is_done){
      this.previousOrders.push(this.unParsedOrder(order))
      }else if(!order.is_done){
        this.currentOrders.push(this.unParsedOrder(order))
      }
    })

    
  }

  

  addOrderDetails(order){
    return { details: order.item_name + ' ' + order.quantity + ' X ' + ' ' + order.price + ' = ' + (order.quantity*order.price)}
  }

  unParsedOrder(order){
    return { orderno : order.order_no,
      order_detail: order.order_details.map(this.addOrderDetails).reduce((a,b)=>{
        return { details: `${a.details} \n` + b.details }
      }).details,
      amount: order.total_amount,
      OrderedAt: order.ordered_time,
      DelieveredAt: order.done_time,
      Location: order.restaurant.name
  }
  }

  applyFilter(filterValue){
    this.currentOrdersDataSource.filter = (filterValue as HTMLInputElement).value.trim().toLowerCase()
  }
}
