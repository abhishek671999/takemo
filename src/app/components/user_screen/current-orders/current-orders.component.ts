import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { MatDialog } from '@angular/material/dialog';
import { OrderMoreDetailsDialogComponent } from '../../shared/order-more-details-dialog/order-more-details-dialog.component';
import { dateUtils } from 'src/app/shared/utils/date_utils';

@Component({
  selector: 'app-current-orders',
  templateUrl: './current-orders.component.html',
  styleUrls: ['./current-orders.component.css'],
})
export class CurrentOrdersComponent {

  public currentOrders = []
  displayedColumns: string[] = ['Order No', 'Order details', 'OrderStatus', 'Amount',  'order_after' ,'More details',];
  public currentOrdersDataSource = new MatTableDataSource(this.currentOrders)

  constructor(private _ordersService: OrdersService, 
    private _dialog: MatDialog,
    private dateUtils: dateUtils
  ){}

  refreshInterval = 5 // seconds

  ngOnInit(){
    this.getMyOrders()    
  }

  getMyOrders(){
    this.currentOrdersDataSource.data = []
    let body = {
      "time_frame": "current"
    }
    this._ordersService.getMyOrders(body).subscribe(
      data => {
        console.log('This is data: ', data['order_list'])
        this.currentOrders = []
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
          order.line_items.map(this.addOrderDetails).map(items => items.details).join('<br>') : 
          order.line_items.map(this.addOrderDetails)[0].details,
      amount: order.total_amount,
      OrderedAt: order.ordered_time,
      OrderStatus:  order.order_status,//order.line_items.length != 1?
        // order.line_items.map(this.addOrderStatus).map(items => items.status).join('<br>') : 
        // order.line_items.map(this.addOrderStatus)[0].status,
      Location: order.restaurant_name,
      order_id: order.order_id,
      payment_details: order.payment_details,
      total_amount: order.total_amount.toFixed(2),
      total_platform_fee: order.total_platform_fee.toFixed(2),
      total_restaurant_amount: Number(order.total_restaurant_amount.toFixed(2)),
      tax_amount: Number(order.tax_amount.toFixed(2)),
      order_address: order.address,
      order_after: order.print_kot_at,
    }
  }

  addOrderDetails(order){
    return { details: `${order.item_name} ${order.item_quantity} X ${order.item_price} = ₹ ${(order.item_quantity*order.item_price)}`}
  }

  addOrderStatus(order){
    let status = ''
    console.log(order.restaurant_type)
    if(order.restaurant_type == "E-Commerce"){
       status = 'testing'
    }else{
      status = order.ready_quantity == 0 ? `<p class="text-warning"> being prepared </p>` : `<p class="text-success">${order.ready_quantity} of ${order.item_quantity} ready<p>`
    }
    
    return { 
      status: `<b>${order.item_name}</b> ${status}`
    }
  }

  applyFilter(filterValue){
    this.currentOrdersDataSource.filter = (filterValue as HTMLInputElement).value.trim().toLowerCase()
  }

  displayMoreDetails(order) {
    console.log('order', order);
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
