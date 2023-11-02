import { Component } from '@angular/core';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
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
    this._ordersService.getCurrentOrders().subscribe(
      data => {
        console.log('This is data: ', data['order_list'])
        data['order_list'].map(ele => {
          if(ele.is_done){
            this.currentOrders.push(this.unParsedOrder(ele))
            this.currentOrdersDataSource.data = this.currentOrders
          }else if(!ele.is_done){
            this.previousOrders.push(this.unParsedOrder(ele))
            console.log('in false', this.previousOrders)
            this.previousOrdersDataSource.data = this.previousOrders
          }
        }
     )
        

      },
      error => {
        console.log('this is error: ', error)
      }
    )    
  }

  

  addOrderDetails(order){
    return { details: `${order.item_name} ${order.item_quantity} X ${order.item_price} = ${(order.item_quantity*order.item_price)}`}
  }

  unParsedOrder(order){
    let done_time = order.done_time ? new Date(order.done_time).toLocaleString() : null
    let ordered_time = order.ordered_time ? new Date(order.ordered_time).toLocaleString() : null
    return { orderno : order.order_no,
      order_detail: order.line_items.length != 1? order.line_items.map(this.addOrderDetails).reduce((a,b)=>{
        return `${a.details} <br> ${b.details}`
      }) : order.line_items.map(this.addOrderDetails)[0].details,
      amount: order.total_amount,
      OrderedAt: ordered_time,
      DelieveredAt: done_time,
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
