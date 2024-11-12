import { HttpParams } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
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
    private __tableService: TablesService, 
  ){
    console.log(data)
  }

  private restaurantId: number;
  public tables;


  ngOnInit(){
    this.meUtility.getRestaurant().subscribe(
      (restaurant) => {
        this.restaurantId = restaurant['restaurant_id']
        this.fetchTables()
      }
    )
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


}
