import { Component } from '@angular/core';
import { getMultilocationSalesAnalytics, multilocationSalesAnalytics } from 'src/app/shared/datatypes/analytics';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';

@Component({
  selector: 'app-all-restaurants-combined',
  templateUrl: './all-restaurants-combined.component.html',
  styleUrls: ['./all-restaurants-combined.component.css']
})
export class AllRestaurantsCombinedComponent {

  constructor(private analyticsService: AnalyticsService){}

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
  public salesDataSource: multilocationSalesAnalytics[] = []
  public salesDataTableColumns: string[] = ['sl_no', 'restaurant_name', 'total_quantity', 'total_amount', 'total_amount_without_tax', 'total_gst_amount',]

  ngOnInit(){
    this.fetchAnalytics()
  }

  fetchAnalytics(){
    let body: getMultilocationSalesAnalytics | {} = {
      time_frame: this.selectedTimeFrame,
    }
    if (this.selectedTimeFrame == 'custom') {
      if (this.selectedFromDate && this.selectedToDate) {
        body['from_date'] = this.selectedFromDate
        body['to_date'] = this.selectedToDate
      }
      else {
        body = {}
      }
    }

    if (Object.keys(body).length > 0) {
      this.analyticsService.getMultilocationSalesAnalytics(body).subscribe(
        (data: any) => {
          this.salesDataSource = data['sales_result']
        },
        (error: any) => {}
      )
    }


  }

}
