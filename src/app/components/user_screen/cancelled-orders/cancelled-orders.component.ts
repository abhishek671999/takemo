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


  public cancelledOrders = []
  displayedColumns: string[] =['Order No', 'Order details', 'Amount', 'Details'];
  public cancelledOrdersDataSource = new MatTableDataSource(this.cancelledOrders)

  timeFrames = [
    { displayValue: 'Today', actualValue: 'today'},
    { displayValue: 'This week', actualValue: 'this_week'},
    { displayValue: 'This month', actualValue: 'this_month'},
    // { displayValue: 'Last 3 months', actualValue: 'last_3_months'},
    // { displayValue: 'Last 6 months', actualValue: 'last_6_months'},
    // { displayValue: 'This year', actualValue: 'this_year'},
  ]
  selectedTimeFrame: string = this.timeFrames[0].actualValue;

  constructor(private _ordersService: OrdersService, private _dialog: MatDialog){}

  ngOnInit(){
    this.getCancelledOrders()
  }


  getCancelledOrders(){
    let body = {
      "restaurant_id": sessionStorage.getItem('restaurant_id'),
      "time_frame": this.selectedTimeFrame
    }
    this._ordersService.getCancelledOrders(body).subscribe(
      data => {
        this.cancelledOrders = []
        data['order_list'].map(ele => {
          this.cancelledOrders.push(this.unparseCancelledOrders(ele))
          this.cancelledOrdersDataSource.data = this.cancelledOrders
        })
      }
    )
  }

  unparseCancelledOrders(order){
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
      Location: order.restaurant_name,
      order_id: order.order_id,
      payment_details: order.payment_details,
      total_amount: order.total_amount.toFixed(2),
      total_platform_fee: order.total_platform_fee.toFixed(2),
      total_restaurant_amount: order.total_restaurant_amount.toFixed(2),
      refund_amount: order.refund_amount
    }
  }

  addOrderDetails(order){
    return { details: `${order.item_name} ${order.item_quantity} X ${order.item_price} = ₹ ${(order.item_quantity*order.item_price)}`}
  }

  displayMoreDetails(order) {
    console.log(order);
    let dialogRef = this._dialog.open(OrderMoreDetailsDialogComponent, {
      data: order,
    });
  }
  

  applyFilter(filterValue){
    this.cancelledOrdersDataSource.filter = (filterValue as HTMLInputElement).value.trim().toLowerCase()
  }

}
