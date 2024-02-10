import { Component, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { MenuService } from 'src/app/shared/services/menu/menu.service';
import { ChartComponent } from 'ng-apexcharts';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
} from 'ng-apexcharts';
import { RulesService } from 'src/app/shared/services/roles/rules.service';
import { dateUtils } from 'src/app/shared/utils/date_utils';
import { FormControl, FormGroup } from '@angular/forms';
import { meAPIUtility } from 'src/app/shared/site-variable';
import { CounterService } from 'src/app/shared/services/inventory/counter.service';


export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'app-sales-analytics',
  templateUrl: './sales-analytics.component.html',
  styleUrls: ['./sales-analytics.component.css'],
})
export class SalesAnalyticsComponent {
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor(
    private _analyticsService: AnalyticsService,
    private _menuService: MenuService,
    private _ruleService: RulesService,
    private dateUtils: dateUtils,
    private _meAPIutility: meAPIUtility,
    private _counterService: CounterService
  ) {}

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
  groupList = [
    { displayValue: 'All', actualValue: 'All' },
    { displayValue: 'Item Wise', actualValue: 'item_wise' },
    { displayValue: 'Category Wise', actualValue: 'category_wise' },
  ];

  restaurantList = [
    // { displayValue: 'All', restaurant_id: 0},
    { displayValue: 'Amulya Kitchen', restaurant_id: 1 },
    { displayValue: 'Tikkad kitchen', restaurant_id: 2 },
  ];

  ruleList = [];
  loadView = false;
  selectedGroup: string = this.groupList[0].actualValue;
  selectedTimeFrame: string = this.timeFrames[0].actualValue;
  selectedRestaurant: number = this.restaurantList[0].restaurant_id;
  selectedRule;
  totalAmount = 0;
  totalOrders = 0;
  restaurantFlag = sessionStorage.getItem('restaurant_id') ? true : false;
  isITTUser = this._meAPIutility.doesUsersBelongsToITT()

  chart1: any = [];
  chart2: any = [];

  counters = []
  selectedCounterId;

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  ngOnInit() {
    console.log('Get all rules called');
    this._ruleService.getAllRules().subscribe((data) => {
      console.log('Rules data', data);
      data['rules'].forEach((element) => {
        this.ruleList.push({
          rule_id_list: element.id,
          rule_name: element.name,
        });
      });
      this.selectedRule = this.ruleList[0].rule_id_list;
      this.createChart(this.getRequestBodyPrepared());
      this.loadView = true;
    });
    this._counterService.getRestaurantCounter(sessionStorage.getItem('restaurant_id')).subscribe(
      data => {
        console.log('counters available', data)
        this.counters = data['counters']
      },
      error => {
        console.log('Error: ', error)
      }
    )
  }

  getRequestBodyPrepared() {
    console.log('This is in body: ', this.isITTUser)
    let body = {
      rule_id_list: Array.isArray(this.selectedRule)
        ? this.selectedRule
        : [this.selectedRule],
      restaurant_id: sessionStorage.getItem('restaurant_id')
        ? sessionStorage.getItem('restaurant_id')
        : this.selectedRestaurant,
      item_wise: this.selectedGroup == 'item_wise' ? true : false,
      category_wise: this.selectedGroup == 'category_wise' ? true : false,
      pos: this.isITTUser ? false: true,
    };
    if(this.selectedCounterId){
      body["counter_id"] = this.selectedCounterId
    }
    console.log(
      'New: ',
      this.selectedTimeFrame,
      this.range.value.start,
      this.range.value.end
    );
    if (this.selectedTimeFrame == 'custom') {
      if (this.range.value.start && this.range.value.end) {
        body['time_frame'] = this.selectedTimeFrame;
        body['start_date'] = this.dateUtils.getStandardizedDateFormate(
          this.range.value.start
        );
        body['end_date'] = this.dateUtils.getStandardizedDateFormate(
          this.range.value.end
        );
      } else {
        body = null;
      }
    } else {
      body['time_frame'] = this.selectedTimeFrame;
    }
    return body;
  }

  onValueChange() {
    let field = document.getElementById('calendarInputField');
    console.log('Value changed');
    console.log('THis is selected time frame', this.selectedTimeFrame);
    if (this.selectedTimeFrame == 'custom') {
      field.classList.remove('hidden');
      if (this.range.value.start && this.range.value.end) {
        this.chart1.destroy();
        this.chart2.destroy();
        this.createChart(this.getRequestBodyPrepared());
      }
    } else {
      field.classList.add('hidden');
      this.chart1.destroy();
      this.chart2.destroy();
      this.createChart(this.getRequestBodyPrepared());
    }
  }

