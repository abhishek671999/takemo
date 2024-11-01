import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ErrorMsgDialogComponent } from 'src/app/components/shared/error-msg-dialog/error-msg-dialog.component';
import { SuccessMsgDialogComponent } from 'src/app/components/shared/success-msg-dialog/success-msg-dialog.component';
import { TablesService } from 'src/app/shared/services/table/tables.service';
import { meAPIUtility } from 'src/app/shared/site-variable';

@Component({
  selector: 'app-table-management',
  templateUrl: './table-management.component.html',
  styleUrls: ['./table-management.component.css'],
})
export class TableManagementComponent {
  constructor(
    private __tableService: TablesService,
    private __fb: FormBuilder,
    private __dialog: MatDialog,
    private meUtility: meAPIUtility
  ) {}
  tables = [];

  tableFormControl = this.__fb.group({
    table_name: ['', [Validators.required]],
    table_capacity: ['', [Validators.required]],
  });

  newTableName = '';
  newTableCapacity: number = 0;

  restaurantId
  ngOnInit() {
    this.meUtility.getRestaurant().subscribe(
      (restaurant) => {
        this.restaurantId = restaurant['restaurant_id']
        this.fetchTables()
      }
    )
  }
  
  fetchTables(){
    let httpParams = new HttpParams();
    httpParams = httpParams.append(
      'restaurant_id',
      this.restaurantId
    );
    this.__tableService.getTables(httpParams).subscribe(
      (data) => {
        this.tables = data['restaurants'];
        this.tables.forEach((value) => {
          value['is_edit'] = false;
        });
      },
      (error) => {
        this.__dialog.open(ErrorMsgDialogComponent, {data: {msg: 'Failed to fetch tables'}})
      }
    );
  }

  editTable(table, event) {
    console.log(event);
    let body = {
      table_id: table.table_id,
    };
    if (Array.from(event.target.classList).includes('table_name')) {
      if (event.target.value == table.table_name) {
        table.is_edit = !table.is_edit;
        return;
      } else {
        body['name'] = event.target.value;
        body['capacity'] = table.capacity;
      }
    } else if (Array.from(event.target.classList).includes('table_capacity')) {
      if (event.target.value == table.capacity) {
        table.is_edit = !table.is_edit;
        return;
      } else {
        body['name'] = table.table_name;
        body['capacity'] = event.target.value;
      }
    }
    this.__tableService.editTable(body).subscribe(
      (data) => {
        this.__dialog.open(SuccessMsgDialogComponent, {data: {msg: 'Successfully updated'}})
        this.ngOnInit();
      },
      (error) => {
        this.__dialog.open(ErrorMsgDialogComponent, {data: {msg: 'Failed to update'}})
      }
    );
  }

  enableEditTable(table) {
    table.is_edit = !table.is_edit;
  }

  deleteTable(table) {
    let body = {
      table_id: table.table_id,
    };
    this.__tableService.deleteTable(body).subscribe(
      (data) => {
        this.__dialog.open(SuccessMsgDialogComponent, {data: {msg: 'Successfully Deleted'}})
        this.ngOnInit();
      },
      (error) => {
        this.__dialog.open(SuccessMsgDialogComponent, {data: {msg: 'Delete Failed'}})
      }
    );
  }

  addTable() {
    let body = {
      name: this.newTableName,
      capacity: this.newTableCapacity,
      restaurant_id: this.restaurantId,
    };
    this.__tableService.addTable(body).subscribe(
      (data) => {
        this.__dialog.open(SuccessMsgDialogComponent, {data: {msg: 'Successfully table Added'}})
        this.newTableCapacity = 0
        this.newTableName = ''
        this.ngOnInit();
      },
      (error) => {
        this.__dialog.open(ErrorMsgDialogComponent, {data: {msg: 'Failed to add'}})
      }
    );
  }
}
