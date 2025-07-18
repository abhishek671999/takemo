import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/shared/services/register/login.service';
import { meAPIUtility } from 'src/app/shared/site-variable';
import { ConfirmActionDialogComponent } from '../confirm-action-dialog/confirm-action-dialog.component';
import { PrintConnectorService } from 'src/app/shared/services/printer/print-connector.service';
import { HttpParams } from '@angular/common/http';
import { OrdersService } from 'src/app/shared/services/orders/orders.service';
import { ReceiptPrintFormatter } from 'src/app/shared/utils/receiptPrint';
import { CounterService } from 'src/app/shared/services/inventory/counter.service';
import { environment } from 'src/environments/environment';
import { forkJoin } from 'rxjs';
import { ErrorMsgDialogComponent } from '../error-msg-dialog/error-msg-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  constructor(
    private _loginService: LoginService, 
    private router: Router,
    private _meAPIutility: meAPIUtility,
    private matdialog: MatDialog,
    public printerConn: PrintConnectorService,
    private orderService: OrdersService,
    private receiptPrintFormatter: ReceiptPrintFormatter,
    private _counterService: CounterService,
  ) {
    window.addEventListener('offline', this.handleOffline);
    window.addEventListener('online', this.handleOnline);
  }


  private handleOffline = (event: Event) => {
    this.isOnline = false;
    this.router.navigate(['/owner/point-of-sale']);
  };

  private handleOnline = (event: Event) => {
    this.createOfflineOrders();
    this.isOnline = true;
  };


  public isOnline = navigator.onLine
  public isProd = environment.production
  private creatingOrderFlag = false

  public AvailableDropdownList = {
    'profile': {
      name: 'Profile',
      action: () => {
        console.log('My Profile');
        this.router.navigate(['./user/profile']);
      },
    },
    'analytics': {
      name: 'Analytics',
      action: () => {
        console.log('analytics');
        this.router.navigate(['./admin/analytics/']); //fix this
      },
    },
    'shift': {
      name: 'Shift',
      action: () => {
        console.log('User management');
        this.router.navigate(['./admin/user-management']);
      },
    },
    'billing': {
      name: 'Billing',
      action : () => {
        console.log('Billing')
        this.router.navigate(['./admin/billing'])
      }
    },
    'settings': {
      name: 'Settings',
      action: () => console.log('My settings'),
    },
    'edit_menu': {
      name: 'Menu',
      action: () => {
        this.router.navigate(['./owner/settings/edit-menu/'])
      }
    },
    'orders': {
        name: 'Orders',
        action: () => {
          let navigationURL =
          this.restaurantKDS ? '/owner/orders/pending-orders': this.restaurantType == 'e-commerce'? '/owner/orders/unconfirmed-orders' : '/owner/orders/orders-history';
          this.router.navigate([navigationURL]);
        }
    },
    'logout': {
      name: 'Logout',
      action: () =>
        {
          let matdialogRef = this.matdialog.open(ConfirmActionDialogComponent, {data: 'Are you sure want to logout??'})
          matdialogRef.afterClosed().subscribe(
            (data: any) => {
              if(data?.select) this._loginService.logOut()
            }
          )
        }
    },
    'menu':{
      name: 'Outlets',
      action: () => {
        this.router.navigate(['./user'])
      }
    },
    'userOrders': {
      name: 'My Orders',
      action: () => {
        this.router.navigate(['./user/myorders/current-orders'])
      }
    },
    'support': {
      name: 'Support',
      action: () => {
        this.router.navigate(['./user/support'])
      }
    },
    'admin_current_orders': {
      name: 'Orders',
      action: () => {
        this.router.navigate(['./admin/orders'])
      }
    },
    'wallet': {
      name: 'Wallet',
      action: () => {
        this.router.navigate(['./user/wallet'])
      }
    },
    'POS': {
      name: 'POS',
      action: () => {
        this.router.navigate(['./owner/point-of-sale'])
      }
    },
    'expense': {
      name: 'Expense',
      action: () => {
        this.router.navigate(['./owner/expense/expense'])
      }
    },
    'table': {
      name: 'Tables',
      action: () => {
        this.router.navigate(['./owner/dine-in/table-cockpit'])
      }
    },
    'attendance': {
      name: 'Attendance',
      action: () => {
        this.router.navigate(['./shared/attendance/attendance'])
      }
    }
  }

  public isPollingRequired : any;
  public restaurantId: any;
  public pollingFrequency : any;
  public isPOSEnabled : any;
  public isKotReciptEnabled: any;
  public pollingInterval;
  public restaurantKDS:boolean
  public restaurantType: string

  public location: string;
  public meData: any;
  public isRestaurantAdmin: boolean = false
  public hasMultipleRestaurants: boolean = false
  public hasTableOrderingEnabled: boolean = false
  public hasExpenseManagement: boolean = false
  public pollingCallStarted: boolean = false
  public printerRequired: boolean = false

  public counters = [];
  public dropdownList = [ this.AvailableDropdownList['logout']]
  public userType: string;
  
  ngOnInit(){
    let host = new URL(environment.host)
    console.log(host)
    let currentPath = new URL(window.location.href)

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        
        navigator.serviceWorker.getRegistration().then(function(registration) {
          registration.active?.postMessage({
            type: 'setConfig',
            host: host.hostname,
            pathName: currentPath.pathname
          });
        })

        navigator.serviceWorker.getRegistration().then(function(reg) {
          // There's an active SW, but no controller for this tab.
          if (reg.active && !navigator.serviceWorker.controller) {
            // Perform a soft reload to load everything from the SW and get
            // a consistent set of resources.
            window.location.reload();
          }
        });
      });

      navigator.serviceWorker.addEventListener('message', (event) => {
         if(event.data.type == 'redirection'){
          this.router.navigate([event.data.url])
         }
      });
    }

    this._meAPIutility.getRestaurant().subscribe(
      (data) => {
        this.hasTableOrderingEnabled = data['table_management']
        this.restaurantId = Number(data['restaurant_id'])
        this.hasExpenseManagement = data['expense_management']
        this.isPOSEnabled = data['pos']
        this.pollingFrequency = Number(data['ui_polling_for_mobile_order_receipt_printing_frequency'])
        this.isPollingRequired = data['ui_polling_for_mobile_order_receipt_printing']
        this.location = data['restaurant_name']
        this.restaurantKDS = data['restaurant_kds']
        this.restaurantType = data['type']
        this.userType = data['role_name']
        this.isKotReciptEnabled = data['kot_receipt']
        this.printerRequired = data['printer_required'];
        if(this.isPollingRequired) this.fetchCounters()
        if(this.userType == 'restaurant_admin'){
          this.addRestaurantOwnerNavOptions(data)
        }else if(this.userType == 'restaurant_staff'){
          this.addRestaurantStaffNavOptions(data)
        }
      }
    )

    this._meAPIutility.getCompany().subscribe(
      (data) => {
        this.location = data['organization_name']
        this.userType = data['role_name']
        if(this.userType == 'corporate_admin'){
          this.addAdminNavOptions(data)
        }
      }
    )

    this._meAPIutility.getMeData().subscribe(data => {
      this.meData = data
      console.log(this.meData)
      this.hasMultipleRestaurants = data['restaurants'].length > 1
      if(data['restaurants'].length == 0 && data['companies'].length == 0) {
        this.addUserNavOptions()
        this.userType = 'user'
        }
      }
    )

    if(this.isPollingRequired){
      this.printerConn.printerConnected.subscribe(
        (data: any) => {
          if(data){
            console.log('Header: isPolling', data, this.pollingInterval)
            if(!this.pollingInterval) {
              this.pollingInterval = this.startMobileOrderingPoll()
            }
          }else{
            if(this.pollingInterval){
              this.pollingInterval = clearInterval(this.pollingInterval)
              this.pollingInterval = null
            } 
          }
        }
      )
    } 
    
   }  

  
  addUserNavOptions(){
    let userNavOptions = [ 'menu', 'userOrders']
    for(let option of userNavOptions){
      if(this.dropdownList.indexOf(this.AvailableDropdownList[option]) === -1){
        this.dropdownList.splice(0, 0, this.AvailableDropdownList[option])
      }
    }
  }

  addRestaurantStaffNavOptions(data){
    let restaurantStaffNavOptions
    if(this.restaurantId == 1 || this.restaurantId == 2){
      restaurantStaffNavOptions = ['billing', 'analytics', 'edit_menu' ,'orders']
    }else{
      restaurantStaffNavOptions = ['attendance', 'analytics', 'edit_menu' ,'orders']
    }
    if (this.hasExpenseManagement) {
      restaurantStaffNavOptions.push('expense')
    }
    if (this.isPOSEnabled) { 
      restaurantStaffNavOptions.push('POS') 
    }
    if (this.hasTableOrderingEnabled) {
      restaurantStaffNavOptions.push('table')
    }
    for(let option of restaurantStaffNavOptions){
      if(this.dropdownList.indexOf(this.AvailableDropdownList[option]) === -1){
        this.dropdownList.splice(0, 0, this.AvailableDropdownList[option])
      }
    }
  }


  addRestaurantOwnerNavOptions(restaurant){
    let restaurantOwnerNavOptions
    if(this.restaurantId == 1 || this.restaurantId == 2){
      restaurantOwnerNavOptions = ['billing', 'analytics', 'edit_menu' ,'orders']
    }else{
      restaurantOwnerNavOptions = ['attendance', 'analytics', 'edit_menu' ,'orders']
    }
    if (this.hasExpenseManagement) {
      restaurantOwnerNavOptions.push('expense')
    }
    if (this.isPOSEnabled) { 
      restaurantOwnerNavOptions.push('POS') 
    }
    if (this.hasTableOrderingEnabled) {
      restaurantOwnerNavOptions.push('table')
    }
    for(let option of restaurantOwnerNavOptions){
      if(this.dropdownList.indexOf(this.AvailableDropdownList[option]) === -1){
        this.dropdownList.splice(0, 0, this.AvailableDropdownList[option])
      }
    }
  }

  addAdminNavOptions(company){
    this.location = company.company_name
    let companyId = Number(company.company_id)
    let adminNavOptions;
    if(companyId == 1){
      adminNavOptions = ['userOrders', 'menu', 'admin_current_orders',  'billing', 'analytics', 'shift']
    }else{
      adminNavOptions = ['userOrders', 'menu', 'admin_current_orders', 'analytics', 'shift']
    }
    for(let option of adminNavOptions){
      if(this.dropdownList.indexOf(this.AvailableDropdownList[option]) === -1){
        this.dropdownList.splice(0, 0, this.AvailableDropdownList[option])
      }
    }
  }

  onClick(index: number) {
    let checkbox = document.getElementById('hamburger-checkbox') as HTMLInputElement;
    checkbox.checked = false
    this.dropdownList[index].action();
  }

  onHeaderIconClick(key: string){
    let checkbox = document.getElementById('hamburger-checkbox') as HTMLInputElement;
    checkbox.checked = false
    this.AvailableDropdownList[key].action()
  }

  setRestaurantVariable(restaurant){
    this._meAPIutility.setRestaurant(restaurant)
    window.location.reload()
  }

  getSelectedRestaurantId(){
    return localStorage.getItem('restaurant_id')
  }

  closeNav(){
    let checkbox = document.getElementById('hamburger-checkbox') as HTMLInputElement;
    checkbox.checked = false
  }

  connectToPrinter(){
    this.printerConn.seekUSB()
  }

  fetchCounters(){
    this._counterService
      .getRestaurantCounter(this.restaurantId)
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

  startMobileOrderingPoll(){
    let httpParams = new HttpParams()
    httpParams = httpParams.append('restaurant_id', this.restaurantId)
    return setInterval(() => {
      if(!this.pollingCallStarted){
        this.pollingCallStarted = true
        this.orderService.getMobileOrdersToPrint(httpParams).subscribe(
          (data: any) => {
            let printedKOTOrderIds = []
            let printedWKOTOrderIds = []
            data['orders'].forEach((order) => {
              this.receiptPrintFormatter.confirmedOrderObj = order
              if(order.kot_printed == false && this.isKotReciptEnabled){
                let printObjs = this.receiptPrintFormatter.getKOTReceiptText(this.counters)
                let printStatus = false
                printObjs.forEach((printObj) => {
                  printStatus = this.print(printObj)
                })
                if(printStatus) printedKOTOrderIds.push(order.order_id)
              } 
            if(order.wkot_printed == false){
                let printObjs = this.receiptPrintFormatter.getWKOTReceiptText(this.counters)
                let printStatus = false
                printObjs.forEach((printObj) => {
                  printStatus = this.print(printObj)
                })
                if(printStatus) printedWKOTOrderIds.push(order.order_id)
              }
            })
          if(printedKOTOrderIds.length > 0 || printedWKOTOrderIds.length > 0){
            let body = {
              "kot_order_ids": printedKOTOrderIds,
              "wkot_order_ids": printedWKOTOrderIds,
              "restaurant_id": this.restaurantId
            }
            this.orderService.markOrderAsPrinted(body).subscribe(
              (data) => {
                console.log(data)
                this.pollingCallStarted = false
              },
              (error) => {
                console.log(error)
                this.pollingCallStarted = false
              }
            )
          }else{
            this.pollingCallStarted = false
          }
        },
        (error) => {
          this.pollingCallStarted = false
        }
      )
      }
    }, this.pollingFrequency * 1000);

  }

  print(printObjs){
    if(this.printerConn.usbSought){
      let printConnect = this.printerConn.printService.init();
      printObjs.forEach((ele) => {
        if (ele.text != '') {
          printConnect.writeCustomLine(ele);
        }
      });
      printConnect
        .feed(4)
        .cut()
        .flush();
        return true
    }else{
      return false
    }
  }

  createOfflineOrders(){
    let cachedOrders = JSON.parse(localStorage.getItem('cached_orders')) || []
    if(cachedOrders.length > 0 && !this.creatingOrderFlag){
      this.creatingOrderFlag = true
      let body = {
        restaurant_id: this.restaurantId,
        offline_orders: cachedOrders
      }
      this.orderService.createOfflineOrders(body).subscribe(
        (response: any) => {
          let lastOrderNumber = response['order_no'] || localStorage.getItem('last_order_no')
          localStorage.clear()
          localStorage.setItem('cached_orders', JSON.stringify([]))
          localStorage.setItem('last_order_no', lastOrderNumber)
          this.creatingOrderFlag = false
        },
        (error: any) => {
          this.matdialog.open(ErrorMsgDialogComponent, {data: {msg: 'Failed to create offline orders'}})
          this.creatingOrderFlag = false
        }
      )
    }

  }
  
  ngOnDestroy() {
    sessionStorage.removeItem('table_id');
    sessionStorage.removeItem('table_name');
    if(this.pollingInterval){
      this.pollingInterval = clearInterval(this.pollingInterval)
    } 
    window.removeEventListener('offline', this.handleOffline);
    window.removeEventListener('online', this.handleOnline);
  }

}

