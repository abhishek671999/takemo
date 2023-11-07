import { Component } from '@angular/core';
import { Chart } from 'chart.js';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { MenuService } from 'src/app/shared/services/menu/menu.service';


@Component({
  selector: 'app-timely-analytics',
  templateUrl: './timely-analytics.component.html',
  styleUrls: ['./timely-analytics.component.css']
})
export class TimelyAnalyticsComponent {

  timeFramesForTimelyAnalytics = ['last_30_days', 'last_month', 'last_12_months']
  categoryList = [{'name': 'select', 'id': 0}]
  itemList = [{'name': 'select', 'id': 0}]

  selectedTimeFrameForTimelyAnalytics: string = this.timeFramesForTimelyAnalytics[0]
  selectedCategory = this.categoryList[0];
  selectedItem  = this.itemList[0];

  chart2: any = []
  chart4: any = []

  constructor(private _analyticsService: AnalyticsService,
    private _menuService: MenuService){}

  
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
    this.createTimelyAnalytics() 
  }

  onValueChange(value: string){
    console.log('THis is before onValue change', value, this.selectedTimeFrameForTimelyAnalytics, this.selectedCategory, this.selectedItem)
    if(value == 'item'){
      this.selectedCategory = {'name': 'select', 'id': 0}
    }else if(value=='category'){
      this.selectedItem = {'name': 'select', 'id': 0}
    }
    console.log('THis is onValue change', value, this.selectedTimeFrameForTimelyAnalytics, this.selectedCategory, this.selectedItem)
    this.chart2.destroy()
    this.chart4.destroy()
    this.createTimelyAnalytics()
  }

  createTimelyAnalytics(){
    let body = {
      "restaurant_id": 1,
      "_comment": "rule_id is optional and 1(default) will be taken if not given",
      "time_frame": this.selectedTimeFrameForTimelyAnalytics,
      "_comment1": "Possible options for above field: last_30_days, last_month, last_12_months",
      "category_id": this.selectedCategory.id,
      "item_id": this.selectedCategory.id == 0? this.selectedItem.id: "",
      "_comment2": "Either of category_id or item_id or none must be sent"
  }
  console.log('this is body', body)
  this._analyticsService.getTimelyAnalyticsData(body).subscribe(
    data => {
      console.log("Timely analytics", data[this.selectedTimeFrameForTimelyAnalytics], this.selectedTimeFrameForTimelyAnalytics)
      this.chart2  = this.createTimelyOrderAnalyticsChart(data, this.selectedTimeFrameForTimelyAnalytics)
      this.chart4 = this.createTimelyAmountAnalyticsChart(data, this.selectedTimeFrameForTimelyAnalytics)
        },
    error => {
      console.log('Error in create timely anlaytics')
    }
  )
  }





  createTimelyOrderAnalyticsChart(data, time_frame){
    let ordersData = []
    for (let ele in data[time_frame] ){
      ordersData.push(data[time_frame][ele]['quantity'])
    }
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
