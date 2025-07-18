import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { MenuService } from 'src/app/shared/services/menu/menu.service';
import { RulesService } from 'src/app/shared/services/roles/rules.service';
import { dateUtils } from 'src/app/shared/utils/date_utils';
import { meAPIUtility } from 'src/app/shared/site-variable';
import { CounterService } from 'src/app/shared/services/inventory/counter.service';
import { MatTableDataSource } from '@angular/material/table';
import { PrintConnectorService } from 'src/app/shared/services/printer/print-connector.service';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CacheService } from 'src/app/shared/services/cache/cache.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-timely-analytics',
  templateUrl: './timely-analytics.component.html',
  styleUrls: ['./timely-analytics.component.css'],
})
export class TimelyAnalyticsComponent {
  constructor(
    private _analyticsService: AnalyticsService,
    private _menuService: MenuService,
    private _ruleService: RulesService,
    private dateUtils: dateUtils,
    private meUtility: meAPIUtility,
    private _counterService: CounterService,
    public printerConn: PrintConnectorService,
    private cacheService: CacheService
  ) {
    this.assignedRestaurantList = this.cacheService.get('restaurants') || []
   }

  @ViewChild(MatSort)
  sort: MatSort = new MatSort;
  @ViewChild('TABLE') table: ElementRef;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  private _liveAnnouncer = inject(LiveAnnouncer);

  timeFramesForTimelyAnalytics = [
    { displayValue: 'Today', actualValue: 'today' },
    { displayValue: 'Yesterday', actualValue: 'yesterday' }, 
    { displayValue: 'Last 30 days', actualValue: 'last_30_days' },
    { displayValue: 'Last month', actualValue: 'last_month' },
    // { displayValue: 'Last week', actualValue: 'last_week'}, //future
    { displayValue: 'Last 12 months', actualValue: 'last_12_months' },
    { displayValue: 'Calendar', actualValue: 'custom'}
  ];
  categoryList = [{ name: 'select', id: 0 }];
  itemList = [{ name: 'select', id: 0 }];

  public dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['Date', 'quantity', 'total_amount'];

  restaurantList = [
    // { displayValue: 'All', restaurant_id: 0},
    { displayValue: 'Amulya Kitchen', restaurant_id: 1 },
    { displayValue: 'Honey Dew Kitchen', restaurant_id: 2 },
  ];

  public assignedRestaurantList = []

  selectedTimeFrameForTimelyAnalytics: string =
    this.timeFramesForTimelyAnalytics[0].actualValue;
  selectedCategory = this.categoryList[0];
  selectedItem = this.itemList[0];
  selectedRestaurantwithCompany: number = this.restaurantList[0].restaurant_id;
  selectedRestaurant: number
  restaurantFlag: boolean;

  selectedDate = new Date();

  selectedRule;
  ruleList = [];
  totalAmount = 0;
  totalOrders = 0;
  loadView = false;
  isITTUser: boolean = false
  tableView = true;
  counters = [];
  selectedCounterId;
  dataLoadSpinner = true;

  chart2: any = [];
  chart4: any = [];
  public restaurant


  ngOnInit() {
    this._ruleService.getAllRules().subscribe((data) => {
      data['rules'].forEach((element) => {
        this.ruleList.push({ rule_id: element.id, rule_name: element.name });
      });
      this.selectedRule = this.ruleList[0].rule_id;
      
      this.loadView = true;
    });

    this.meUtility.getRestaurant().subscribe(
      (restaurant) => {
        this.restaurant = restaurant
        this.isITTUser = this.meUtility.doesUserBelongToITT
        this.restaurantFlag = this.restaurant['restaurant_id']? true : false;
        if (this.restaurant['role_name'] == 'restaurant_staff') this.timeFramesForTimelyAnalytics = this.timeFramesForTimelyAnalytics.slice(0,2)
        this.selectedRestaurant = this.restaurant['restaurant_id'] ? this.restaurant['restaurant_id']: this.restaurantList[0].restaurant_id
        this._menuService.getMenu(this.selectedRestaurant).subscribe((data) => {
          data['menu'].forEach((element) => {
            this.categoryList.push({
              name: element.category.name,
              id: element.category.id,
            });
            element.category.items.forEach((element) => {
              this.itemList.push({ name: element.name, id: element.id });
            });
          });
        });


        this._counterService
        .getRestaurantCounter(this.restaurant['restaurant_id'])
        .subscribe(
          (data) => {
            console.log('counters available', data);
            this.counters = data['counters'];
          },
          (error) => {
            console.log('Error: ', error);
          }
        );
        
      }
    )

      setTimeout(() => {
        this.createTimelyAnalytics(this.getRequestBodyPrepared());
      }, 2000);
  }

  ngAfterViewInit(){
    this.dataSource.sort = this.sort
    this.dataSource.paginator = this.paginator;
  }

  onToggle(event) {
    this.tableView = !this.tableView;
    this.onValueChange('none');
  }

