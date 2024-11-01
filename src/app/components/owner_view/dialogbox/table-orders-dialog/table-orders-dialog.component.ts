import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { Router } from '@angular/router';
import { TablesService } from 'src/app/shared/services/table/tables.service';
import { ErrorMsgDialogComponent } from 'src/app/components/shared/error-msg-dialog/error-msg-dialog.component';
import { SuccessMsgDialogComponent } from 'src/app/components/shared/success-msg-dialog/success-msg-dialog.component';
import { meAPIUtility } from 'src/app/shared/site-variable';
import { ConfirmActionDialogComponent } from 'src/app/components/shared/confirm-action-dialog/confirm-action-dialog.component';
import { RestaurantService } from 'src/app/shared/services/restuarant/restuarant.service';
import { Observable, of } from 'rxjs';
import { ReceiptPrintFormatter } from 'src/app/shared/utils/receiptPrint';
import { PrintConnectorService } from 'src/app/shared/services/printer/print-connector.service';
import { InputPasswordDialogComponent } from 'src/app/components/shared/input-password-dialog/input-password-dialog.component';
import { CounterService } from 'src/app/shared/services/inventory/counter.service';

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
    private restaurantService: RestaurantService,
    private __matDialog: MatDialog,
    private __router: Router,
    private __tableService: TablesService,
    private receiptPrintFormatter: ReceiptPrintFormatter,
    public printerConn: PrintConnectorService,
    private _counterService: CounterService,
    private meUtility: meAPIUtility
  ) {
    console.log(data)
  }
  counters = [];
  hasOrderedItems = false;
  restaurantId: number
  taxInclusive: boolean

  orders;
  totalAmount;
  isBillPrinted: boolean = false;
  isEditEnabled: boolean = false;
  totalAmountWithoutGst: number = 0
  totalAmountWithGst: number = 0

  ngOnInit() {
    this.meUtility.getRestaurant().subscribe(
      (restaurant) => {
        this.restaurantId = restaurant['restaurant_id']
        this.taxInclusive = restaurant['tax_inclusive']
        this.getTableOrders()
        this.fetchCounters()
      }
    )
  }

  getTableOrders(){
    let body = {
      table_id: this.data.table_id,
    };
    this.__orderService.getTableOrders(body).subscribe(
      (data) => {
        this.orders = data['orders']['item_details'];
        this.hasOrderedItems = this.orders.length > 0;
        this.totalAmount = data['orders']['total_amount'];
        this.isBillPrinted = data['orders']['bill_printed']
        this.calculateAmountWithoutTax()
        this.calculateAmountWithTax()
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

  verifyPassword(){
    let verifyPasswordObserver = new Observable((observer) => {
      let dialogRef = this.__matDialog.open(InputPasswordDialogComponent)
      dialogRef.afterClosed().subscribe(
        (data: any) => {
          if(data?.password){
            let body = {
              "restaurant_id": this.restaurantId,
              "password": data.password
            }
            this.restaurantService.validatePassword(body).subscribe(
              (data: any) => {
                observer.next({validated: true})
              },
              (error: any) => {
                observer.next({validated: false})
              }
            )
          }else{
            observer.next({validated: false})
          }
        },
    )
    })
    return verifyPasswordObserver
  }

  markBillasPaid(){
    let body = {
      "table_id": this.data.table_id,
    }
    this.__tableService.markBillPrinted(body).subscribe(
      (data: any) => {
        console.log('Marked')
      },
      (error: any) => {
        this.__matDialog.open(ErrorMsgDialogComponent, {data: {msg: 'Failed to mark print'}})
      }
    )
  }

  enableOrderEdit(){
      this.verifyPassword().subscribe(
        (data: any) => {
          if(data?.validated){
            this.isEditEnabled = true
          }else{
            this.isEditEnabled = false
          }
        },
        (error: any) => {
          console.log('this is error: ', error)
          this.__matDialog.open(ErrorMsgDialogComponent, {data: {msg: 'Incorrect password'}})
        }
      )
  }

  waiterKOTPrint(){
    let orderObj = {
      order_list: this.orders,
      total_amount: this.totalAmount,
      payment_mode: 'Table order',
      restaurant_id :this.restaurantId,
      table_name: this.data.table_name,
      waiter_name: this.data.waiter_name
    }
    this.receiptPrintFormatter.confirmedOrderObj = orderObj
    let printObj = this.receiptPrintFormatter.getWaiterCheckKOTText(this.counters)
    this.print(printObj)
  }
    
  requestPrintBill(){
    if(this.isBillPrinted){
      this.verifyPassword().subscribe(
        (data: any) => {
          if(data?.validated){
            this.printBill().subscribe(
              (data: any) => {
                if(data?.billPrinted) this.markBillasPaid()
              }
            )
          }
        }
      )
    }else{
      this.printBill().subscribe(
        (data: any) => {
          if(data?.billPrinted) this.markBillasPaid()
        }
      )
    }
  }


  printBill() {
    let statusObserver = new Observable((observer) => {
      let orderObj = {
        order_list: this.orders,
        total_amount: this.totalAmount,
        payment_mode: 'Table order',
        restaurant_id :this.restaurantId
      }
      this.receiptPrintFormatter.confirmedOrderObj = orderObj
      let printObj = this.receiptPrintFormatter.getCustomerPrintableText()
      this.print(printObj)
      this.isBillPrinted = true
      observer.next({billPrinted: true})
    })
    return statusObserver
  } 

  markPaymentDone() {
    let matdialogRef = this.__matDialog.open(ConfirmActionDialogComponent, {data: 'Close this table session?'})
    matdialogRef.afterClosed().subscribe(
      (data: any) => {
        if(data?.select){
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
      }
    )
  }

  print(printObjs){
    if(this.printerConn.usbSought){
      let printConnect = this.printerConn.printService.init();
      printObjs.forEach((ele) => {
        if (ele.text != '') {
          printConnect.writeCustomLine(ele);
        }
      });
      printConnect
        .feed(4)
        .cut()
        .flush();
        return true
    }else{
      return false
    }
  }

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
          order.line_item_price -= order.price
          this.totalAmount -= order.price
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

  calculateItemGST(item){
    let total = (item.tax_inclusive? item.price: (item.price * 1.05)) * (item.quantity + (item.parcel_quantity? item.parcel_quantity: 0));
    return total
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

  fetchCounters(){
    this._counterService
      .getRestaurantCounter(this.restaurantId)
      .subscribe(
        (data) => {
          console.log('counters available', data);
          this.counters = data['counters'];
        },
        (error) => {
          console.log('Error: ', error);
        }
      );
  }

  calculateAmountWithoutTax(){
    this.totalAmountWithoutGst = 0
    this.orders.forEach((item) => {
      this.totalAmountWithoutGst += (item.price * (item.quantity + (item.parcel_quantity? item.parcel_quantity: 0)));
    })
    this.totalAmountWithoutGst = Number(this.totalAmountWithoutGst.toFixed(2))
  }

  calculateAmountWithTax(){
    this.totalAmountWithGst = 0
    this.orders.forEach((item) => {
      this.totalAmountWithGst += (item.tax_inclusive? item.price: (item.price * 1.05)) * (item.quantity + (item.parcel_quantity? item.parcel_quantity: 0));
    })
    this.totalAmountWithGst = Number(Math.round(this.totalAmountWithGst))
  }

}
