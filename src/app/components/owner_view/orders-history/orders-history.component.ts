import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { OrderMoreDetailsDialogComponent } from '../../shared/order-more-details-dialog/order-more-details-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { dateUtils } from 'src/app/shared/utils/date_utils';


@Component({
  selector: 'app-orders-history',
  templateUrl: './orders-history.component.html',
  styleUrls: ['./orders-history.component.css']
})
export class OrdersHistoryComponent {

  constructor(private _orderService: OrdersService, private _dialog: MatDialog, private dateUtils: dateUtils){}

  timeFrames = [
    {ViewValue: 'Today', actualValue: 'today'},
    {ViewValue: 'This week', actualValue: 'this_week'},
    {ViewValue: 'This month', actualValue: 'this_month'},
    {ViewValue: 'Last month', actualValue: 'last_month'},
    {ViewValue: 'Calendar', actualValue: 'calendar'}
  ]

  displayedColumns: string[] = [
    'Order No',
    'Order details',
    'Amount',
    'Ordered By',
    'Details',
  ];

  
  public cancelledOrders = []
  public cancelledOrdersDataSource = new MatTableDataSource(this.cancelledOrders)

  selectedTimeFrame = this.timeFrames[0]
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  ngOnInit(){
    this.getRestaurantCurrentOrders()
  }


  dateChanged(){
    console.log(this.range.value.start, this.range.value.end, typeof(this.range.value.start), this.range.value)
    if(this.range.value.start && this.range.value.end){
      let body = {
        "restaurant_id": sessionStorage.getItem('restaurant_id'),
        "_c": "rule_id is optional",
        "_c1": "possible options for time_frame are today, this_week, this_month",
        "start_date": this.dateUtils.getStandardizedDateFormate(this.range.value.start),
        "end_date": this.dateUtils.getStandardizedDateFormate(this.range.value.end),
        "_c3": "if the above both are given then time_frame is not needed"
    }
    console.log(body)
    this._orderService.getRestaurantOrders(body).subscribe(
      data => {
        console.log(data)
        this.unparseResponse(data)
      },
      error => {
        console.log(error)
      }
    )
    }
    
  }

  getRestaurantCurrentOrders(){
    let field = document.getElementById('calendarInputField')
    if(this.selectedTimeFrame.actualValue == 'calendar'){
      console.log(this.range.value)
      field.classList.remove('hidden')
    }else{
      field.classList.add('hidden')
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
    this._orderService.getRestaurantOrders(body).subscribe(
      data => {
        console.log(data)
        this.unparseResponse(data)
      },
      error => {
        console.log(error)
      }
    )
    }
  }


  unparseResponse(data){
    this.cancelledOrders = []
    data['order_list'].map(ele =>{
      this.cancelledOrders.push(this.unParsedOrder(ele))
    }
    )
    this.cancelledOrdersDataSource.data = this.cancelledOrders     
  }

  unParsedOrder(order){
    let done_time = order.done_time ? new Date(order.done_time).toLocaleString() : null
    let ordered_time = order.ordered_time ? new Date(order.ordered_time).toLocaleString() : null
    return { orderno : order.order_no,
      order_detail: order.line_items.length != 1? order.line_items.map(this.addOrderDetails).map(items => items.details).join('<br>') : order.line_items.map(this.addOrderDetails)[0].details,
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
      ordered_by: order.ordered_by
    }
  }


  addOrderDetails(order){
    return { details: `${order.item_name} ${order.item_quantity} X ${order.item_price} = ${(order.item_quantity*order.item_price)}`}
  }

  applyFilter(filterValue){
    this.cancelledOrdersDataSource.filter = (filterValue as HTMLInputElement).value.trim().toLowerCase()
  }

  onClick(){
    console.log(this.cancelledOrdersDataSource)
  }

  displayMoreDetails(order) {
    console.log(order);
    let dialogRef = this._dialog.open(OrderMoreDetailsDialogComponent, {
      data: order,
    });
  }
}
