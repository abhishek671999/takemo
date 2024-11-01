import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { CounterService } from 'src/app/shared/services/inventory/counter.service';
import { PageEvent } from '@angular/material/paginator';
import { meAPIUtility } from 'src/app/shared/site-variable';

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.css'],
})
export class ActivityLogComponent {
  constructor(private __counterService: CounterService, private meUtility: meAPIUtility) {}


  length = 50;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;

  restaurantId;
  activities = [];
  ngOnInit() {

    this.meUtility.getRestaurant().subscribe(
      (restaurant) => {
        this.restaurantId = restaurant['restaurant_id']
        this.getInventoryLogs()
      }
    )
  }

  getInventoryLogs() {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('restaurant_id', this.restaurantId);
    httpParams = httpParams.append('offset', this.pageIndex * this.pageSize)
    httpParams = httpParams.append('limit', (this.pageIndex * this.pageSize) + this.pageSize)
    this.__counterService.getInventoryLogs(httpParams).subscribe(
      (data) => {
        this.activities = data['inventory_stock_log'];
        this.length = data['no_of_records'];
        this.activities.forEach((ele) => {
          ele.created_at = new Date(ele.created_at).toLocaleString()
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  handlePageEvent(e: PageEvent) {
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.getInventoryLogs()
  }
}
