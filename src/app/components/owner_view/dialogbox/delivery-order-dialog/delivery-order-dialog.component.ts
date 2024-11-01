import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { ConfirmActionDialogComponent } from '../../../shared/confirm-action-dialog/confirm-action-dialog.component';
import { ErrorMsgDialogComponent } from 'src/app/components/shared/error-msg-dialog/error-msg-dialog.component';
import { meAPIUtility } from 'src/app/shared/site-variable';

@Component({
  selector: 'app-delivery-order-dialog',
  templateUrl: './delivery-order-dialog.component.html',
  styleUrls: ['./delivery-order-dialog.component.css'],
})
export class DeliveryOrderDialogComponent {
  constructor(
    private _orderService: OrdersService,
    @Inject(MAT_DIALOG_DATA) public data,
    private _dialogRef: MatDialogRef<DeliveryOrderDialogComponent>,
    private dialog: MatDialog,
    private meUtiltiy: meAPIUtility
  ) {
    console.log('Data received: ', data);
    data.obj.forEach((ele) => {
      ele['is_delivered'] = false;
    });
  }

  public restaurantId: number

  ngOnInit() {
    this.meUtiltiy.getRestaurant().subscribe(
      (restaurant) => {
        this.restaurantId = restaurant['restaurant_id']
      }
    )
    this.data.obj = this.data.obj.filter((ele) => {
      return ele.is_delivered == false;
    });
    if (this.data.obj.length == 0) {
      this._dialogRef.close();
    }
    console.log('After filter: ', this.data, this.data.obj.length);
  }

  updateStatusToDelivered(order) {
    let body = {
      restaurant_id: this.restaurantId,
      line_item_id_list: [order.line_item_id],
      status: !order.is_ready ? 'delivered' : 'ready_and_delivered',
    };
    console.log('Delivered: ', body);
    this._orderService.updateOrderStatus(body).subscribe(
      (data) => {
        order.is_delivered = true;
        order.is_ready = true;
        this.ngOnInit();
      },
      (error) => {
        this.dialog.open(ErrorMsgDialogComponent, {
          data: { msg: 'Error while delivering orders' }
        });
      }
    );
  }

  updateStatusToReady(order) {
    let body = {
      restaurant_id: this.restaurantId,
      line_item_id_list: [order.line_item_id],
      status: 'ready',
    };
    console.log('Ready: ', body);
    this._orderService.updateOrderStatus(body).subscribe(
      (data) => {
        order.is_ready = !order.is_ready;
      },
      (error) => {
        this.dialog.open(ErrorMsgDialogComponent, {
          data: { msg: 'Error while delivering orders' }
        });
      }
    );
  }

  deliverAllOrders() {
    let body = {
      restaurant_id: this.restaurantId,
      line_item_id_list: this.data.obj.map((ele) => ele.line_item_id),
      status: 'delivered',
    };
    let dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      data: `Are you sure want to delete all order of ${this.data.name}`,
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data['select']) {
        this._orderService.updateOrderStatus(body).subscribe(
          (data) => {
            this._dialogRef.close();
          },
          (error) => {
            this.dialog.open(ErrorMsgDialogComponent, {
              data: { msg: 'Error while delivering orders' }
            });
          }
        );
      }
    });
  }

}
