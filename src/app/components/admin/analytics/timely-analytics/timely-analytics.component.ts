import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Chart } from 'chart.js';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { MenuService } from 'src/app/shared/services/menu/menu.service';
import { RulesService } from 'src/app/shared/services/roles/rules.service';
import { dateUtils } from 'src/app/shared/utils/date_utils';
import { meAPIUtility, sessionWrapper } from 'src/app/shared/site-variable';
import { CounterService } from 'src/app/shared/services/inventory/counter.service';

@Component({
  selector: 'app-timely-analytics',
  templateUrl: './timely-analytics.component.html',
  styleUrls: ['./timely-analytics.component.css']
})
export class TimelyAnalyticsComponent {

  constructor(private _analyticsService: AnalyticsService,
    private _menuService: MenuService, 
    private _ruleService: RulesService,
    private dateUtils: dateUtils,
    private __sessionWrapper: sessionWrapper,
    private _counterService: CounterService
    ){}

  timeFramesForTimelyAnalytics = [
    {displayValue: 'Last 30 days', actualValue: 'last_30_days' },
    {displayValue: 'Last month', actualValue: 'last_month' },
    // { displayValue: 'Last week', actualValue: 'last_week'}, //future
    { displayValue: 'Last 12 months', actualValue: 'last_12_months' },
    // { displayValue: 'Calendar', actualValue: 'custom'}
    
  ]
  categoryList = [{'name': 'select', 'id': 0}]
  itemList = [{'name': 'select', 'id': 0}]

  restaurantList = [
    // { displayValue: 'All', restaurant_id: 0},
    { displayValue: 'Amulya Kitchen', restaurant_id: 1},
    { displayValue: 'Tikkad kitchen', restaurant_id: 2}
  ]

  selectedTimeFrameForTimelyAnalytics: string = this.timeFramesForTimelyAnalytics[0].actualValue
  selectedCategory = this.categoryList[0];
  selectedItem  = this.itemList[0];
  selectedRestaurant: number| string = this.__sessionWrapper.getItem('restaurant_id') ? this.__sessionWrapper.getItem('restaurant_id'): this.restaurantList[0].restaurant_id;
  restaurantFlag = this.__sessionWrapper.getItem('restaurant_id') ? true : false
  selectedRule;
  ruleList = []
  totalAmount = 0;
  totalOrders = 0;
  loadView = false
  isITTUser = this.__sessionWrapper.doesUserBelongsToITT()

  counters = []
  selectedCounterId;

  chart2: any = []
  chart4: any = []

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });


  
  ngOnInit(){
    this._menuService.getMenu(this.selectedRestaurant).subscribe(
      data => {
        data['menu'].forEach(element => {
          this.categoryList.push({ 'name': element.category.name, 'id': element.category.id})
          element.category.items.forEach(element => {
            this.itemList.push({'name': element.name, 'id': element.id})
          });
        });
      }
    )
    
    this._ruleService.getAllRules().subscribe(
      data => {
        data['rules'].forEach(element => {
          this.ruleList.push({'rule_id': element.id, 'rule_name': element.name})
        });
        this.selectedRule = this.ruleList[0].rule_id
        this.createTimelyAnalytics(this.getRequestBodyPrepared()) 
        this.loadView = true
      }
    )

    this._counterService.getRestaurantCounter(this.__sessionWrapper.getItem('restaurant_id')).subscribe(
      data => {
        console.log('counters available', data)
        this.counters = data['counters']
      },
      error => {
        console.log('Error: ', error)
      }
    )
    
  }

  

  onValueChange(value: string){
    let field = document.getElementById('calendarInputField')
    
    if(value == 'item'){
      this.selectedCategory = {'name': 'select', 'id': 0}
    }else if(value == 'category'){
      this.selectedItem = {'name': 'select', 'id': 0}
    }
    console.log('IN value change', this.selectedTimeFrameForTimelyAnalytics)
    if(this.selectedTimeFrameForTimelyAnalytics == 'custom'){
      field.classList.remove('hidden')
      if(this.range.value.start && this.range.value.end){
        this.chart2.destroy()
        this.chart4.destroy()
        this.createTimelyAnalytics(this.getRequestBodyPrepared())
      }
    }else{
      field.classList.add('hidden')
      this.chart2.destroy()
      this.chart4.destroy()
      this.createTimelyAnalytics(this.getRequestBodyPrepared())
    }
    
    console.log('THis is onValue change', value, this.selectedTimeFrameForTimelyAnalytics, this.selectedCategory, this.selectedItem)
    
  }

  dateChanged(){
    if(this.range.value.start && this.range.value.end){
      this.createTimelyAnalytics(this.getRequestBodyPrepared())   
    }
  }

  getRequestBodyPrepared(){
    let body = {
      "rule_id_list": Array.isArray(this.selectedRule) ? this.selectedRule: [this.selectedRule],
      "restaurant_id": this.__sessionWrapper.getItem('restaurant_id') ? this.__sessionWrapper.getItem('restaurant_id'): this.selectedRestaurant,
      "category_id": this.selectedCategory.id,
      "item_id": this.selectedCategory.id == 0? this.selectedItem.id: "",
      "pos": this.isITTUser ? false: true
  }
    if(this.selectedCounterId){
      body['counter_id'] = this.selectedCounterId
    }
    console.log('New: ', this.selectedTimeFrameForTimelyAnalytics, this.range.value.start, this.range.value.end)
    if(this.selectedTimeFrameForTimelyAnalytics == 'custom'){
      if(this.range.value.start && this.range.value.end){
        body['time_frame'] = this.selectedTimeFrameForTimelyAnalytics
        body['start_date'] = this.dateUtils.getStandardizedDateFormate(this.range.value.start)
        body['end_date'] = this.dateUtils.getStandardizedDateFormate(this.range.value.end)
      }
      else{
        body = null
      }
    }else{
      body['time_frame'] =this.selectedTimeFrameForTimelyAnalytics
    }
    return body
  }

  createTimelyAnalytics(body){
    console.log('this is body', body)
    if(body){
      this._analyticsService.getTimelyAnalyticsData(body).subscribe(
        data => {
          console.log("Timely analytics", data[this.selectedTimeFrameForTimelyAnalytics], this.selectedTimeFrameForTimelyAnalytics)
          this.totalOrders = data['quantity']
          this.totalAmount = data['total_amount']
          this.chart2  = this.createTimelyOrderAnalyticsChart(data, this.selectedTimeFrameForTimelyAnalytics)
          this.chart4 = this.createTimelyAmountAnalyticsChart(data, this.selectedTimeFrameForTimelyAnalytics)
            },
        error => {
          console.log('Error in create timely anlaytics')
        }
      )
    }
    
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
            label: 'Num of orders',
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
            label: 'Total Amount',
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