  createChart(body) {
    console.log('Body::: ', body);
    if (body) {
      this._analyticsService.getSalesAnalyticsData(body).subscribe(
        (data) => {
          console.log('Got response:: ', this.selectedGroup, data);
          this.totalOrders = data['quantity']['total_quantity'];
          this.totalAmount = data['amount']['total_amount'];
          this.chart1 =
            this.selectedGroup == 'All'
              ? this.createTotalOrdersAnalyticsChart(data)
              : this.selectedGroup == 'category_wise'
              ? this.createCategoryWiseTotalOrderChart(data)
              : this.createItemWiseTotalOrderChart(data);
          this.chart2 =
            this.selectedGroup == 'All'
              ? this.createTotalAmountAnalyticsChart(data)
              : this.selectedGroup == 'category_wise'
              ? this.createCategoryWiseTotalAmountChart(data)
              : this.createItemWiseTotalAmountChart(data);
        },
        (error) => {
          console.log('Error while loading analytics');
        }
      );
    }
  }

  dateChanged() {
    this.createChart(this.getRequestBodyPrepared());
  }

  createTotalAmountAnalyticsChart(data) {
    console.log('creating total amout chart', Object.keys(data));
    let amountData = [];
    for (let ele in data['amount']) {
      amountData.push(data['amount'][ele]);
    }
    return new Chart('canvas1', {
      type: 'bar',
      data: {
        labels: Object.keys(data['amount']),
        datasets: [
          {
            label: 'Total Amount',
            data: amountData,
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  createTotalOrdersAnalyticsChart(data) {
    console.log('creating total orders analytic chart', data);
    let totalOrders = [];
    for (let ele in data['quantity']) {
      console.log('test test: ', data['quantity'][ele]);
      totalOrders.push(data['quantity'][ele]);
    }
    return new Chart('canvas2', {
      type: 'bar',
      data: {
        labels: Object.keys(data['quantity']),
        datasets: [
          {
            label: 'Number of orders',
            data: totalOrders,
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  createCategoryWiseTotalAmountChart(data) {
    console.log('Creating category wise total amout chart');
    let chartData = [];
    for (let point in data['category_wise_data']) {
      chartData.push(data['category_wise_data'][point]['total_amount']);
    }
    return new Chart('canvas1', {
      type: 'bar',
      data: {
        labels: Object.keys(data['category_wise_data']),
        datasets: [
          {
            label: 'Total amount ordered',
            data: chartData,
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  createItemWiseTotalAmountChart(data) {
    console.log('creating item wise total amount chart');
    let chartData = [];
    for (let point in data['item_wise_data']) {
      chartData.push(data['item_wise_data'][point]['total_amount']);
    }
    return new Chart('canvas1', {
      type: 'bar',
      data: {
        labels: Object.keys(data['item_wise_data']),
        datasets: [
          {
            label: 'Amount ordered',
            data: chartData,
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  createCategoryWiseTotalOrderPieChart(data) {
    console.log('Creating category wise pie chart');
    let chartData = [];
    for (let point in data['category_wise_data']) {
      chartData.push(data['category_wise_data'][point]['quantity']);
    }
    return (this.chartOptions = {
      series: chartData,
      chart: {
        width: 380,
        type: 'pie',
      },
      labels: Object.keys(data['category_wise_data']),
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    });
  }

  createCategoryWiseTotalOrderChart(data) {
    console.log('Creating category wise total orders');
    let chartData = [];
    for (let point in data['category_wise_data']) {
      chartData.push(data['category_wise_data'][point]['quantity']);
    }
    return new Chart('canvas2', {
      type: 'bar',
      data: {
        labels: Object.keys(data['category_wise_data']),
        datasets: [
          {
            label: '# of orders',
            data: chartData,
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  createItemWiseTotalOrderChart(data) {
    console.log('Crateing item wise total orders');
    let chartData = [];
    for (let point in data['item_wise_data']) {
      chartData.push(data['item_wise_data'][point]['quantity']);
    }

    return new Chart('canvas2', {
      type: 'bar',
      data: {
        labels: Object.keys(data['item_wise_data']),
        datasets: [
          {
            label: '# of orders',
            data: chartData,
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
