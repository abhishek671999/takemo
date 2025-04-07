import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TablesService } from 'src/app/shared/services/table/tables.service';
import { TableOrdersDialogComponent } from '../../dialogbox/table-orders-dialog/table-orders-dialog.component';
import { meAPIUtility } from 'src/app/shared/site-variable';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ConfirmActionDialogComponent } from 'src/app/components/shared/confirm-action-dialog/confirm-action-dialog.component';
import { SuccessMsgDialogComponent } from 'src/app/components/shared/success-msg-dialog/success-msg-dialog.component';
import { ErrorMsgDialogComponent } from 'src/app/components/shared/error-msg-dialog/error-msg-dialog.component';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { CounterService } from 'src/app/shared/services/inventory/counter.service';
import { ReceiptPrintFormatter } from 'src/app/shared/utils/receiptPrint';
import { PrintConnectorService } from 'src/app/shared/services/printer/print-connector.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table-cockpit',
  templateUrl: './table-cockpit.component.html',
  styleUrls: ['./table-cockpit.component.css']
})
export class TableCockpitComponent {

  constructor(
    private __tableService: TablesService, 
    private __matDialog: MatDialog, 
    private __orderService: OrdersService,
    private _counterService: CounterService,
    private receiptPrintFormatter: ReceiptPrintFormatter,
    public printerConn: PrintConnectorService,
    private meUtility: meAPIUtility,
    private route: Router
  ) { }
  public tables;
  counters = [];
  hasOrderedItems = false;
  restaurantId: number
  orders;
  totalAmount;
  private refreshFrequency: number = 10;
  private pollingInterval;
  private counterLoaded = false
  public loader = false

  ngOnInit() {
    this.meUtility.getRestaurant().subscribe(
      (restaurant) => {
        this.restaurantId = restaurant['restaurant_id']
        if(!restaurant['table_management']) this.route.navigate(['./home'])
        if(!this.counterLoaded) this.fetchCounters()
      }
    )
    // this.pollingInterval = this.startPageRefresh()
    this.fetchTables()
  }

  startPageRefresh(){
    if(this.pollingInterval) clearInterval(this.pollingInterval)
    this.fetchTables()
    return setInterval(() => {
      this.fetchTables()
    }, this.refreshFrequency * 1000);
  }

  ngOnDestroy(){
    clearInterval(this.pollingInterval)
    this.pollingInterval = null
  }

  fetchTables(){
    this.loader = true
    let httpParams = new HttpParams()
    httpParams = httpParams.append('restaurant_id', this.restaurantId);
    this.__tableService.getTables(httpParams).subscribe(
      data => {
        this.tables = data['restaurants']
        this.tables.forEach(table => {
          let tableOrdersKey = `table_items_${table['table_name']}`
          if(localStorage.getItem(tableOrdersKey)){
            let offlineOrdersCache = JSON.parse(localStorage.getItem(tableOrdersKey))
            console.log('offlineOrdersCache', tableOrdersKey, offlineOrdersCache)
            if(offlineOrdersCache['table_session_id'] > 1){
              table['is_occupied'] = false
              table['standing_amount'] = 0
              table['bill_printed'] = false
            }
            table['standing_amount'] =  offlineOrdersCache['order_amount'] + table['standing_amount']
            table['is_occupied'] = table['is_occupied'] || offlineOrdersCache['order_list'].length > 0
            table['bill_printed'] = table['bill_printed'] || offlineOrdersCache['isBillPrinted']
          }
          
        })
        this.loader = false
      },
      error => {
        console.log('This is error: ', error)
        this.loader = false
      }
    )
  }
  
  openTableDetails(table) {
    clearInterval(this.pollingInterval)
    let dialogRef = this.__matDialog.open(TableOrdersDialogComponent, { data: {table: table, pollingInterval: this.pollingInterval}, width: '100vw' })
    dialogRef.afterClosed().subscribe(
      data => {
        console.log('Dialog closed', data)
          this.ngOnInit()
      },
      error => {
        console.log('Dialog closed', error)
        this.ngOnInit()
      }
    )
  }

  fetchCounters(){
    this._counterService
      .getRestaurantCounter(this.restaurantId)
      .subscribe(
        (data) => {
          console.log('counters available', data);
          this.counters = data['counters'];
          this.counterLoaded = true
        },
        (error) => {
          console.log('Error: ', error);
        }
      );
  }

  waiterKOTPrint(table_name){
    let orderObj = {
      order_list: this.orders,
      total_amount: this.totalAmount,
      payment_mode: 'Table order',
      restaurant_id :this.restaurantId,
      table_name: table_name,
    }
    this.receiptPrintFormatter.confirmedOrderObj = orderObj
    let printObj = this.receiptPrintFormatter.getWaiterCheckKOTText(this.counters)
    this.print(printObj)
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


}
