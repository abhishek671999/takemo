import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { OrderMoreDetailsDialogComponent } from '../../shared/order-more-details-dialog/order-more-details-dialog.component';
import { RulesService } from 'src/app/shared/services/roles/rules.service';
import { switchMap } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { HttpParams } from '@angular/common/http';
import { dateUtils } from 'src/app/shared/utils/date_utils';

@Component({
  selector: 'app-current-orders',
  templateUrl: './current-orders.component.html',
  styleUrls: ['./current-orders.component.css'],
})
export class CurrentOrdersComponent {
  constructor(
    private _ordersService: OrdersService,
    private _dialog: MatDialog,
    private _ruleService: RulesService,
    private dateUtils: dateUtils
  ) {}

  length = 50;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  timeFrames = [
    { displayValue: 'Today', actualValue: 'today' },
    { displayValue: 'This week', actualValue: 'this_week' },
    { displayValue: 'This month', actualValue: 'this_month' },
    { displayValue: 'Last month', actualValue: 'last_month' },
    { displayValue: 'Calendar', actualValue: 'custom' }, //future
  ];

  restaurantList = [
    // { displayValue: 'All', restaurant_id: 0},
    { displayValue: 'Amulya Kitchen', restaurant_id: 1 },
    { displayValue: 'Amrit Kitchenen', restaurant_id: 2 },
  ];

  selectedTimeFrame = this.timeFrames[0];
  selectedRestaurant: number = this.restaurantList[0].restaurant_id;
  selectedRule;
  loadView = false;

  displayedColumns: string[] = [
    'Order No',
    'Order details',
    'Amount',
    'Ordered By',
    'Details',
  ];

  ruleList = [];
  tableLoaded = false;
  public currentOrders = [];
  public currentOrdersDataSource = new MatTableDataSource(this.currentOrders);

  ngOnInit() {
    this._ruleService
      .getAllRules()
      .pipe(
        switchMap((data: any) => {
          console.log('Rules data', data);
          data['rules'].forEach((element) => {
            this.ruleList.push({
              rule_id_list: element.id,
              rule_name: element.name,
            });
          });
          this.selectedRule = this.ruleList[0].rule_id_list;
          this.loadView = true;
          let body = this.prepareRequestBodyRestaurantOrders();
          return this._ordersService.getRestaurantOrdersForAdmins(body);
        })
      )
      .subscribe(
        (data) => {
          console.log('Current orders: ', data);
          this.unparseResponse(data);
          this.tableLoaded = true;
        },
        (error) => {
          console.log('Error: ', error);
        }
      );
  }

  prepareRequestBodyRestaurantOrders() {
    let body = {
      restaurant_id: this.selectedRestaurant,
      rule_id_list: Array.isArray(this.selectedRule)
        ? this.selectedRule
        : [this.selectedRule],
      time_frame: this.selectedTimeFrame.actualValue,
    };
    if (this.selectedTimeFrame.actualValue == 'custom') {
      if (this.range.value.start && this.range.value.end) {
        body['start_date'] = this.dateUtils.getStandardizedDateFormate(
          this.range.value.start
        );
        body['end_date'] = this.dateUtils.getStandardizedDateFormate(
          this.range.value.end
        );
      } else {
        body = null;
      }
    }
    return body;
  }

  getRestaurantCurrentForAdminsOrders() {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('offset', this.pageIndex * this.pageSize);
    httpParams = httpParams.append(
      'limit',
      this.pageIndex * this.pageSize + this.pageSize
    );
    let body = this.prepareRequestBodyRestaurantOrders();
    if (body) {
      this._ordersService.getRestaurantOrdersForAdmins(body, httpParams).subscribe(
        (data) => {
          console.log('Current orders: ', data);
          this.unparseResponse(data);
          this.tableLoaded = true;
          this.length = data['no_of_orders'];
        },
        (error) => {
          console.log('Error: ', error);
          this.tableLoaded = true;
        }
      );
    }
  }

  unparseResponse(data) {
    this.currentOrders = [];
    this.currentOrdersDataSource.data = this.currentOrders;
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

  displayMoreDetails(order) {
    console.log(order);
    let dialogRef = this._dialog.open(OrderMoreDetailsDialogComponent, {
      data: order,
    });
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
    this.tableLoaded = false;
    this.getRestaurantCurrentForAdminsOrders();
  }

  handlePageEvent(e: PageEvent) {
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.getRestaurantCurrentForAdminsOrders();
  }
}
