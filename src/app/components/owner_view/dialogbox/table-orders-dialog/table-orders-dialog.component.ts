import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { PointOfSaleComponent } from '../../point-of-sale/point-of-sale.component';
import { Router } from '@angular/router';
import { TablesService } from 'src/app/shared/services/table/tables.service';
import { ErrorMsgDialogComponent } from 'src/app/components/shared/error-msg-dialog/error-msg-dialog.component';
import { SuccessMsgDialogComponent } from 'src/app/components/shared/success-msg-dialog/success-msg-dialog.component';

@Component({
  selector: 'app-table-orders-dialog',
  templateUrl: './table-orders-dialog.component.html',
  styleUrls: ['./table-orders-dialog.component.css'],
})
export class TableOrdersDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<TableOrdersDialogComponent>,
    private __orderService: OrdersService,
    private __matDialog: MatDialog,
    private __router: Router,
    private __tableService: TablesService
  ) {}

  tableOccupied = false;
  restaurantId = Number(sessionStorage.getItem('restaurant_id'));

  orders;
  totalAmount;
  ngOnInit() {
    let body = {
      table_id: this.data.table_id,
    };
    this.__orderService.getTableOrders(body).subscribe(
      (data) => {
        this.orders = data['orders']['item_details'];
        this.tableOccupied = this.orders.length > 0;
        this.totalAmount = data['orders']['total_amount'];
        console.log('Ordres: ', this.orders)
      },
      (error) => {
        this.__matDialog.open(ErrorMsgDialogComponent, {
          data: { msg: 'Failed to get table orders' },
        });
      }
    );
  }

  posOrder() {
    sessionStorage.setItem('table_id', this.data.table_id);
    sessionStorage.setItem('table_name', this.data.table_name);
    this.__router.navigate(['owner/point-of-sale']);
    this.dialogRef.close();
  }

  markPaymentDone() {
    let body = {
      table_id: this.data.table_id,
    };
    this.__tableService.closeTableSession(body).subscribe(
      (data) => {
        this.__matDialog.open(SuccessMsgDialogComponent, {
          data: { msg: 'Marked as payment done' },
        });
        this.dialogRef.close();
      },
      (error) => {
        this.__matDialog.open(ErrorMsgDialogComponent, {
          data: { msg: 'Request failed' },
        });
      }
    );
  }

  printBill() {}

  addItem(order) {
    let body = {
      restaurant_id: this.restaurantId,
      line_item_ids: order.line_item_ids,
      action: 1,
    };
    this.__orderService.updateLineItem(body).subscribe(
      (data) => {
        order.quantity += 1
        order.line_item_price += order.item_price
        this.totalAmount += order.item_price
      },
      (error) => {
        this.__matDialog.open(ErrorMsgDialogComponent, {data: {msg: 'Failed to add item'}})
      }
    );
  }

  subItem(order) {
    if (order.quantity > 0) {
      let body = {
        restaurant_id: this.restaurantId,
        line_item_ids: order.line_item_ids,
        action: -1,
      };
      this.__orderService.updateLineItem(body).subscribe(
        (data) => {
          order.quantity -= 1
          order.line_item_price -= order.item_price
          this.totalAmount -= order.item_price
        },
        (error) => {
          this.__matDialog.open(ErrorMsgDialogComponent, {data: {msg: 'Failed to subtract item'}})
        }
      );
    }
  }

  deleteItem(order) {
    let body = {
      "restaurant_id": this.restaurantId,
      "line_item_ids": order.line_item_ids
    }
    this.__orderService.deleteLineItem(body).subscribe(
      data => {
        this.orders = this.orders.filter((each_order) => each_order.line_item_ids !== order.line_item_ids)
        this.totalAmount -= order.line_item_price
      },
      error => {
        this.__matDialog.open(ErrorMsgDialogComponent, {data: {msg: 'Failed to delete item'}})
      }
    )
  }

  arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
  
    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.
  
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
}
