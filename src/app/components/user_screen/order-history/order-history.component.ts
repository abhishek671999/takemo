import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { OrderMoreDetailsDialogComponent } from '../../shared/order-more-details-dialog/order-more-details-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { dateUtils } from 'src/app/shared/utils/date_utils';

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

  historyColumns: string[] = ['Order No', 'Order details', 'OrderStatus', 'Amount', 'order_after', 'Details']
  public orderHistory = []
  public orderHistoryDataSource = new MatTableDataSource(this.orderHistory)
  
  constructor(private _ordersService: OrdersService,
    private _dialog: MatDialog,
    private dateUtils: dateUtils
  ){}
  
  ngOnInit(){
    this.getMyOrders()
  }

  getMyOrders(){
    let body = {
      "time_frame": this.selectedTimeFrame,
    }
    this._ordersService.getMyOrders(body).subscribe(
      data => {
        console.log('This is data: ', data['order_list'])
        this.orderHistory = []
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
      "time_frame": this.selectedTimeFrame,
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
    return { 
      orderno : order.order_no,
      order_detail: order.line_items.length != 1?
          order.line_items.map(this.addOrderDetails).map(items => items.details).join('<br>'): 
          order.line_items.map(this.addOrderDetails)[0].details, //To-Improve
      amount: order.total_amount,
      OrderedAt: order.ordered_time,
      DelieveredAt: order.done_time ,
      Location: order.restaurant_name,
      order_id: order.order_id,
      payment_details: order.payment_details,
      total_amount: order.total_amount.toFixed(2),
      total_platform_fee: order.total_platform_fee.toFixed(2),
      total_restaurant_amount: order.total_restaurant_amount.toFixed(2),
      OrderStatus:  order.order_status,
      tax_amount: order.tax_amount.toFixed(2),
      order_after: order.print_kot_at,
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

  
  modifyOrderAfter(order, orderAfter){
    let body = {
      "order_id": order.order_id,
      "print_time_delta": orderAfter
    }
    console.log(body)
    this._ordersService.modifyOrderAfter(body).subscribe(
      data => {
        console.log('This is data: ', data)
        this.getMyOrders()
      },
      error => {
        console.log('this is error: ', error)
      }
    )
  }

  allowOrderAfter(order){
    let orderAfter = this.dateUtils.parseDateString(order.order_after)
    let now = new Date()
    return orderAfter > now
  }
}
