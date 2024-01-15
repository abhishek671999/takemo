import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { DeliveryOrderDialogComponent } from '../delivery-order-dialog/delivery-order-dialog.component';
import { Observable,Subscription, interval  } from 'rxjs';

@Component({
  selector: 'app-pending-orders',
  templateUrl: './pending-orders.component.html',
  styleUrls: ['./pending-orders.component.css']
})
export class PendingOrdersComponent {

  constructor(private _orderService: OrdersService, 
    private _dialog: MatDialog){}

  orderList = [];
  currentOrders;
  updateSubscription: Subscription;
  refreshInterval = 5 // seconds
  public showSpinner = true;

  ngOnInit(){
    this.getCurrentOrders()
    this.updateSubscription = interval(this.refreshInterval * 1000).subscribe(
      (val) => { this.getCurrentOrders()});
  }

  getCurrentOrders(){
    this.showSpinner = true
    let params = {'restaurant_id': sessionStorage.getItem('restaurant_id')}
    this._orderService.getCurrentOrdersCards(params).subscribe(
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
  }

  ngOnDestroy(){
    this.updateSubscription.unsubscribe()
  }
}
