import { Component, inject, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { OrderMoreDetailsDialogComponent } from '../../../shared/order-more-details-dialog/order-more-details-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { dateUtils } from 'src/app/shared/utils/date_utils';
import { HttpParams } from '@angular/common/http';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { sessionWrapper } from 'src/app/shared/site-variable';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-orders-history',
  templateUrl: './orders-history.component.html',
  styleUrls: ['./orders-history.component.css'],
})
export class OrdersHistoryComponent {
  constructor(
    private _orderService: OrdersService,
    private _dialog: MatDialog,
    private dateUtils: dateUtils,
    private __sessionWrapper: sessionWrapper
  ) {}

  length = 50;
  pageSize = 30;
  pageIndex = 0;
  pageSizeOptions = [30, 40, 50];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  @ViewChild(MatSort)
  sort: MatSort = new MatSort;

  private _liveAnnouncer = inject(LiveAnnouncer);

  timeFrames = [
    { ViewValue: 'Today', actualValue: 'today' },
    { ViewValue: 'Yesterday', actualValue: 'yesterday'},
    { ViewValue: 'This week', actualValue: 'this_week' },
    { ViewValue: 'This month', actualValue: 'this_month' },
    { ViewValue: 'Last month', actualValue: 'last_month' },
    { ViewValue: 'Calendar', actualValue: 'custom' },
  ];

  displayedColumns: string[] = [
    'orderno',
    'Order details',
    'Amount',
    'ordered_by',
    'OrderedAt',
    'Details',
  ];
  public isTaxInclusive = this.__sessionWrapper.isTaxInclusive()
  public taxPercentage = this.isTaxInclusive? 0: Number(this.__sessionWrapper.getItem('tax_percentage'))
  public showSpinner = true;
  public cancelledOrders = [];
  public cancelledOrdersDataSource = new MatTableDataSource();

  selectedTimeFrame = this.timeFrames[0];
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  ngOnInit() {
    this.getRestaurantCurrentOrders(this.getRestaurantOrdersAPIBody());
  }

  ngAfterViewInit(){
    this.cancelledOrdersDataSource.sort = this.sort
  }

  getRestaurantOrdersAPIBody() {
    let body = {
      restaurant_id: this.__sessionWrapper.getItem('restaurant_id'),
    };
    if (this.selectedTimeFrame.actualValue == 'custom') {
      if (this.range.value.start && this.range.value.end) {
        (body['time_frame'] = this.selectedTimeFrame.actualValue),
          (body['start_date'] = this.dateUtils.getStandardizedDateFormate(
            this.range.value.start
          )),
          (body['end_date'] = this.dateUtils.getStandardizedDateFormate(
            this.range.value.end
          ));
      } else {
        body = null;
        this.showSpinner = false
      }
    } else {
      body['time_frame'] = this.selectedTimeFrame.actualValue;
    }
    return body;
  }

  onValueChange() {
    this.pageIndex = 0;
    let field = document.getElementById('calendarInputField');
    if (this.selectedTimeFrame.actualValue == 'custom') {
      console.log(this.range.value);
      field.classList.remove('hidden');
    } else {
      field.classList.add('hidden');
    }
    this.getRestaurantCurrentOrders(this.getRestaurantOrdersAPIBody());
  }

  handlePageEvent(e: PageEvent) {
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.getRestaurantCurrentOrders(this.getRestaurantOrdersAPIBody());
  }

  getRestaurantCurrentOrders(body) {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('offset', this.pageIndex * this.pageSize);
    httpParams = httpParams.append(
      'limit',
      this.pageIndex * this.pageSize + this.pageSize
    );
    this.showSpinner = true;
    if (body) {
      this._orderService.getRestaurantOrders(body, httpParams).subscribe(
        (data) => {
          console.log(data);
          this.unparseResponse(data);
          this.showSpinner = false;
          this.length = data['no_of_orders'];

        },
        (error) => {
          console.log(error);
          this.showSpinner = false;
        }
      );
    }
  }

  unparseResponse(data) {
    this.cancelledOrders = [];
    data['order_list'].map((ele) => {
      this.cancelledOrders.push(this.unParsedOrder(ele));
    });
    this.cancelledOrdersDataSource.data = this.cancelledOrders;
  }

  unParsedOrder(order) {
    let done_time = order.done_time
    let ordered_time = order.ordered_time
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
      DeliveredAt: done_time,
      Location: order.restaurant_name,
      Status: order.is_delivered ? 'Delivered' : 'Not-delivered',
      order_id: order.order_id,
      payment_details: order.payment_details,
      total_amount: order.total_amount.toFixed(2),
      total_platform_fee: order.total_platform_fee.toFixed(2),
      total_restaurant_amount: order.total_restaurant_amount.toFixed(2),
      ordered_by: order.ordered_by,
      parcel_charges: order.parcel_charges,
      user_name: order.user_name,
    };
  }

  addOrderDetails(order) {
    return {
      details: `${order.item_name} ${order.item_quantity} X ${
        order.item_price
      } = ${order.item_quantity * order.item_price}`,
    };
  }

  applyFilter(filterValue) {
    this.cancelledOrdersDataSource.filter = (
      filterValue as HTMLInputElement
    ).value
      .trim()
      .toLowerCase();
  }

  onClick() {
    console.log(this.cancelledOrdersDataSource);
  }

  displayMoreDetails(order) {
    console.log(order);
    let dialogRef = this._dialog.open(OrderMoreDetailsDialogComponent, {
      data: order,
    });
  }


  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
