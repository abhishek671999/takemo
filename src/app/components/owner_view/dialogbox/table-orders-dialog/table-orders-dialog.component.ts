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
import { Observable, of, switchMap } from 'rxjs';
import { ReceiptPrintFormatter } from 'src/app/shared/utils/receiptPrint';
import { PrintConnectorService } from 'src/app/shared/services/printer/print-connector.service';
import { InputPasswordDialogComponent } from 'src/app/components/shared/input-password-dialog/input-password-dialog.component';
import { CounterService } from 'src/app/shared/services/inventory/counter.service';
import { MoveTablesComponent } from '../move-tables/move-tables.component';
import { DiscountComponent } from 'src/app/components/shared/dialogbox/discount/discount.component';
import { dateUtils } from 'src/app/shared/utils/date_utils';

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
    private meUtility: meAPIUtility,
    private dateUtils: dateUtils
  ) {
    console.log(data)
    console.log('This is navigator online: ', navigator.onLine)
    clearInterval(this.data.pollingInterval)
    this.data.pollingInterval = null
  }
  counters = [];
  hasOrderedItems = false;
  restaurantId: number
  taxInclusive: boolean
  public isOnline = navigator.onLine

  orders;
  totalAmount;
  isBillPrinted: boolean = false;
  isEditEnabled: boolean = false;
  orderNo: number;
  totalAmountWithoutGst: number = 0
  subtotalAmountWithoutGst: number = 0
  totalAmountWithGst: number = 0
  subtotalAmountWithGst: number = 0
  tableOrderId: number;
  isDiscount = false
  isOccupied = false
  discountUnit: 'percentage' | 'value' = 'percentage'
  discountAmount: number = 0

  ngOnInit() {
    this.processTableOrders(this.data.table)
  }

  posOrder() {
    sessionStorage.setItem('table_id', this.data.table.table_id);
    sessionStorage.setItem('table_name', this.data.table.table_name);
    this.__router.navigate(['owner/point-of-sale']);
    clearInterval(this.data.pollingInterval)
    this.data.pollingInterval = null
    this.dialogRef.close({refresh: false});
  }

  moveItemsBetweenTables(){
    let fromTable = {table_id: this.data.table.table_id, table_name: this.data.table.table_name, table_order_id: this.tableOrderId}
    let dialogRef = this.__matDialog.open(MoveTablesComponent, {data: fromTable})
    dialogRef.afterClosed().subscribe(
      (data) => {
        if(data?.success){
          this.waiterKOTPrint()
          this.ngOnInit()
        }
      }
    )
  }

  verifyPassword(){
    let verifyPasswordObserver = new Observable((observer) => {
      let dialogRef = this.__matDialog.open(InputPasswordDialogComponent)
      dialogRef.afterClosed().subscribe(
        (data: any) => {
          if(data?.password){
            let body = {
              "restaurant_id": this.data.table.restaurant_id,
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
      "table_id": this.data.table.table_id,
    }
    this.__tableService.markBillPrinted(body).subscribe(
      (data: any) => {
        this.dialogRef.close({refresh: true});
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
      payment_mode: `Table order`,
      restaurant_id :this.data.table.restaurant_id,
      table_name: this.data.table.table_name,
      waiter_name: this.data.table.waiter_name,
      order_no: this.orderNo
    }
    this.receiptPrintFormatter.confirmedOrderObj = orderObj
    let printObj = this.receiptPrintFormatter.getWaiterCheckKOTText(this.counters)
    console.log('Printing: ', printObj)
    this.print(printObj)
  }
    
  requestPrintBill(){
    if(this.isBillPrinted && !this.isOnline){
      this.__matDialog.open(ErrorMsgDialogComponent, {data: {msg: 'No internet connection'}})
    }
    else if(this.isBillPrinted && this.isOnline){
      this.verifyPassword().subscribe(
        (data: any) => {
          if(data?.validated){
            let body = {
              "table_id": this.data.table.table_id,
              "discount_amount": Number(this.discountAmount),
            }
            this.__tableService.markBillPrinted(body).pipe(
              (
                switchMap((data: any) => {
                  this.orderNo = data['bill_no']
                  localStorage.setItem('last_bill_no', data['bill_no'])
                  return this.__orderService.getTableOrders(body)
                })),
            ).subscribe(
              (data: any) => {
                this.orders = data['orders']['item_details'];
                this.hasOrderedItems = this.orders.length > 0;
                this.totalAmount = data['orders']['total_amount'];
                this.isBillPrinted = data['orders']['bill_printed']
                this.tableOrderId = data['orders']['table_order_id']
                this.calculateAmountWithoutTax()
                this.calculateAmountWithTax()
                this.printBill()
              },
              (error: any) => {
                this.__matDialog.open(ErrorMsgDialogComponent, {data: {msg: 'Failed to mark print'}})
              }
            )
          }
        }
      )
    }else if(!this.isBillPrinted && this.isOnline){
        let body = {
          "table_id": this.data.table.table_id,
          "discount_amount": Number(this.discountAmount)
        }
        this.__tableService.markBillPrinted(body).pipe(
          (
            switchMap((data: any) => {
              this.orderNo = data['bill_no']
              localStorage.setItem('last_bill_no', data['bill_no'])
              return this.__orderService.getTableOrders(body)
            })),
        ).subscribe(
          (data: any) => {
            this.processTableOrders(data)
            this.printBill()
          },
          (error: any) => {
            this.__matDialog.open(ErrorMsgDialogComponent, {data: {msg: 'Failed to mark print'}})
          }
        )
    } else if(!this.isBillPrinted && !this.isOnline){
        let body = {
          "table_id": this.data.table.table_id,
          "table_name": this.data.table.table_name,
          "discount_amount": Number(this.discountAmount),
          'action': 'mark_printed',
          'timestamp' : this.dateUtils.getDateForRecipePrint()
        }
        let cachedOrders = JSON.parse(localStorage.getItem('cached_orders')) || []
        let tableOrdersKey = `table_items_${body['table_name']}`
        let tableOrders = JSON.parse(localStorage.getItem(tableOrdersKey)) || {}
        if(!tableOrders['isBillPrinted']) {
          tableOrders['isBillPrinted'] = true
        }
        localStorage.setItem(tableOrdersKey, JSON.stringify(tableOrders))
        let currentBillNo = Number(localStorage.getItem('last_bill_no')? localStorage.getItem('last_bill_no'): 0 ) + 1
        localStorage.setItem('last_bill_no', String(currentBillNo))
        cachedOrders.push(body)
        localStorage.setItem('cached_orders', JSON.stringify(cachedOrders))
        this.processTableOrders(this.data.table)
        this.printBill()
      }
    }

    processTableOrders(data){
      debugger
      let tableOrdersKey = `table_items_${this.data.table['table_name']}`
        let offlineOrderAmount = 0
        let offlineOrders = []
        let isCacheOrderBillPrinted: boolean = false
        let isPaymentDone: boolean = false
        let currentBillNo = Number(localStorage.getItem('last_bill_no')? localStorage.getItem('last_bill_no'): 0 )
        let tableSessionId = 0
        if(localStorage.getItem(tableOrdersKey)){
          let offlineOrdersCache = JSON.parse(localStorage.getItem(tableOrdersKey))
          offlineOrderAmount = offlineOrdersCache['order_amount']
          offlineOrders = offlineOrdersCache['order_list']
          isCacheOrderBillPrinted = offlineOrdersCache['isBillPrinted']
          isPaymentDone = offlineOrdersCache['isPaymentDone']
          tableSessionId = offlineOrdersCache['table_session_id']
        }
        console.log(offlineOrders)
        if(tableSessionId > 1){
          data['orders']['item_details'] = []
          data['orders']['total_amount'] = 0
          data['orders']['bill_printed'] = false
          data['orders']['table_order_no'] = null
          data['orders']['table_order_id'] = null
          data['orders']['discount_amount'] = 0
        }
        console.log(data['orders']['item_details'])
        this.orders = data['orders']['item_details'].concat(offlineOrders);
        this.hasOrderedItems = this.orders.length > 0;
        this.totalAmount = data['orders']['total_amount'] + offlineOrderAmount;
        this.isBillPrinted = data['orders']['bill_printed']  || isCacheOrderBillPrinted
        this.orderNo = data['orders']['table_order_no']
        this.tableOrderId = data['orders']['table_order_id'] || currentBillNo
        this.discountAmount = data['orders']['discount_amount'] || 0
        this.isOccupied = data['isOccupied'] || data['orders']['item_details'].length > 0
        this.calculateAmountWithoutTax()
        this.calculateAmountWithTax()
        console.log(this.orders, this.totalAmount)
    }

    applyDiscount(){
      if(this.isBillPrinted){
        this.verifyPassword().pipe(
          switchMap(
            (data: any) => {
              if(data?.validated){
                return this.inputDiscount()
              }else{
                throw('Failed to validate')
              }
            }
          ),
          switchMap((data: any) => {
              if(data?.discount){
                let body = {
                  "table_id": this.data.table.table_id,
                  discount_amount: Number(data.discount)
                }
              return this.__tableService.markBillPrinted(body)
              }else{
                throw('No discount added')
              }}),
          switchMap((data: any) => {
            let body = {
              "table_id": this.data.table.table_id,
            }
            this.orderNo = data['bill_no']
            return this.__orderService.getTableOrders(body)
          })
        ).subscribe(
          (data: any) => {
            this.orders = data['orders']['item_details'];
            this.hasOrderedItems = this.orders.length > 0;
            this.totalAmount = data['orders']['total_amount'];
            this.isBillPrinted = data['orders']['bill_printed']
            this.tableOrderId = data['orders']['table_order_id']
            this.calculateAmountWithoutTax()
            this.calculateAmountWithTax()
            this.printBill()
          },
          (error) => {
            console.log('Error', error)
          }
        )
        }else{
          this.inputDiscount().pipe(
            switchMap((data: any) => {
              console.log(data)
              if(data?.discount){
                let body = {
                  "table_id": this.data.table.table_id,
                  discount_amount: Number(data.discount)
                }
                return this.__tableService.markBillPrinted(body)
              }else{
                throw('No discount added')
              }
            }),
            switchMap((data: any) => {
              let body = {
                "table_id": this.data.table.table_id,
              }
              this.orderNo = data['bill_no']
              return this.__orderService.getTableOrders(body)
            })
          )
          .subscribe(
            (data: any) => {
              this.orders = data['orders']['item_details'];
              this.hasOrderedItems = this.orders.length > 0;
              this.totalAmount = data['orders']['total_amount'];
              this.isBillPrinted = data['orders']['bill_printed']
              this.tableOrderId = data['orders']['table_order_id']
              this.calculateAmountWithoutTax()
              this.calculateAmountWithTax()
              this.printBill()
            },
            (error) => {
              console.log('Error', error)
            }
          )
        }
    }

    inputDiscount(){
      let inputDiscountObservable = new Observable((observer) => {
        let matdialogRef = this.__matDialog.open(DiscountComponent, {data: {total_amount: this.totalAmountWithGst, discount_amount: this.discountAmount}})
        matdialogRef.afterClosed().subscribe(
          (data) => {
            if(data?.discount){
              this.discountAmount = data.discount.toFixed(2)
              observer.next({discount: data.discount})
            }
          }
        )
      })
      return inputDiscountObservable
    }


  printBill() {
    let orderObj = {
      order_list: this.orders,
      total_amount: this.subtotalAmountWithoutGst,
      payment_mode: `Table order`,
      restaurant_id :this.data.table.restaurant_id,
      order_no: this.orderNo,
      table_name: this.data.table.table_name,
      discount_amount: this.discountAmount
    }
    this.receiptPrintFormatter.confirmedOrderObj = orderObj
    let printObj = this.receiptPrintFormatter.getCustomerPrintableText()
    console.log('Printing: ', printObj)
    this.print(printObj)
    this.isBillPrinted = true
  } 

  markPaymentDone() {
    let matdialogRef = this.__matDialog.open(ConfirmActionDialogComponent, {data: 'Close this table session?'})
    matdialogRef.afterClosed().subscribe(
      (data: any) => {
        if(data?.select){
          let body = {
            table_id: this.data.table.table_id,
            'action':  'close_session',
            'timestamp' : this.dateUtils.getDateForRecipePrint()
          };
          if(this.isOnline){
            this.__tableService.closeTableSession(body).subscribe(
              (data) => {
                this.__matDialog.open(SuccessMsgDialogComponent, {
                  data: { msg: 'Marked as payment done' },
                });
                let tableOrdersKey = `table_items_${this.data.table['table_name']}`
                localStorage.removeItem(tableOrdersKey)
                this.dialogRef.close({refresh: true});
              },
              (error) => {
                this.__matDialog.open(ErrorMsgDialogComponent, {
                  data: { msg: 'Request failed' },
                });
              });
          }
          else{
            let tableOrdersKey = `table_items_${this.data.table['table_name']}`
            let cachedOrders = JSON.parse(localStorage.getItem('cached_orders')) || []
            cachedOrders.push(body)
            localStorage.setItem('cached_orders', JSON.stringify(cachedOrders))
            let new_table_session_id = (localStorage.getItem(tableOrdersKey)['table_session_id'] ? localStorage.getItem(tableOrdersKey)['table_session_id'] : 1)  + 1
            console.log('new_table_session_id', new_table_session_id, localStorage.getItem(tableOrdersKey))
            localStorage.setItem(tableOrdersKey, JSON.stringify({order_list: [], order_amount: 0, isPaymentDone: true, table_session_id: new_table_session_id}))
            // localStorage.removeItem(tableOrdersKey)
            this.__matDialog.open(SuccessMsgDialogComponent, {
              data: { msg: 'Marked as payment done' },
            });
            this.dialogRef.close({refresh: true})
          }
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
      restaurant_id: this.data.table.restaurant_id,
      line_item_ids: order.line_item_ids,
      action: 1,
    };
    this.__orderService.updateLineItem(body).subscribe(
      (data) => {
        order.quantity += 1
        order.line_item_price += order.item_price
        this.totalAmount += order.item_price
        this.calculateAmountWithTax()
        this.calculateAmountWithoutTax()
      },
      (error) => {
        this.__matDialog.open(ErrorMsgDialogComponent, {data: {msg: 'Failed to add item'}})
      }
    );
  }

  subItem(order) {
    if (order.quantity > 0) {
      let body = {
        restaurant_id: this.data.table.restaurant_id,
        line_item_ids: order.line_item_ids,
        action: -1,
      };
      this.__orderService.updateLineItem(body).subscribe(
        (data) => {
          order.quantity -= 1
          order.line_item_price -= order.price
          this.totalAmount -= order.price
          this.calculateAmountWithTax()
          this.calculateAmountWithoutTax()
        },
        (error) => {
          this.__matDialog.open(ErrorMsgDialogComponent, {data: {msg: 'Failed to subtract item'}})
        }
      );
    }
  }

  deleteItem(order) {
    let body = {
      "restaurant_id": this.data.table.restaurant_id,
      "line_item_ids": order.line_item_ids
    }
    this.__orderService.deleteLineItem(body).subscribe(
      data => {
        this.orders = this.orders.filter((each_order) => each_order.line_item_ids !== order.line_item_ids)
        this.totalAmount -= order.line_item_price
        this.calculateAmountWithTax()
        this.calculateAmountWithoutTax()
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

  calculateLineItemPrie(item){
    return item.line_item_price ? item.line_item_price: item.price * item.quantity
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
      .getRestaurantCounter(this.data.table.restaurant_id)
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
    this.subtotalAmountWithoutGst = this.totalAmountWithoutGst 
    this.totalAmountWithoutGst = Number(this.totalAmountWithoutGst.toFixed(2))
  }

  calculateAmountWithTax(){
    this.totalAmountWithGst = 0
    this.orders.forEach((item) => {
      this.totalAmountWithGst += (item.tax_inclusive? item.price: (item.price * 1.05)) * (item.quantity + (item.parcel_quantity? item.parcel_quantity: 0));
    })
    this.subtotalAmountWithGst = this.totalAmountWithGst
    this.totalAmountWithGst = Number(Math.round(this.totalAmountWithGst))
  }

  getTotalAmountWithGst(){
    this.totalAmountWithGst = Number(this.subtotalAmountWithGst - this.discountAmount)
    return Number(Math.round(this.totalAmountWithGst))
  }

  getTotalAmountWithoutGST(){
    this.totalAmountWithoutGst = Number(this.subtotalAmountWithoutGst - this.discountAmount)
    return Number(Math.round(this.totalAmountWithoutGst))
  }

}
