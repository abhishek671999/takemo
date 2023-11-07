import { Component } from '@angular/core';
import { Chart } from 'chart.js';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { MenuService } from 'src/app/shared/services/menu/menu.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent {
  timeFrames = ["today", "this_week", "this_month", "last_3_months", "last_6_months", "this_year"]
  timeFramesForTimelyAnalytics = ['last_30_days', 'last_month', 'last_12_months']

  groupList = [
    { displayValue:'All', actualValue: 'All'},
    { displayValue:'Item Wise', actualValue: 'item_wise'},
    { displayValue:'Category Wise', actualValue: 'category_wise'}
  ]

  categoryList = [{'name': 'select', 'id': 0}]
  itemList = [{'name': 'select', 'id': 0}]
  
  selectedTimeFrame: string;
  selectedTimeFrameForTimelyAnalytics: string;

  selectedGroup: string;

  selectedCategory: string;
  selectedCategoryForTimelyAnalytics: string;

  selectedItem: string;
  selectedItemForTimelyAnalytics: string;

  chart1: any = []
  chart2: any = []

  chart3: any = []
  chart4: any = []
  
  constructor(private _analyticsService: AnalyticsService,
        private _menuService: MenuService){}
  ngAfterViewInit(){
    
  }
  ngOnInit(){
    
    this._menuService.getMenu(1).subscribe(
      data => {
        data['menu'].forEach(element => {
          console.log('In menue iteration: ', element)
          this.categoryList.push({ 'name': element.category.name, 'id': element.category.id})
          element.category.items.forEach(element => {
            console.log('in items: ', element)
            this.itemList.push({'name': element.name, 'id': element.id})
          });
        });
      }
    )
    this.createChart('today', 'all')
    this.createTimelyAnalytics('last_30_days', '', '') 
  }

  createChart(timeFrame, groupby){
    let body = {
      "restaurant_id": 1,
      "_comment": "rule_id is optional and 1(default) will be taken if not given",
      "time_frame": timeFrame,
      "_comment1": "Possible options for above field: today, this_week, this_month, last_3_months, last_6_months, this_year, custom",
      "_comment2": "if custom is given, 2 more fields, from_date and to_date must be sent",
      "item_wise": groupby == 'item_wise'? true : false,
      "category_wise": groupby == "category_wise"? true : false,
      "_comment3": "item_wise or category_wise booean fields. Either or none must be used"
  }
  this._analyticsService.getSalesAnalyticsData(body).subscribe(
    data => {
      this.chart1 = this.createOrdersAnalyticsChart(data)
      this.chart3 = this.createAmountAnalyticsChart(data)
    },
    error => {
      console.log('Error while loading analytics')
    }    
  )
  }


  createAmountAnalyticsChart(data){
    return new Chart('canvas1',{
    type: 'bar',
    data: {
      labels: [Object.keys(data)[1]],
      datasets: [
        {
          label: '# of Amount',
          data: [data[Object.keys(data)[1]]+1],
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    }
  })  
  }

  createOrdersAnalyticsChart(data){
    return new Chart('canvas2',{
    type: 'bar',
    data: {
      labels: [Object.keys(data)[0]],
      datasets: [
        {
          label: '# of orders',
          data: [data[Object.keys(data)[0]]+1],
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    }
  })  
  }

  
  createTimelyAnalytics(time_frame, category, item){
    let body = {
      "restaurant_id": 1,
      "_comment": "rule_id is optional and 1(default) will be taken if not given",
      "time_frame": time_frame,
      "_comment1": "Possible options for above field: last_30_days, last_month, last_12_months",
      "category_id": category.id,
      "item_id": category.id == 0? item.id: "",
      "_comment2": "Either of category_id or item_id or none must be sent"
  }
  this._analyticsService.getTimelyAnalyticsData(body).subscribe(
    data => {
      console.log("Timely analytics", data[time_frame], time_frame)
      this.chart2  = this.createTimelyOrderAnalyticsChart(data, time_frame)
      this.chart4 = this.createTimelyAmountAnalyticsChart(data, time_frame)
        },
    error => {
      console.log('Error in create timely anlaytics')
    }
  )
  }

  createTimelyOrderAnalyticsChart(data, time_frame){
    let ordersData = []
    for (let ele in data[time_frame] ){
      ordersData.push(data[time_frame][ele]['no_of_orders'])
    }
    console.log('THis is Orders data: ', ordersData, Object.keys(data[time_frame]) )
    return new Chart('canvas3',{
      type: 'bar',
      data: {
        labels: Object.keys(data[time_frame]),
        datasets: [
          {
            label: '# of orders',
            data: ordersData,
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      }
    })  
  }

  createTimelyAmountAnalyticsChart(data, time_frame){
    let AmountsData = []
    for (let ele in data[time_frame] ){
      AmountsData.push(data[time_frame][ele]['total_amount'])
    }
    console.log('THis is amoutns data: ', AmountsData, Object.keys(data[time_frame]))
    return new Chart('canvas4',{
      type: 'bar',
      data: {
        labels: Object.keys(data[time_frame]),
        datasets: [
          {
            label: '# of orders',
            data: AmountsData,
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      }
    })
  }
}
