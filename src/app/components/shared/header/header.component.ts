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
  }

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

  public counters = [];
  public dropdownList = [ this.AvailableDropdownList['logout']]
  
  ngOnInit(){
    this._meAPIutility.getRestaurant().subscribe(
      (data) => {
        this.hasTableOrderingEnabled = data['table_management']
        this.restaurantId = Number(data['restaurant_id'])
        this.hasExpenseManagement = data['expense_management']
        this.isPOSEnabled = data['pos']
        this.pollingFrequency = Number(data['ui_polling_for_mobile_order_receipt_printing_frequency'])
        this.restaurantId = Number(data['restaurant_id'])
        this.isPollingRequired = data['ui_polling_for_mobile_order_receipt_printing']
        this.location = data['restaurant_name']
        this.restaurantKDS = data['restaurant_kds']
        this.restaurantType = data['type']

        if(data['role_name'] == 'restaurant_admin'){
          this.addRestaurantOwnerNavOptions(data)
        }else if(data['role_name'] == 'restaurant_staff'){
          this.addRestaurantStaffNavOptions(data)
        }
      }
    )

    this._meAPIutility.getCompany().subscribe(
      (data) => {
        this.location = data['organization_name']
        if(data['role_name'] == 'corporate_admin'){
          this.addAdminNavOptions(data)
        }
      }
    )

    this._meAPIutility.getMeData().subscribe(data => {
      this.meData = data
      this.hasMultipleRestaurants = data['restaurants'].length > 1
      if(data['restaurants'].length == 0 || data['companies'].length == 0) this.addUserNavOptions()
      }
    )

    this.fetchCounters()
    if(this.isPollingRequired){
      this.printerConn.printerConnected.subscribe(
        (data: any) => {
          if(data){
            this.pollingInterval = this.startMobileOrderingPoll()
          }else{
            if(this.pollingInterval) clearInterval(this.pollingInterval)
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
    let restaurantStaffNavOptions = ['edit_menu', 'orders']
    if(this.isPOSEnabled) restaurantStaffNavOptions.push('POS')
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
      restaurantOwnerNavOptions = ['analytics', 'edit_menu' ,'orders']
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
            },
            (error) => {
              console.log(error)
            }
          )
        }
      }
    )
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


  
  ngOnDestroy() {
    sessionStorage.removeItem('table_id');
    sessionStorage.removeItem('table_name');
  }

}

