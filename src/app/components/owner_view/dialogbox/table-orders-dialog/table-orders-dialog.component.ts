import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { PointOfSaleComponent } from '../../point-of-sale/point-of-sale.component';
import { Router } from '@angular/router';

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

  ) {}
  

  orders;
  totalPrice;
  ngOnInit() {
    let body = {
      "table_id": this.data.table_id
    }
    this.__orderService.getTableOrders(body).subscribe(
      data => {
        this.orders = data['orders']
        console.log('Orders: ', this.orders, data)
      },
      error => {
        alert('Failed to get table orders')
      }
    )
  }

  posOrder() {
    sessionStorage.setItem('table_id', this.data.table_id);
    sessionStorage.setItem('table_name', this.data.table_name)
    this.__router.navigate(['owner/point-of-sale']);
    this.dialogRef.close();
  }

  markPaymentDone() {
    
  }

  printBill() {
    
  }
}
