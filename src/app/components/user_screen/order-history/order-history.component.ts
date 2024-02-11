import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { OrderMoreDetailsDialogComponent } from '../../shared/order-more-details-dialog/order-more-details-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent {

  timeFrames = [
    { displayValue: 'Today', actualValue: 'today'},
    { displayValue: 'This week', actualValue: 'this_week'},
    { displayValue: 'This month', actualValue: 'this_month'},
    // { displayValue: 'Last 3 months', actualValue: 'last_3_months'},
    // { displayValue: 'Last 6 months', actualValue: 'last_6_months'},
    // { displayValue: 'This year', actualValue: 'this_year'},
  ]
  selectedTimeFrame: string = this.timeFrames[0].actualValue;

  historyColumns: string[] = ['Order No', 'Order details', 'Amount', 'Details']
  public orderHistory = []
  public orderHistoryDataSource = new MatTableDataSource(this.orderHistory)
  
  constructor(private _ordersService: OrdersService, private _dialog: MatDialog){}
  
  ngOnInit(){
    let body = {
      // "rule_id": 1,
      "_c": "rule_id is optional",
      "time_frame": this.selectedTimeFrame,
      "_c1": "possible options for time_frame are today, this_week, this_month",
      "start_date": "",
      "end_date": "",
      "_c3": "if the above both are given then time_frame is not needed"
    }
    this._ordersService.getMyOrders(body).subscribe(
      data => {
        console.log('This is data: ', data['order_list'])
        data['order_list'].map(ele => {
            this.orderHistory.push(this.unparsePastOrders(ele))
            this.orderHistoryDataSource.data = this.orderHistory
          }
        )
      },
      error => {
        console.log('this is error: ', error)
      }
    )
  }

  onValueChange(){
    console.log('Value changed')
    this.orderHistory = []
    this.orderHistoryDataSource.data = this.orderHistory
    let body = {
      // "rule_id": 1,
      "_c": "rule_id is optional",
      "time_frame": this.selectedTimeFrame,
      "_c1": "possible options for time_frame are today, this_week, this_month",
      "start_date": "",
      "end_date": "",
      "_c3": "if the above both are given then time_frame is not needed"
    }
    this._ordersService.getMyOrders(body).subscribe(
      data => {
        console.log('This is data: ', data['order_list'])
        
        data['order_list'].map(ele => {
            this.orderHistory.push(this.unparsePastOrders(ele))
            this.orderHistoryDataSource.data = this.orderHistory
          }
        )
      },
      error => {
        console.log('this is error: ', error)
      }
    )
    
  }


  applyFilter(filterValue){
    this.orderHistoryDataSource.filter = (filterValue as HTMLInputElement).value.trim().toLowerCase()
  }

  unparsePastOrders(order){
    let done_time = order.done_time ? new Date(order.done_time).toLocaleString() : null
    let ordered_time = order.ordered_time ? new Date(order.ordered_time).toLocaleString() : null
    console.log('Length of line times: ', order.line_items.length)
    return { 
      orderno : order.order_no,
      order_detail: order.line_items.length != 1?
          order.line_items.map(this.addOrderDetails).map(items => items.details).join('<br>'): 
          order.line_items.map(this.addOrderDetails)[0].details, //To-Improve
      amount: order.total_amount,
      OrderedAt: ordered_time,
      DelieveredAt: done_time,
      Location: order.restaurant_name,
      order_id: order.order_id,
      payment_details: order.payment_details,
      total_amount: order.total_amount.toFixed(2),
      total_platform_fee: order.total_platform_fee.toFixed(2),
      total_restaurant_amount: order.total_restaurant_amount.toFixed(2),
    }
  }

  addOrderDetails(order){
    let a = { details: `${order.item_name} ${order.item_quantity} X ${order.item_price} = ₹ ${(order.item_quantity*order.item_price)}`} 
    console.log('Order details', a)
    return a
  }

  displayMoreDetails(order) {
    console.log(order);
    let dialogRef = this._dialog.open(OrderMoreDetailsDialogComponent, {
      data: order,
    });
  }
}
