import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, inject, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { getMultilocationSalesAnalytics, multilocationSalesAnalytics } from 'src/app/shared/datatypes/analytics';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { dateUtils } from 'src/app/shared/utils/date_utils';

@Component({
  selector: 'app-all-restaurants-combined',
  templateUrl: './all-restaurants-combined.component.html',
  styleUrls: ['./all-restaurants-combined.component.css']
})
export class AllRestaurantsCombinedComponent {

  constructor(
    private analyticsService: AnalyticsService,
    private dateUtils: dateUtils
  ){}

  @ViewChild(MatSort)
  sort: MatSort = new MatSort;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  private _liveAnnouncer = inject(LiveAnnouncer);

  timeFrames = [
    { displayValue: 'Today', actualValue: 'today' },
    { displayValue: 'Yesterday', actualValue: 'yesterday' },
    { displayValue: 'This week', actualValue: 'this_week' },
    { displayValue: 'This month', actualValue: 'this_month' },
    { displayValue: 'Last month', actualValue: 'last_month' },
    { displayValue: 'Last 3 months', actualValue: 'last_3_months' },
    { displayValue: 'Last 6 months', actualValue: 'last_6_months' },
    { displayValue: 'This year', actualValue: 'this_year' },
    { displayValue: 'Calendar', actualValue: 'custom' },
  ];
  selectedTimeFrame: string = this.timeFrames[0].actualValue;
  public selectedFromDate: Date | undefined
  public selectedToDate: Date | undefined
  public salesDataSource = new MatTableDataSource<multilocationSalesAnalytics>()
  public salesDataTableColumns: string[] = ['sl_no', 'restaurant_name', 'total_amount', 'total_upi', 'total_cash', 'total_credit', 'total_card', 'total_amount_without_tax', 'total_gst_amount', 'total_quantity']

  public dataLoadSpinner: boolean = false
  ngOnInit(){
    this.fetchAnalytics()
    document.addEventListener('visibilitychange', (event) => {
      console.log(event)
      if(!document.hidden) this.fetchAnalytics()
    })
  }

  ngAfterViewInit(){
    this.salesDataSource.sort = this.sort
    this.salesDataSource.paginator = this.paginator;
  }

  fetchAnalytics(){
    this.dataLoadSpinner = true
    let body: getMultilocationSalesAnalytics | {} = {
      time_frame: this.selectedTimeFrame,
    }
    if (this.selectedTimeFrame == 'custom') {
      if (this.selectedFromDate && this.selectedToDate) {
        body['start_date'] = this.dateUtils.getStandardizedDateFormate(this.selectedFromDate)
        body['end_date'] = this.dateUtils.getStandardizedDateFormate(this.selectedToDate)
      }
      else {
        body = {}
      }
    }

    if (Object.keys(body).length > 0) {
      this.analyticsService.getMultilocationSalesAnalytics(body).subscribe(
        (data: any) => {
          this.salesDataSource.data = data['sales_result']
          this.dataLoadSpinner = false
        },
        (error: any) => {
          this.dataLoadSpinner = false
        }
      )
    }
  }

  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  getTotalAmount() {
    return this.salesDataSource.data.map(t => t.total_amount).reduce((acc, value) => acc + value, 0);
  }

  getTotalUPIAmount() {
    return this.salesDataSource.data.map(t => t.upi_amount).reduce((acc, value) => acc + value, 0);
  }

  getTotalCashAmount() {
    return this.salesDataSource.data.map(t => t.cash_amount).reduce((acc, value) => acc + value, 0);
  }
  
  getTotalCreditAmount() {
    return this.salesDataSource.data.map(t => t.PayLater_amount).reduce((acc, value) => acc + value, 0);
  }

  getTotalCardAmount() {
    return this.salesDataSource.data.map(t => t.card_amount).reduce((acc, value) => acc + value, 0);
  }

  getTotalQuantity() {
    return this.salesDataSource.data.map(t => t.total_quantity).reduce((acc, value) => acc + value, 0);
  }

  getTotalMakingPrice() {
    return this.salesDataSource.data.map(t => t.total_making_price).reduce((acc, value) => acc + value, 0);
  }

  getTotalAmountWithouutTax() {
    return this.salesDataSource.data.map(t => t.total_amount_without_tax).reduce((acc, value) => acc + value, 0);
  }

  getTotalTaxAmount() {
    return this.salesDataSource.data.map(t => t.total_gst_amount).reduce((acc, value) => acc + value, 0);
  }


}
