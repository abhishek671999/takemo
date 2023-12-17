import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { ConfirmOrderCancelComponent } from '../confirm-order-cancel/confirm-order-cancel.component';
import { MatDialog } from '@angular/material/dialog';
import { OrderMoreDetailsDialogComponent } from '../../shared/order-more-details-dialog/order-more-details-dialog.component';

@Component({
  selector: 'app-current-orders',
  templateUrl: './current-orders.component.html',
  styleUrls: ['./current-orders.component.css'],
})
export class CurrentOrdersComponent {
  constructor(
    private _ordersService: OrdersService,
    private _dialog: MatDialog
  ) {}

  displayedColumns: string[] = [
    'Order No',
    'Order details',
    'Deliver',
    'Amount',
    'Cancel',
    'Details',
  ];

  public currentOrders = [];
  public currentOrdersDataSource = new MatTableDataSource(this.currentOrders);

  ngOnInit() {
    let body = {
      restaurant_id: sessionStorage.getItem('restaurant_id'),
      _c: 'rule_id is optional',
      time_frame: 'current',
      _c1: 'possible options for time_frame are today, this_week, this_month',
      start_date: '',
      end_date: '',
      _c3: 'if the above both are given then time_frame is not needed',
    };
    this._ordersService.getRestaurantOrders(body).subscribe(
      (data) => {
        console.log('Current orders: ', data);
        this.unparseResponse(data);
      },
      (error) => {
        console.log('Error: ', error);
      }
    );
  }

  unparseResponse(data) {
    this.currentOrders = [];
    data['order_list'].map((ele) => {
      this.currentOrders.push(this.unParsedOrder(ele));
    });
    this.currentOrdersDataSource.data = this.currentOrders;
  }

  unParsedOrder(order) {
    let done_time = order.done_time
      ? new Date(order.done_time).toLocaleString()
      : null;
    let ordered_time = order.ordered_time
      ? new Date(order.ordered_time).toLocaleString()
      : null;
    return {
      orderno: order.order_no,
      order_detail:
        order.line_items.length != 1
          ? order.line_items.map(this.addOrderDetails).map(items => items.details).join('<br>') : order.line_items.map(this.addOrderDetails)[0].details,
      amount: order.total_amount,
      OrderedAt: ordered_time,
      DelieveredAt: done_time,
      Location: order.restaurant_name,
      Status: order.is_delivered,
      is_cancelled: false,
      order_id: order.order_id,
      payment_details: order.payment_details,
      total_amount: order.total_amount.toFixed(2),
      total_platform_fee: order.total_platform_fee.toFixed(2),
      total_restaurant_amount: order.total_restaurant_amount.toFixed(2),
    };
  }

  addOrderDetails(order) {
    return {
      details: `${order.item_name} ${order.item_quantity} X ${
        order.item_price
      } = ${order.item_quantity * order.item_price}`,
    };
  }

  deliverEntireOrder(order) {
    console.log('Delivering: ', order);
    let body = {
      restaurant_id: sessionStorage.getItem('restaurant_id'),
      order_id: order.order_id,
    };
    console.log('THis is body: ', body);
    this._ordersService.deliverEntireOrder(body).subscribe(
      (data) => {
        console.log(data);
        order.is_delivered = true;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  cancelOrder(order) {
    let dialogRef = this._dialog.open(ConfirmOrderCancelComponent, {
      data: order,
    })
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result == undefined){
          
        } else if(result.cancelled){
          order.is_cancelled = true
        }
      }
    );
  }

  displayMoreDetails(order) {
    console.log(order);
    let dialogRef = this._dialog.open(OrderMoreDetailsDialogComponent, {
      data: order,
    });
  }
}
