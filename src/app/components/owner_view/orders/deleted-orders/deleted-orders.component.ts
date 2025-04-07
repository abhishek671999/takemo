import { LiveAnnouncer } from '@angular/cdk/a11y';
import { HttpParams } from '@angular/common/http';
import { Component, inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OrderMoreDetailsDialogComponent } from 'src/app/components/shared/order-more-details-dialog/order-more-details-dialog.component';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { meAPIUtility } from 'src/app/shared/site-variable';
import { dateUtils } from 'src/app/shared/utils/date_utils';

@Component({
  selector: 'app-deleted-orders',
  templateUrl: './deleted-orders.component.html',
  styleUrls: ['./deleted-orders.component.css']
})
export class DeletedOrdersComponent {
  constructor(
      private _orderService: OrdersService,
      private _dialog: MatDialog,
      private dateUtils: dateUtils,
      private meUtility: meAPIUtility
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
  
    displayedColumns: string[] = ['orderno','Order details','Amount','ordered_by','OrderedAt','Details'];
    tableDisplayColumns: string[]  = ['table_order_no', 'table_name', 'item_details_string', 'amount_with_gst', 'total_discount', 'amount_received', 'start_time', 'end_time']
  
    public isTaxInclusive: number
    public taxPercentage: number
    public showSpinner = true;
    public cancelledOrders = [];
    public fulfilledOrdersDataSource = new MatTableDataSource();
    public tableFulfilledOrdersDataSource = new MatTableDataSource()
    public restaurantId: number;
    public istableManagementEnabled: boolean = false
  
    selectedTimeFrame = this.timeFrames[0];
    range = new FormGroup({
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null),
    });
  
    ngOnInit() {
      this.meUtility.getRestaurant().subscribe(
        (restaurant) => {
          this.istableManagementEnabled = restaurant['table_management']
          this.restaurantId = restaurant['restaurant_id']
          this.isTaxInclusive = restaurant['tax_inclusive']
          if (restaurant['role_name'] == 'restaurant_staff') this.timeFrames = this.timeFrames.slice(0,2)
          this.taxPercentage = this.isTaxInclusive? 0: Number(restaurant['tax_percentage'])
          if(this.istableManagementEnabled) this.getRestaurantTableOrders()
          else this.getRestaurantCurrentOrders(this.getRestaurantOrdersAPIBody());
        }
      )
  
    }
  
    ngAfterViewInit(){
      this.fulfilledOrdersDataSource.sort = this.sort
      this.tableFulfilledOrdersDataSource.sort = this.sort
    }
  
    getRestaurantTableOrders(){
      this.showSpinner = true
      let body = this.getRestaurantOrdersAPIBody()
      body['offset'] =  this.pageIndex * this.pageSize
      body['limit'] = this.pageIndex * this.pageSize + this.pageSize
      this._orderService.getFulfilledTableOrders(body).subscribe(
        (data) => {
          data['table_orders'].forEach((order) => {
            order['item_details_string'] = this.parseTableOrders(order)
            order['amount_received'] = Number(Math.round(order['total_amount'] - order['total_discount']))
          })
          this.tableFulfilledOrdersDataSource.data = data['table_orders']
          this.showSpinner = false;
          this.length = data['no_of_records'];
        },
        (error) => {
          this.showSpinner = false;
          console.log(error)
        }
      )
    }
  
    parseTableOrders(order){
      let tableOrder: string = ''
      order['item_details'].forEach((lineItem) => {
        tableOrder += `${lineItem.item_name} ${lineItem.item_quantity} X ${
          lineItem.item_price
        } = ${lineItem.item_quantity * lineItem.item_price} <br>`
      })
      return tableOrder
    }
  
    
  
    getRestaurantOrdersAPIBody() {
      let body = {
        restaurant_id: this.restaurantId,
        is_deleted: true,
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
      if(this.istableManagementEnabled) this.getRestaurantTableOrders()
      else this.getRestaurantCurrentOrders(this.getRestaurantOrdersAPIBody());
    }
  
    handlePageEvent(e: PageEvent) {
      this.length = e.length;
      this.pageSize = e.pageSize;
      this.pageIndex = e.pageIndex;
      if(this.istableManagementEnabled) this.getRestaurantTableOrders()
        else this.getRestaurantCurrentOrders(this.getRestaurantOrdersAPIBody());
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
      this.fulfilledOrdersDataSource.data = this.cancelledOrders;
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
        tax_amount: order.tax_amount
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
      this.fulfilledOrdersDataSource.filter = (
        filterValue as HTMLInputElement
      ).value
        .trim()
        .toLowerCase();
    }
  
    onClick() {
      console.log(this.fulfilledOrdersDataSource);
    }
  
    displayMoreDetails(order) {
      console.log(order);
      order['redirectingFrom'] = 'deleted_orders';
      let dialogRef = this._dialog.open(OrderMoreDetailsDialogComponent, {
        data: order,
      });
      dialogRef.afterClosed().subscribe(
        (data: any) => {
          if(data?.refresh){
            this.ngOnInit()
          }
        }
      )
    }
  
  
    announceSortChange(sortState: Sort) {
      if (sortState.direction) {
        this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
      } else {
        this._liveAnnouncer.announce('Sorting cleared');
      }
    }
}
