import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from 'src/app/shared/services/data/data.service';
import { LoginService } from 'src/app/shared/services/register/login.service';
import { meAPIUtility, sessionWrapper } from 'src/app/shared/site-variable';
import { ConfirmationDialogComponent } from '../../user_screen/confirmation-dialog/confirmation-dialog.component';
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
    private __sessionWrapper: sessionWrapper,
    private dataShare: DataService,
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
          this.__sessionWrapper.getItem('restaurant_kds') == 'true'? '/owner/orders/pending-orders': this.__sessionWrapper.getItem('restaurantType') == 'e-commerce'? '/owner/orders/unconfirmed-orders' : '/owner/orders/orders-history';
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

  public isPollingRequired =  this.__sessionWrapper.isPollingRequired()
  public restaurantId = Number(this.__sessionWrapper.getItem('restaurant_id'))
  public pollingFrequency = Number(this.__sessionWrapper.getItem('ui_polling_for_mobile_order_receipt_printing_frequency'))
  public isPOSEnabled = this.__sessionWrapper.isPOSEnabled()
  public isKotReciptEnabled = this.__sessionWrapper.isKOTreceiptEnabled()
      
  dropdownList = [ this.AvailableDropdownList['logout']]
  username: string
  message: string
  location: string = sessionStorage.getItem('restaurant_name') || sessionStorage.getItem('organization_name')
  meData: any;
  isRestaurantAdmin: boolean = false
  hasMultipleRestaurants: boolean = false
  hasTableOrderingEnabled: boolean = false
  public pollingInterval;
  counters = [];
  
  ngOnInit(){
    let role = localStorage.getItem('role')
    if(role == 'restaurant_admin') this.addRestaurantOwnerNavOptions();
    else if (role == 'restaurant_staff') this.addRestaurantStaffNavOptions();
    else if (role == 'corporate_admin') this.addAdminNavOptions();
    else this.addUserNavOptions()
    this._meAPIutility.getMeData().subscribe(data => {
      console.log('Header component: ', data)
      this.meData = data
      this.username = data['username'] ? data['username'] : data['email']
      this.hasMultipleRestaurants = data['restaurants'].length > 1
      this.__sessionWrapper.isMultiRestaurantOwner = data['restaurants'].length > 1
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

  addRestaurantStaffNavOptions(){
    let restaurantStaffNavOptions = ['edit_menu', 'orders']
    if(this.isPOSEnabled) restaurantStaffNavOptions.push('POS')
    for(let option of restaurantStaffNavOptions){
      if(this.dropdownList.indexOf(this.AvailableDropdownList[option]) === -1){
        this.dropdownList.splice(0, 0, this.AvailableDropdownList[option])
      }
    }
  }


  addRestaurantOwnerNavOptions(){
    let restaurantOwnerNavOptions
    this.hasTableOrderingEnabled = this.__sessionWrapper.getItem('table_management') == 'true'? true: false;
    let restaurantId = Number(this.__sessionWrapper.getItem('restaurant_id'))
    let hasExpenseManagement = this.__sessionWrapper.getItem('expense_management') == 'true'? true: false;
    let isPOSEnabled = this.__sessionWrapper.isPOSEnabled()
    if(restaurantId == 1 || restaurantId == 2){
      restaurantOwnerNavOptions = ['billing', 'analytics', 'edit_menu' ,'orders']
    }else{
      restaurantOwnerNavOptions = ['analytics', 'edit_menu' ,'orders']
    }
    if (hasExpenseManagement) {
      restaurantOwnerNavOptions.push('expense')
    }
    if (isPOSEnabled) { 
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

  addAdminNavOptions(){
    this.location = this.__sessionWrapper.getItem('company_name')
    let companyId = Number(this.__sessionWrapper.getItem('company_id'))
    let adminNavOptions
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

  setRestaurantsessionVariable(restaurant){
    this.__sessionWrapper.setRestaurantSessionVariables(restaurant)
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

