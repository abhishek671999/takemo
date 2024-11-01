import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { DeliveryOrderDialogComponent } from '../../dialogbox/delivery-order-dialog/delivery-order-dialog.component';
import { Observable, Subscription, interval } from 'rxjs';
import { CounterService } from 'src/app/shared/services/inventory/counter.service';
import { HttpParams } from '@angular/common/http';
import { DeliverAllOrdersDialogComponent } from '../../dialogbox/deliver-all-orders-dialog/deliver-all-orders-dialog.component';
import { meAPIUtility } from 'src/app/shared/site-variable';

@Component({
  selector: 'app-pending-orders',
  templateUrl: './pending-orders.component.html',
  styleUrls: ['./pending-orders.component.css'],
})
export class PendingOrdersComponent {
  constructor(
    private _orderService: OrdersService,
    private _dialog: MatDialog,
    private __counterService: CounterService,
    private meUtility: meAPIUtility
  ) {}

  orderList = [];
  currentOrders;
  updateSubscription: Subscription;
  refreshInterval = 5; // seconds
  public showSpinner = true;
  public firstPageLoad = true;
public restaurantId: number
  counters = [];
  selectedCounterId;

  ngOnInit() {
    this.meUtility.getRestaurant().subscribe(
      (restaurant) => {
        this.restaurantId = restaurant['restaurant_id']
        this.getCurrentOrders();
        this.firstPageLoad = false;
        this.updateSubscription = interval(this.refreshInterval * 1000).subscribe(
          (val) => {
            this.getCurrentOrders();
          }
        );
        this.fetchCounters()
      }
    )
    
  }
  
  fetchCounters(){
    this.__counterService
      .getRestaurantCounter(this.restaurantId)
      .subscribe(
        (data) => {
          this.counters = data['counters'];
        },
        (error) => {
          console.log('Couldnt log counters');
        }
      ); 
    }

  getCurrentOrders() {
    this.showSpinner = true;
    let httpParams = new HttpParams();
    httpParams = httpParams.append(
      'restaurant_id',
      this.restaurantId
    );
    if (this.selectedCounterId) {
      httpParams = httpParams.append('counter_id', this.selectedCounterId);
    }
    this._orderService.getCurrentOrdersCards(httpParams).subscribe(
      (data) => {
        this.currentOrders = data;
        this.orderList = [];
        for (let item in this.currentOrders) {
          this.orderList.push({
            obj: this.currentOrders[item]['pending_order'],
            name: item,
            quantity: this.currentOrders[item]['pending_order'].length,
            parcelQuantity: this.currentOrders[item]['pending_order'].filter(
              (ele) => ele.parcel
            ).length,
          });
        }
        this.showSpinner = false;
      },
      (error) => {
        console.log('Error while getting data: ', error);
      }
    );
  }

  deliverAllOrders() {
    let data = this.selectedCounterId
      ? {
          counter: this.counters.filter(
            (x) => x.counter_id == this.selectedCounterId
          )[0],
        }
      : null;
    let dialog = this._dialog.open(DeliverAllOrdersDialogComponent, {
      data: data,
    });
    dialog.afterClosed().subscribe(() => {
      this.updateSubscription.unsubscribe();
      this.ngOnInit();
    });
  }

  itemClicked(item) {
    console.log('This item is clicked: ', item);
    let dialogRef = this._dialog.open(DeliveryOrderDialogComponent, {
      data: item,
      height: 'auto',
      width: 'auto',
    });
    dialogRef.afterClosed().subscribe(() => {
      this.updateSubscription.unsubscribe();
      this.ngOnInit();
    });
  }

  ngOnDestroy() {
    this.updateSubscription.unsubscribe();
  }
}
