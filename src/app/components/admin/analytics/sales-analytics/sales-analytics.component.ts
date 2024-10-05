import { Component, inject, ViewChild } from '@angular/core';
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
import { sessionWrapper } from 'src/app/shared/site-variable';
import { CounterService } from 'src/app/shared/services/inventory/counter.service';
import { MatTableDataSource } from '@angular/material/table';
import { PrintConnectorService } from 'src/app/shared/services/printer/print-connector.service';
import { SendEmailReportDialogComponent } from '../../dialogbox/send-email-report-dialog/send-email-report-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { StringUtils } from 'src/app/shared/utils/stringUtils';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';


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

  @ViewChild(MatSort)
  sort: MatSort = new MatSort;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    private _analyticsService: AnalyticsService,
    private _menuService: MenuService,
    private _ruleService: RulesService,
    private dateUtils: dateUtils,
    private __sessionWrapper: sessionWrapper,
    private _counterService: CounterService,
    public printerConn: PrintConnectorService,
    private __matDialog: MatDialog,
    public stringUtils: StringUtils,
  ) {
    
  }

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
  groupList = [
    { displayValue: 'All', actualValue: 'All' },
    { displayValue: 'Item Wise', actualValue: 'item_wise' },
    { displayValue: 'Category Wise', actualValue: 'category_wise' },
  ];

  orderTypes = [
    { displayValue: 'New orders', actualValue: 'unconfirmed' },
    { displayValue: 'Confirmed', actualValue: 'confirmed' },
    { displayValue: 'Delivered', actualValue: 'delivered' },
    { displayValue: 'Rejected', actualValue: 'rejected' },
  ];

  restaurantList = [
    // { displayValue: 'All', restaurant_id: 0},
    { displayValue: 'Amulya Kitchen', restaurant_id: 1 },
    { displayValue: 'Honey Dew Kitchen', restaurant_id: 2 },
  ];

  paymentMethods = [
    // hardcode
    { displayValue: 'All', codedList: [2, 5, 6, 7, 8] },
    { displayValue: 'Mobile', codedList: [2] },
    { displayValue: 'POS', codedList: [5, 6, 7, 8] },
  ];

  ruleList = [];
  loadView = false;
  selectedGroup: string = this.groupList[0].actualValue;
  selectedTimeFrame: string = this.timeFrames[0].actualValue;
  selectedRestaurant: number = this.restaurantList[0].restaurant_id;
  selectPaymentMethod: number[] = this.paymentMethods[0].codedList;
  selectedOrderStatus: string = this.orderTypes[0].actualValue;
  selectedRule;
  totalAmount = 0;
  totalOrders = 0;
  restaurantFlag = this.__sessionWrapper.getItem('restaurant_id')
    ? true
    : false;
  hasOrderTypes =
    this.__sessionWrapper.getItem('restaurantType') == 'e-commerce'
      ? true
      : false;
  isITTUser = this.__sessionWrapper.doesUserBelongsToITT();
  isRaviGobiUser = this.__sessionWrapper.doesUserBelongsToRaviGobi();

  chart1: any = [];
  chart2: any = [];

  counters = [];
  selectedCounterId;
  tableView = true;
  dataLoadSpinner = false;

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  ELEMENT_DATA = [];
  

  displayedColumns: string[] = ['position', 'name', 'quantity', 'total_amount'];
  public dataSource = new MatTableDataSource();

  ngOnInit() {
    this._ruleService.getAllRules().subscribe((data) => {
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
    this._counterService
      .getRestaurantCounter(this.__sessionWrapper.getItem('restaurant_id'))
      .subscribe(
        (data) => {
          this.counters = data['counters'];
        },
        (error) => {
          console.log('Error: ', error);
        }
      );
  }

  ngAfterViewInit(){
    this.dataSource.sort = this.sort
    this.dataSource.paginator = this.paginator;
  }

  onToggle(event) {
    this.tableView = !this.tableView;
    this.onValueChange();
  }

  getRequestBodyPrepared() {
    let body = {
      rule_id_list: Array.isArray(this.selectedRule)
        ? this.selectedRule
        : [this.selectedRule],
      restaurant_id: this.__sessionWrapper.getItem('restaurant_id')
        ? this.__sessionWrapper.getItem('restaurant_id')
        : this.selectedRestaurant,
      item_wise: this.selectedGroup == 'item_wise' ? true : false,
      category_wise: this.selectedGroup == 'category_wise' ? true : false,
      pos: this.isITTUser ? false : true,
    };
    if (this.selectedCounterId) {
      body['counter_id'] = this.selectedCounterId;
    }
    if (this.isRaviGobiUser) {
      body['payment_mode_list'] = this.selectPaymentMethod;
    }
    if (this.hasOrderTypes) {
      body['order_status'] = this.selectedOrderStatus;
      body['ecom'] = this.hasOrderTypes;
    }
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
    this.dataLoadSpinner = true;
    let field = document.getElementById('calendarInputField');
    if (this.selectedTimeFrame == 'custom') {
      field.classList.remove('hidden');
      if (this.range.value.start && this.range.value.end) {
        try {
          this.chart1.destroy();
          this.chart2.destroy();
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      field.classList.add('hidden');
      try {
        this.chart1.destroy();
        this.chart2.destroy();
      } catch (error) {
        console.log(error);
      }
    }
    this.createChart(this.getRequestBodyPrepared());
  }

  parseAllOrders(data) {
    let parsedArray = [];
    let quantity = data['quantity'];
    let amount = data['amount'];
    let paymentList = [];
    Object.entries(amount).forEach(([key, value], index) =>
      paymentList.push(key.split('_')[0])
    );
    paymentList.forEach((value, index) => {
      parsedArray.push({
        position: index + 1,
        name: value,
        quantity: quantity[value + '_quantity'],
        total_amount: amount[value + '_amount'],
      });
    });
    return parsedArray;
  }

  parseOrdersCategoryWise(data) {
    let parsedArray = [];
    let categoryWiseData = data['category_wise_data'];
    Object.entries(categoryWiseData).forEach(([key, value], index) => {
      parsedArray.push({
        position: index + 1,
        name: key,
        quantity: value['quantity'],
        total_amount: value['total_amount'],
      });
    });
    return parsedArray;
  }

  parseOrdersItemWise(data) {
    let parsedArray = [];
    let itemWiseData = data['item_wise_data'];
    Object.entries(itemWiseData).forEach(([key, value], index) => {
      parsedArray.push({
        position: index + 1,
        name: key,
        quantity: value['quantity'],
        total_amount: value['total_amount'],
      });
    });
    return parsedArray;
  }

  parseResponse(data) {
    let parsedOrders =
      this.selectedGroup == 'All'
        ? this.parseAllOrders(data)
        : this.selectedGroup == 'category_wise'
        ? this.parseOrdersCategoryWise(data)
        : this.parseOrdersItemWise(data);
    return parsedOrders;
  }

  createChart(body) {
    if (body) {
      this._analyticsService.getSalesAnalyticsData(body).subscribe(
        (data) => {
          this.totalOrders = data['quantity']['total_quantity'];
          this.totalAmount = data['amount']['total_amount'];
          if (this.tableView) {
            this.dataSource.data = this.parseResponse(data);
          } else {
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
          }
          this.dataLoadSpinner = false;
        },
        (error) => {
          console.log('Error while loading analytics');
          this.dataLoadSpinner = false;
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

  async printSalesAnalytics() {
    let a = (await this.printerConn.usbSought)
      ? null
      : this.printerConn.seekUSB();
    console.log(a);
    if (this.printerConn.usbSought) {
      let printConnect = this.printerConn.printService.init();
      this.getPrintableText().forEach((ele) => {
        printConnect.writeCustomLine(ele);
      });
      printConnect.feed(4).cut().flush();
    } else {
      console.log('No printer connected');
    }
  }

  getPrintableText() {
    let sectionSeperatorCharacters = '-'.repeat(40);
    let content = [
      {
        text: this.__sessionWrapper.getItem('restaurant_name'),
        size: 'xlarge',
        bold: true,
        justification: 'center',
      },
      {
        text: this.getDatesection(),
        justification: 'left',
      },
      {
        text: sectionSeperatorCharacters,
      },
      {
        text: this.getFormattedTableToPrint(),
        justification: 'center',
      },
    ];
    console.log('Content: ', content);
    return content;
  }

  getFormattedTableToPrint() {
    let tableHeader = 'No  Title               Orders  Amount  \n';
    let formattedText = '';
    this.dataSource.data.forEach((ele) => {
      let slNo = this.getFixedLengthString(ele['position'], 2, true, '0');
      let title = this.getFixedLengthString(ele['name'], 18, false, ' ');
      let orders = this.getFixedLengthString(ele['quantity'], 6, true, ' ');
      let amount = this.getFixedLengthString(
        'Rs' + ele['total_amount'],
        7,
        false,
        ' '
      );

      formattedText += `${slNo}  ${title}  ${orders}  ${amount}\n`;
    });
    return formattedText == '' ? '' : tableHeader + formattedText;
  }

  getDatesection() {
    let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
    let printDate = this.dateUtils.getDateForRecipePrint();
    let reportDate =
      this.selectedTimeFrame == 'yesterday'
        ? this.dateUtils.getDateForRecipePrint(yesterday, false)
        : this.dateUtils.getDateForRecipePrint();
    return `Print date: ${printDate}\n Report date: ${reportDate}`;
  }

  getFixedLengthString(string, length, prefix = true, fixValue = '0') {
    string = String(string);
    console.log('string length', string.toLocaleString().length);
    return string.length > length
      ? string.substring(0, length)
      : prefix
      ? fixValue.repeat(length - string.length) + string
      : string + fixValue.repeat(length - string.length);
  }

  openSendEmailDialogBox() {
    let dialogRef = this.__matDialog.open(SendEmailReportDialogComponent, {data: {requestBody: this.getRequestBodyPrepared()}});
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


}
