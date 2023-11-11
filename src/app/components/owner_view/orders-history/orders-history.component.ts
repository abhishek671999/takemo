import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';

@Component({
  selector: 'app-orders-history',
  templateUrl: './orders-history.component.html',
  styleUrls: ['./orders-history.component.css']
})
export class OrdersHistoryComponent {

  constructor(private _orderService: OrdersService){}

  timeFrames = [
    {ViewValue: 'Today', actualValue: 'today'},
    {ViewValue: 'This week', actualValue: 'this_week'},
    {ViewValue: 'This month', actualValue: 'this_month'},
  ]

  displayedColumns: string[] = ['Order No', 'Order details', 'Amount', 'OrderedAt', 'DelieveredAt', 'Status', 'Location' ];
  public currentOrders = []
  public previousOrders = []

  public currentOrdersDataSource = new MatTableDataSource(this.currentOrders)

  selectedTimeFrame = this.timeFrames[0]

  ngOnInit(){
    let body = {
        "restaurant_id": 1,
        "rule_id": 2,
        "_c": "rule_id is optional",
        "time_frame": this.selectedTimeFrame.actualValue,
        "_c1": "possible options for time_frame are today, this_week, this_month",
        "start_date": "",
        "end_date": "",
        "_c3": "if the above both are given then time_frame is not needed"
    }
    console.log(body)
    this._orderService.getRestaurantOrders(body).subscribe(
      data => {
        console.log(data)
        this.parseResponse(data)
      },
      error => {
        console.log(error)
      }
    )
  }

  parseResponse(data){
    this.currentOrders = []
    data['order_list'].map(ele =>{
      console.log('Before:: ', this.currentOrders)
      this.currentOrders.push(this.unParsedOrder(ele))
      console.log('done on change')
    }
    )
    this.currentOrdersDataSource.data = this.currentOrders     
  }


  onValueChange(){
    this.currentOrders = []
    console.log('This is value:: ', this.selectedTimeFrame, this.currentOrders)
    let body = {
      "restaurant_id": 1,
      "rule_id": 2,
      "_c": "rule_id is optional",
      "time_frame": this.selectedTimeFrame.actualValue,
      "_c1": "possible options for time_frame are today, this_week, this_month",
      "start_date": "",
      "end_date": "",
      "_c3": "if the above both are given then time_frame is not needed"
  }
  console.log(body)
    this._orderService.getRestaurantOrders(body).subscribe(
      data => {
        console.log(data)
        this.parseResponse(data)
      },
      error => {
        console.log(error)
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
      Location: order.restaurant_name,
      Status: order.is_delivered ? 'Delivered': 'Not-delivered'
  }
  }

  applyFilter(filterValue){
    this.currentOrdersDataSource.filter = (filterValue as HTMLInputElement).value.trim().toLowerCase()
  }

  onClick(){
    console.log(this.currentOrdersDataSource)
  }
}
