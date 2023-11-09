import { Component } from '@angular/core';
import { Chart } from 'chart.js';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { MenuService } from 'src/app/shared/services/menu/menu.service';


@Component({
  selector: 'app-sales-analytics',
  templateUrl: './sales-analytics.component.html',
  styleUrls: ['./sales-analytics.component.css']
})
export class SalesAnalyticsComponent {

  timeFrames = ["today", "this_week", "this_month", "last_3_months", "last_6_months", "this_year"]
  groupList = [
    { displayValue:'All', actualValue: 'All'},
    { displayValue:'Item Wise', actualValue: 'item_wise'},
    { displayValue:'Category Wise', actualValue: 'category_wise'}
  ]

  selectedGroup: string = this.groupList[0].actualValue;
  selectedTimeFrame: string = this.timeFrames[0];


  chart1: any = []
  chart2: any = []

  chart3: any = []
  chart4: any = []

  constructor(private _analyticsService: AnalyticsService,
    private _menuService: MenuService){}

  ngOnInit(){
    this.createChart('today', 'all')
  }

  onValueChange(){
    console.log('Value changed')
    this.chart1.destroy()
    this.chart3.destroy()   
    this.createChart(this.selectedTimeFrame, this.selectedGroup)
  }

  createChart(timeFrame, groupby){
    console.log('Time frame', timeFrame, 'group by', groupby)
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
  console.log('Body::: ', body)
  this._analyticsService.getSalesAnalyticsData(body).subscribe(
    data => {
      console.log('Got response:: ', this.selectedGroup, data)
      this.chart1 = (this.selectedGroup == 'All')? this.createTotalOrdersAnalyticsChart(data): (this.selectedGroup == 'category_wise')? this.createCategoryWiseTotalOrderChart(data): this.createItemWiseTotalOrderChart(data)
      this.chart3 = (this.selectedGroup == 'All')? this.createTotalAmountAnalyticsChart(data): (this.selectedGroup == 'category_wise')? this.createCategoryWiseTotalAmountChart(data): this.createItemWiseTotalAmountChart(data)
    },
    error => {
      console.log('Error while loading analytics')
    }    
  )
  }
  
  createTotalAmountAnalyticsChart(data){
    console.log('creating total amout chart')
    return new Chart('canvas1',{
    type: 'bar',
    data: {
      labels: [Object.keys(data)[1]],
      datasets: [
        {
          label: '# of Amount',
          data: [data[Object.keys(data)[1]]],
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

  createTotalOrdersAnalyticsChart(data){
    console.log('creating total orders analytic chart')
    return new Chart('canvas2',{
    type: 'bar',
    data: {
      labels: [Object.keys(data)[0]],
      datasets: [
        {
          label: '# of orders',
          data: [data[Object.keys(data)[0]]],
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

  createCategoryWiseTotalAmountChart(data){
    console.log('Creating category wise total amout chart')
    let chartData = []
    for(let point in data['category_wise_data']){
      chartData.push(data['category_wise_data'][point]['total_amount'])
    }
    return new Chart('canvas1',{
      type: 'bar',
      data: {
        labels: Object.keys(data['category_wise_data']),
        datasets: [
          {
            label: 'Total amount ordered',
            data: chartData,
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

  createItemWiseTotalAmountChart(data){
    console.log('creating item wise total amount chart')
    let chartData = []
    for(let point in data['item_wise_data']){
      chartData.push(data['item_wise_data'][point]['total_amount'])
    }
    return new Chart('canvas1',{
      type: 'bar',
      data: {
        labels: Object.keys(data['item_wise_data']),
        datasets: [
          {
            label: 'Amount ordered',
            data: chartData,
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

  createCategoryWiseTotalOrderChart(data){
    console.log('Creating category wise total orders')
    let chartData = []
    for(let point in data['category_wise_data']){
      chartData.push(data['category_wise_data'][point]['quantity'])
    }
    return new Chart('canvas2',{
      type: 'bar',
      data: {
        labels: Object.keys(data['category_wise_data']),
        datasets: [
          {
            label: '# of orders',
            data: chartData,
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

  createItemWiseTotalOrderChart(data){
    console.log('Crateing item wise total orders')
    let chartData = []
    for(let point in data['item_wise_data']){
      chartData.push(data['item_wise_data'][point]['quantity'])
    }
   
    return new Chart('canvas2',{
      type: 'bar',
      data: {
        labels:  Object.keys(data['item_wise_data']),
        datasets: [
          {
            label: '# of orders',
            data: chartData,
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
