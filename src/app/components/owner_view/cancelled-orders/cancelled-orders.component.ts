import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { OrderMoreDetailsDialogComponent } from '../../shared/order-more-details-dialog/order-more-details-dialog.component';

@Component({
  selector: 'app-cancelled-orders',
  templateUrl: './cancelled-orders.component.html',
  styleUrls: ['./cancelled-orders.component.css']
})
export class CancelledOrdersComponent {

  constructor(private _orderService: OrdersService, private _dialog: MatDialog){}

  timeFrames = [
    {ViewValue: 'Today', actualValue: 'today'},
    {ViewValue: 'This week', actualValue: 'this_week'},
    {ViewValue: 'This month', actualValue: 'this_month'},
  ]

  displayedColumns: string[] = [
    'Order No',
    'Order details',
    'Amount',
    'Details',
  ];

  
  public currentOrders = []
  public currentOrdersDataSource = new MatTableDataSource(this.currentOrders)

  selectedTimeFrame = this.timeFrames[0]

  ngOnInit(){
    this.getRestaurantCancelledOrders()
  }

  getRestaurantCancelledOrders(){
    this.currentOrders = []
    let body = {
      "restaurant_id": sessionStorage.getItem('restaurant_id'),
      "_c": "rule_id is optional",
      "time_frame": this.selectedTimeFrame.actualValue,
      "_c1": "possible options for time_frame are today, this_week, this_month",
      "start_date": "",
      "end_date": "",
      "_c3": "if the above both are given then time_frame is not needed"
  }
  console.log(body)
  this._orderService.getRestaurantCancelledOrders(body).subscribe(
    data => {
      console.log(data)
      this.unparseResponse(data)
    },
    error => {
      console.log(error)
    }
  )
  }


  unparseResponse(data){
    this.currentOrders = []
    data['order_list'].map(ele =>{
      this.currentOrders.push(this.unParsedOrder(ele))
    }
    )
    this.currentOrdersDataSource.data = this.currentOrders     
  }

  unParsedOrder(order){
    let done_time = order.done_time ? new Date(order.done_time).toLocaleString() : null
    let ordered_time = order.ordered_time ? new Date(order.ordered_time).toLocaleString() : null
    return { orderno : order.order_no,
      order_detail: order.line_items.length != 1? order.line_items.map(this.addOrderDetails).map(items => items.details).join('<br>'): order.line_items.map(this.addOrderDetails)[0].details,
      amount: order.total_amount,
      OrderedAt: ordered_time,
      DeliveredAt: done_time,
      Location: order.restaurant_name,
      Status: order.is_delivered ? 'Delivered': 'Not-delivered',
      order_id: order.order_id,
      payment_details: order.payment_details,
      total_amount: order.total_amount.toFixed(2),
      total_platform_fee: order.total_platform_fee.toFixed(2),
      total_restaurant_amount: order.total_restaurant_amount.toFixed(2),
    }
  }


  addOrderDetails(order){
    return { details: `${order.item_name} ${order.item_quantity} X ${order.item_price} = ${(order.item_quantity*order.item_price)}`}
  }

  applyFilter(filterValue){
    this.currentOrdersDataSource.filter = (filterValue as HTMLInputElement).value.trim().toLowerCase()
  }

  onClick(){
    console.log(this.currentOrdersDataSource)
  }

  displayMoreDetails(order) {
    console.log(order);
    let dialogRef = this._dialog.open(OrderMoreDetailsDialogComponent, {
      data: order,
    });
  }

}