  onValueChange(value: string) {
    this.dataLoadSpinner = true

    if (value == 'item') {
      this.selectedCategory = { name: 'select', id: 0 };
    } else if (value == 'category') {
      this.selectedItem = { name: 'select', id: 0 };
    }
    console.log('IN value change', this.selectedTimeFrameForTimelyAnalytics);
    if (this.selectedTimeFrameForTimelyAnalytics == 'custom') {
      if (this.selectedDate) {
        try {
          this.chart2.destroy();
          this.chart4.destroy();
        } catch (error) {
          console.log(error);
        }
        this.createTimelyAnalytics(this.getRequestBodyPrepared());
      }
    } else {
      try {
        this.chart2.destroy();
        this.chart4.destroy();
      } catch (error) {
        console.log(error);
      }
      this.createTimelyAnalytics(this.getRequestBodyPrepared());
    }

    console.log(
      'THis is onValue change',
      value,
      this.selectedTimeFrameForTimelyAnalytics,
      this.selectedCategory,
      this.selectedItem
    );
  }


  getRequestBodyPrepared() {
    let selectedRestaurant = this.assignedRestaurantList.filter((restaurant) => restaurant.restaurant_id == this.selectedRestaurant)
    let restaurantPOS = selectedRestaurant.length > 0 ? selectedRestaurant[0]['pos'] : false
    let body = {
      rule_id_list: Array.isArray(this.selectedRule)
        ? this.selectedRule
        : [this.selectedRule],
      restaurant_id:this.selectedRestaurant? this.selectedRestaurant: this.selectedRestaurantwithCompany,
      category_id: this.selectedCategory.id,
      item_id: this.selectedCategory.id == 0 ? this.selectedItem.id : '',
      pos: (!this.isITTUser && restaurantPOS),
    };
    if (this.selectedCounterId) {
      body['counter_id'] = this.selectedCounterId;
    }
    console.log(
      'New: ',
      this.selectedTimeFrameForTimelyAnalytics,

    );
    if (this.selectedTimeFrameForTimelyAnalytics == 'custom') {
      if (this.selectedDate) {
        body['time_frame'] = this.selectedTimeFrameForTimelyAnalytics;
        body['date'] = this.dateUtils.getStandardizedDateFormate(
          new Date(this.selectedDate)
        );
      } else {
        body = null;
      }
    } else {
      body['time_frame'] = this.selectedTimeFrameForTimelyAnalytics;
    }
    return body;
  }

  createTimelyAnalytics(body) {
    console.log('this is body:: ', body);
    if (body) {
      this._analyticsService.getTimelyAnalyticsData(body).subscribe(
        (data) => {
          console.log(data)
          console.log(
            'Timely analytics',
            data[this.selectedTimeFrameForTimelyAnalytics],
            this.selectedTimeFrameForTimelyAnalytics
          );
          this.totalOrders = data['quantity'];
          this.totalAmount = data['total_amount'];
          if (this.tableView) {
            this.dataSource.data = this.parseResponse(data);
          } else {
            this.chart2 = this.createTimelyOrderAnalyticsChart(
              data,
              this.selectedTimeFrameForTimelyAnalytics
            );
            this.chart4 = this.createTimelyAmountAnalyticsChart(
              data,
              this.selectedTimeFrameForTimelyAnalytics
            );
          }
          this.dataLoadSpinner = false
        },
        (error) => {
          console.log('Error in create timely anlaytics');
          this.dataLoadSpinner = false
        }
      );
    }
  }

  parseResponse(data) {
    let tabulatedResponse = [];
    Object.entries(data[this.selectedTimeFrameForTimelyAnalytics]).forEach(
      ([key, value], index) => {
        tabulatedResponse.push({
          date: key,
          position: index + 1,
          name: key,
          quantity: value['quantity'],
          total_amount: value['total_amount'],
        });
      }
    );
    console.log(tabulatedResponse);
    return tabulatedResponse;
  }

  createTimelyOrderAnalyticsChart(data, time_frame) {
    let ordersData = [];
    for (let ele in data[time_frame]) {
      ordersData.push(data[time_frame][ele]['quantity']);
    }
    return new Chart('canvas3', {
      type: 'bar',
      data: {
        labels: Object.keys(data[time_frame]),
        datasets: [
          {
            label: 'Num of orders',
            data: ordersData,
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

  createTimelyAmountAnalyticsChart(data, time_frame) {
    let AmountsData = [];
    for (let ele in data[time_frame]) {
      AmountsData.push(data[time_frame][ele]['total_amount']);
    }
    return new Chart('canvas4', {
      type: 'bar',
      data: {
        labels: Object.keys(data[time_frame]),
        datasets: [
          {
            label: 'Total Amount',
            data: AmountsData,
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
        text: this.restaurant['restaurant_name'],
        size: 'xlarge',
        bold: true,
        justification: 'center',
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
  getFixedLengthString(string, length, prefix = true, fixValue = '0') {
    string = String(string);
    console.log('string length', string.toLocaleString().length);
    return string.length > length
      ? string.substring(0, length)
      : prefix
        ? fixValue.repeat(length - string.length) + string
        : string + fixValue.repeat(length - string.length);
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

    exportAsExcel()
    {
      const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);//converts a DOM TABLE element to a worksheet
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
      /* save to file */
      XLSX.writeFile(wb, 'Timely_analytics.xlsx');
  
    }

}
