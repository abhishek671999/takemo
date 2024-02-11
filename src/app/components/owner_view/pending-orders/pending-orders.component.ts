import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { DeliveryOrderDialogComponent } from '../delivery-order-dialog/delivery-order-dialog.component';
import { Observable,Subscription, interval  } from 'rxjs';
import { CounterService } from 'src/app/shared/services/inventory/counter.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-pending-orders',
  templateUrl: './pending-orders.component.html',
  styleUrls: ['./pending-orders.component.css']
})
export class PendingOrdersComponent {

  constructor(private _orderService: OrdersService, 
    private _dialog: MatDialog,
    private __counterService: CounterService){}

  orderList = [];
  currentOrders;
  updateSubscription: Subscription;
  refreshInterval = 5 // seconds
  public showSpinner = true;
  public firstPageLoad = true

  counters = []
  selectedCounterId;

  ngOnInit(){
    this.getCurrentOrders()
    this.firstPageLoad = false
    this.updateSubscription = interval(this.refreshInterval * 1000).subscribe(
      (val) => { this.getCurrentOrders()});
    this.__counterService.getRestaurantCounter(sessionStorage.getItem('restaurant_id')).subscribe(
      data => {
        this.counters = data['counters']
      },
      error => {
        console.log('Couldnt log counters')
      }
    )
  }

  getCurrentOrders(){
    this.showSpinner = true
    let httpParams = new HttpParams()
    httpParams = httpParams.append('restaurant_id', sessionStorage.getItem('restaurant_id'))
    if(this.selectedCounterId){
      httpParams = httpParams.append('counter_id', this.selectedCounterId)
    }
    this._orderService.getCurrentOrdersCards(httpParams).subscribe(
      data =>{ 
        this.currentOrders = data
        this.orderList = []
        for (let item in this.currentOrders){
          this.orderList.push({obj: this.currentOrders[item]['pending_order'], name: item, quantity: this.currentOrders[item]['pending_order'].length})
        }
        this.showSpinner = false
      }, 
      error => {
        console.log('Error while getting data: ', error)
      }
    )
  }


  itemClicked(item){
    console.log('This item is clicked: ', item)
    let dialogRef = this._dialog.open(DeliveryOrderDialogComponent, {data: item})
    dialogRef.afterClosed().subscribe( () => this.ngOnInit())
  }

  ngOnDestroy(){
    this.updateSubscription.unsubscribe()
  }
}
