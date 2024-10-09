import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { dateUtils } from 'src/app/shared/utils/date_utils';
import { OrderMoreDetailsDialogComponent } from '../../../shared/order-more-details-dialog/order-more-details-dialog.component';
import { ConfirmOrderCancelComponent } from '../../dialogbox/confirm-order-cancel/confirm-order-cancel.component';
import { HttpParams } from '@angular/common/http';
import { sessionWrapper } from 'src/app/shared/site-variable';

@Component({
  selector: 'app-rejected-orders',
  templateUrl: './rejected-orders.component.html',
  styleUrls: ['./rejected-orders.component.css'],
})
export class RejectedOrdersComponent {
  constructor(
    private _ordersService: OrdersService,
    private _dialog: MatDialog,
    private __sessionWrapper: sessionWrapper
  ) {}

  displayedColumns: string[] = [
    'Order No',
    'Order details',
    'Status',
    'Amount',
    'Ordered By',
    // 'Cancel', temp disabled
    'Details',
  ];

  length = 50;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  restaurantId = this.__sessionWrapper.getItem('restaurant_id');

  public showSpinner = true;
  public currentOrders = [];
  public currentOrdersDataSource = new MatTableDataSource(this.currentOrders);
  public orderStatusOptions = [
    { displayValue: 'New order', actualValue: 'unconfirmed' },
    { displayValue: 'Confirmed', actualValue: 'confirmed' },
    { displayValue: 'Delivered', actualValue: 'delivered' },
    { displayValue: 'Rejected', actualValue: 'rejected' },
  ];

  ngOnInit() {
    this.getEcomOrders();
  }

  getEcomOrders() {
    this.showSpinner = true;
    let body = {
      restaurant_id: this.__sessionWrapper.getItem('restaurant_id'),
      order_status: 'rejected',
    };
    let httpParams = new HttpParams();
    httpParams = httpParams.append('offset', this.pageIndex * this.pageSize);
    httpParams = httpParams.append(
      'limit',
      this.pageIndex * this.pageSize + this.pageSize
    );
    this._ordersService.getEcomOrders(body, httpParams).subscribe(
      (data) => {
        console.log('Current orders: ', data);
        this.length = data['no_of_orders'];
        this.unparseResponse(data);
        this.showSpinner = false;
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
    console.log(this.currentOrders);
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
          ? order.line_items
              .map(this.addOrderDetails)
              .map((items) => items.details)
              .join('<br>')
          : order.line_items.map(this.addOrderDetails)[0].details,
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
      ordered_by: order.ordered_by,
      orderStatus: order.order_status,
      user_name: order.user_name,
      order_address: order.order_address,
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
    let body = {
      restaurant_id: this.__sessionWrapper.getItem('restaurant_id'),
      order_id: order.order_id,
    };
    console.log('THis is body: ', body);
    this._ordersService.deliverEntireOrder(body).subscribe(
      (data) => {
        console.log(data);
        order.is_delivered = true;
        this.ngOnInit();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  cancelOrder(order) {
    let dialogRef = this._dialog.open(ConfirmOrderCancelComponent, {
      data: order,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == undefined) {
      } else if (result.cancelled) {
        order.is_cancelled = true;
        this.ngOnInit();
      }
    });
  }

  displayMoreDetails(order) {
    console.log(order);
    let dialogRef = this._dialog.open(OrderMoreDetailsDialogComponent, {
      data: order,
    });
  }

  updateStatus(element) {
    console.log(element);
    let body = {
      restaurant_id: this.__sessionWrapper.getItem('restaurant_id'),
      order_id: element.order_id,
      order_status: element.orderStatus,
    };
    this._ordersService.updateEcomOrderStatus(body).subscribe(
      (data) => {
        console.log(data);
        this.ngOnInit();
      },
      (error) => alert(error)
    );
  }

  handlePageEvent(e: PageEvent) {
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.getEcomOrders();
  }
}
