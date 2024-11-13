import { HttpParams } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmActionDialogComponent } from 'src/app/components/shared/confirm-action-dialog/confirm-action-dialog.component';
import { ErrorMsgDialogComponent } from 'src/app/components/shared/error-msg-dialog/error-msg-dialog.component';
import { SuccessMsgDialogComponent } from 'src/app/components/shared/success-msg-dialog/success-msg-dialog.component';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { TablesService } from 'src/app/shared/services/table/tables.service';
import { meAPIUtility } from 'src/app/shared/site-variable';

@Component({
  selector: 'app-move-tables',
  templateUrl: './move-tables.component.html',
  styleUrls: ['./move-tables.component.css']
})
export class MoveTablesComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private __matDialog: MatDialog,
    private meUtility: meAPIUtility,
    private orderService: OrdersService, 
    private __tableService: TablesService, 
    private matDialogRef: MatDialogRef<MoveTablesComponent>
  ){
    console.log(data)
    this.fromTable = data
  }

  private restaurantId: number;
  public tables;
  public fromTable;
  public toTable;
  public tableOrders;
  public allItemsSelected: boolean = true
  public tableExcludeList = []


  ngOnInit(){
    this.tableExcludeList.push(this.fromTable.table_id)
    this.meUtility.getRestaurant().subscribe(
      (restaurant) => {
        this.restaurantId = restaurant['restaurant_id']
        this.fetchTables()
      }
    )
    this.fetchTableOrders()
  }

  fetchTables(){
    let httpParams = new HttpParams()
    httpParams = httpParams.append('restaurant_id', this.restaurantId);
    this.__tableService.getTables(httpParams).subscribe(
      data => {
        this.tables = data['restaurants']
        this.tables.forEach(table => {
          if(table.bill_printed) this.tableExcludeList.push(table.table_id)
        })
      console.log(this.tableExcludeList)
      },
      error => {
        console.log('This is error: ', error)
      }
    )
  }

  fetchTableOrders(){
    let httpParams = new HttpParams()
    httpParams = httpParams.append('table_order_id', this.data.table_order_id)
    this.orderService.getTableOrdersByOrderSession(httpParams).subscribe(
      (data) => {
        this.tableOrders = data['orders']
        this.tableOrders.forEach(order => {
          order['is_selected'] = false
          order['item_details'] = this.parseTableOrders(order)
          
        });
      },
      (error) => {
        console.log(error)
      }
    )
  }

  parseTableOrders(order){
    let tableOrder: string = ''
    order['line_items'].forEach((lineItem) => {
      tableOrder += `${lineItem.item_name} - ${lineItem.item_quantity}<br>`
    })
    return tableOrder
  }


  submitRequest(){
    let selectedItemIds = []
    this.tableOrders.forEach(order => {
      if(order.is_selected) selectedItemIds.push(order.order_id)
    });
    let dialogRef = this.__matDialog.open(ConfirmActionDialogComponent, {data: `Are you sure want to move ${this.fromTable.table_name} to ${this.toTable.table_name}`})
    dialogRef.afterClosed().subscribe(
      (data: any) => {
        if(data?.select){
          let body = {
            "old_table_id": this.fromTable.table_id,
            "new_table_id": this.toTable.table_id,
            'order_ids': selectedItemIds
        }
        this.__tableService.moveTable(body).subscribe(
          (data: any) => {
            this.__matDialog.open(SuccessMsgDialogComponent, {data: {msg: `Successfully moved ${this.fromTable.table_name} to ${this.toTable.table_name}` }})
            this.matDialogRef.close({success: true})
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
