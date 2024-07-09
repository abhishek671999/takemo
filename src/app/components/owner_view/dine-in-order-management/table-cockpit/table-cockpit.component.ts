import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TablesService } from 'src/app/shared/services/table/tables.service';
import { TableOrdersDialogComponent } from '../../dialogbox/table-orders-dialog/table-orders-dialog.component';
import { sessionWrapper } from 'src/app/shared/site-variable';

@Component({
  selector: 'app-table-cockpit',
  templateUrl: './table-cockpit.component.html',
  styleUrls: ['./table-cockpit.component.css']
})
export class TableCockpitComponent {

  constructor(private __tableService: TablesService, private __matDialog: MatDialog, private __sessionWrapper: sessionWrapper) { }
  public tables;
  ngOnInit() {
    let httpParams = new HttpParams()
    httpParams = httpParams.append('restaurant_id', this.__sessionWrapper.getItem('restaurant_id'));
    this.__tableService.getTables(httpParams).subscribe(
      data => {
        console.log('This is data: ', data)
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
  
}
