import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { OrderMoreDetailsDialogComponent } from '../../shared/order-more-details-dialog/order-more-details-dialog.component';
import { RulesService } from 'src/app/shared/services/roles/rules.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-current-orders',
  templateUrl: './current-orders.component.html',
  styleUrls: ['./current-orders.component.css']
})
export class CurrentOrdersComponent {
  constructor(
    private _ordersService: OrdersService,
    private _dialog: MatDialog,
    private _ruleService: RulesService
  ) {}
  
  timeFrames = [
    {displayValue: 'Today', actualValue: 'today' },
    {displayValue: 'This week', actualValue: 'this_week' },
    {displayValue: 'This month', actualValue: 'this_month' },
    { displayValue: 'Last month', actualValue: 'last_month'}, //future
  ]
  
  restaurantList = [
    // { displayValue: 'All', restaurant_id: 0},
    { displayValue: 'Amulya Kitchen', restaurant_id: 1},
    { displayValue: 'Tikkad kitchen', restaurant_id: 2}
  ]

  selectedTimeFrames: string = this.timeFrames[0].actualValue
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

  ruleList = []
  tableLoaded = false
  public currentOrders = [];
  public currentOrdersDataSource = new MatTableDataSource(this.currentOrders);

  ngOnInit() {

    this._ruleService.getAllRules().pipe(
      switchMap( (data: any) => {
        console.log('Rules data', data)
        data['rules'].forEach(element => {
          this.ruleList.push({'rule_id_list': element.id, 'rule_name': element.name})
        });
        this.selectedRule = this.ruleList[0].rule_id_list
        this.loadView = true
        let body = this.prepareRequestBodyRestaurantOrders()
        return this._ordersService.getRestaurantOrdersForAdmins(body)
      })
    ).subscribe(
      (data) => {
        console.log('Current orders: ', data);
        this.unparseResponse(data);
      },
      (error) => {
        console.log('Error: ', error);
      }
    )
  }

  prepareRequestBodyRestaurantOrders(){
    let body = {
      restaurant_id: this.selectedRestaurant,
      rule_id_list:  Array.isArray(this.selectedRule) ? this.selectedRule: [this.selectedRule],
      time_frame: this.selectedTimeFrames,
      start_date: '',
      end_date: '',
    };
    return body
  }

  getRestaurantCurrentForAdminsOrders(){
    let body = this.prepareRequestBodyRestaurantOrders()
    this._ordersService.getRestaurantOrdersForAdmins(body).subscribe(
      (data) => {
        console.log('Current orders: ', data);
        this.unparseResponse(data);
        this.tableLoaded = true
      },
      (error) => {
        console.log('Error: ', error);
        this.tableLoaded = true
      }
    );
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
      ordered_by: order.ordered_by
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

  onValueChange(){
    this.tableLoaded = false
    this.getRestaurantCurrentForAdminsOrders()
    
  }


}
