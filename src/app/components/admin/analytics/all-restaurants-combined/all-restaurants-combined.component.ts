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
  ){
  }

  @ViewChild(MatSort)
  sort: MatSort = new MatSort;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  private _liveAnnouncer = inject(LiveAnnouncer);
  chart: any

  timeFrames = [
    { displayValue: 'Today', actualValue: 'today' },
    { displayValue: 'Yesterday', actualValue: 'yesterday' },
    // { displayValue: 'This week', actualValue: 'this_week' },
    { displayValue: 'This month', actualValue: 'this_month' },
    // { displayValue: 'Last month', actualValue: 'last_month' },
     { displayValue: 'Last 30 days', actualValue: 'last_30_days' },
    // { displayValue: 'Last 3 months', actualValue: 'last_3_months' },
    { displayValue: 'Last 12 months', actualValue: 'last_12_months' },
    // { displayValue: 'This year', actualValue: 'this_year' },
    { displayValue: 'Calendar', actualValue: 'custom' },
  ];
  selectedTimeFrame: string = this.timeFrames[0].actualValue;
  public selectedFromDate: Date | undefined
  public selectedToDate: Date | undefined
  public salesDataSource = new MatTableDataSource<multilocationSalesAnalytics>()
  public salesDataTableColumns: string[] = ['sl_no', 'restaurant_name', 'total_amount', 'daily_average', 'total_upi', 'total_cash', 'total_credit', 'total_card', 'total_amount_without_tax', 'total_gst_amount', 'total_quantity']
  public chartOptions = {animationEnabled: true,  
    title:{
      text: "Sales"
    },
    axisX: {
      title: "Timeframe"
    },
    axisY: { 
      title: "Sales Amount"      
    },
    toolTip: {
      shared: true
    },
    legend: {
      cursor:"pointer",
      itemclick: function(e: any) {
        if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible ){
          e.dataSeries.visible = false;
        } else {
          e.dataSeries.visible = true;
        }
        e.chart.render();
      }
    },
    data: []}
  public dataLoadSpinner: boolean = false
  tableView = true;
  responseData: any;

  selectedMetric: 'total_amount' | 'quantity' = 'total_amount';

  ngOnInit(): void {
    this.fetchAnalytics()
    document.addEventListener('visibilitychange', this.visibilityChangeHandler);
  }

  ngOnDestroy(): void {
    document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
  }

  ngAfterViewInit(){
    this.salesDataSource.sort = this.sort
    this.salesDataSource.paginator = this.paginator;
  }

  private visibilityChangeHandler = (event: Event) => {
    console.log(event);
    if (!document.hidden) {
      this.fetchAnalytics();
    }
  };

  fetchAnalytics() {
    this.dataLoadSpinner = true
    let body: getMultilocationSalesAnalytics | {} = {
      time_frame: this.selectedTimeFrame,
      graph: !this.tableView
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
          this.responseData = data
          this.dataLoadSpinner = false
          if(this.tableView){
            this.salesDataSource.data = data['sales_result']
          }else{
           this.updateGraph()
          }
        },
        (error: any) => {
          this.dataLoadSpinner = false
        }
      )
    }
  }

  updateGraph(){
    let data = this.parseGraphData(this.responseData, this.selectedMetric)
    this.chartOptions['data'] = data
    this.chartOptions.axisY.title = this.selectedMetric == 'total_amount' ? "Sales Amount" : "Sales Quantity"
    this.chart.render()
  }

  getChartInstance(event){
    this.chart = event
  }

  parseGraphData(data, metric: string = 'total_amount'){
    let graphData = []
    let analytics = data['grapgh_result']
    for(let resturant of analytics){
        let graph = {
            "name": resturant['restaurant_name'],
            type: "spline",
        showInLegend: true,
            dataPoints: []
        }
        for(let time in resturant[this.selectedTimeFrame]){ // change this to selected date
            graph['dataPoints'].push({
                "label": time,
                "y": resturant[this.selectedTimeFrame][time][metric]
            })
        }
        graphData.push(graph)
    }
    return graphData
    
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  getTotalAmount() {
    return this.salesDataSource.data.map(t => t.total_amount).reduce((acc, value) => acc + value, 0);
  }

  getDailyAverage() {
    return this.salesDataSource.data.map(t => t.daily_average).reduce((acc, value) => acc + value, 0);
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

  onToggle(event) {
    this.tableView = !this.tableView;
    this.fetchAnalytics();
  }


}
