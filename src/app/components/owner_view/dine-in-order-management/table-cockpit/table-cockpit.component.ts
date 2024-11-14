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

  ngOnInit() {
    this.meUtility.getRestaurant().subscribe(
      (restaurant) => {
        this.restaurantId = restaurant['restaurant_id']
        if(!restaurant['table_management']) this.route.navigate(['./home'])
        this.fetchCounters()
        this.fetchTables()
      }
    )
    if(this.pollingInterval) clearInterval(this.pollingInterval)
    this.pollingInterval = this.startPageRefresh()
  }

  startPageRefresh(){
    return setInterval(() => {
      this.fetchTables()
    }, this.refreshFrequency * 1000);
  }

  ngOnDestroy(){
    clearInterval(this.pollingInterval)
  }

  fetchTables(){
    let httpParams = new HttpParams()
    httpParams = httpParams.append('restaurant_id', this.restaurantId);
    this.__tableService.getTables(httpParams).subscribe(
      data => {
        this.tables = data['restaurants']
      },
      error => {
        console.log('This is error: ', error)
      }
    )
  }
  
  openTableDetails(table) {
    let dialogRef = this.__matDialog.open(TableOrdersDialogComponent, { data: table, width: '100vw' })
    dialogRef.afterClosed().subscribe(
      data => {
          this.ngOnInit()
      },
      error => {
        this.ngOnInit()
      }
    )
  }

  onHover(table, $event){
    console.log('hover', table, $event)
  }


  onDrop(event: CdkDragDrop<string[]>) {
    if(event.previousIndex != event.currentIndex){
      let fromTable = this.tables[event.previousIndex]
      let toTable = this.tables[event.currentIndex]
      this.getTableOrders(fromTable.table_id)
      let dialogRef = this.__matDialog.open(ConfirmActionDialogComponent, {data: `Are you sure want to move ${fromTable.table_name} to ${toTable.table_name}`})
      dialogRef.afterClosed().subscribe(
        (data: any) => {
          if(data?.select){
            let body = {
              "old_table_id": fromTable.table_id,
               "new_table_id": toTable.table_id
          }
          this.__tableService.moveTable(body).subscribe(
            (data: any) => {
              this.__matDialog.open(SuccessMsgDialogComponent, {data: {msg: `Successfully moved ${fromTable.table_name} to ${toTable.table_name}` }})
              this.waiterKOTPrint(fromTable.table_name)
              this.ngOnInit()
            },
            (error: any) => {
              this.__matDialog.open(ErrorMsgDialogComponent, {data: 'Failed to move'})
            }  
          )
        }
      }
      )
    }
  }

  getTableOrders(table_id){
    let body = {
      table_id: table_id,
    };
    this.__orderService.getTableOrders(body).subscribe(
      (data) => {
        this.orders = data['orders']['item_details'];
        this.hasOrderedItems = this.orders.length > 0;
        this.totalAmount = data['orders']['total_amount'];
      },
      (error) => {
        this.__matDialog.open(ErrorMsgDialogComponent, {
          data: { msg: 'Failed to get table orders' },
        });
      }
    );
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
