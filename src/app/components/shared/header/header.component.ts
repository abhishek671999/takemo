import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from 'src/app/shared/services/data/data.service';
import { LoginService } from 'src/app/shared/services/register/login.service';
import { meAPIUtility, sessionWrapper } from 'src/app/shared/site-variable';
import { ConfirmationDialogComponent } from '../../user_screen/confirmation-dialog/confirmation-dialog.component';
import { ConfirmActionDialogComponent } from '../confirm-action-dialog/confirm-action-dialog.component';

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
    private matdialog: MatDialog
  ) {
    }
    AvailableDropdownList = {
      'profile': {
        name: 'Profile',
        action: () => {
          console.log('My Profile');
          this.router.navigate(['./admin/myprofile']);
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
  
  public isPOSEnabled = this.__sessionWrapper.isPOSEnabled()

    addAdminNavOptions(company){
      this.location = company.company_name
      let adminNavOptions
      if(company.id == 1){
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
  
  addRestaurantOwnerNavOptions(restaurant){
    let restaurantOwnerNavOptions

    if(restaurant.restaurant_id == 1 || restaurant.restaurant_id == 2){
      restaurantOwnerNavOptions = ['billing', 'analytics', 'edit_menu' ,'orders']
    }else{
      restaurantOwnerNavOptions = ['analytics', 'edit_menu' ,'orders']
    }
    if (restaurant.expense_management) {
      restaurantOwnerNavOptions.push('expense')
    }
    if (this.isPOSEnabled) { 
      restaurantOwnerNavOptions.push('POS') 
    }
    if (restaurant.table_management) {
      restaurantOwnerNavOptions.push('table')
    }
    for(let option of restaurantOwnerNavOptions){
      if(this.dropdownList.indexOf(this.AvailableDropdownList[option]) === -1){
        this.dropdownList.splice(0, 0, this.AvailableDropdownList[option])
      }
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

    
  dropdownList = [ this.AvailableDropdownList['logout']]
  username: string
  message: string
  location: string = sessionStorage.getItem('restaurant_name') || sessionStorage.getItem('organization_name')
  meData: any;
  isRestaurantAdmin: boolean = false
  hasMultipleRestaurants: boolean = false

  ngOnInit(){
      this._meAPIutility.getMeData().subscribe(data => {
        console.log('Header component: ', data)
        this.meData = data
      this.username = data['username'] ? data['username'] : data['email']
      this.hasMultipleRestaurants = data['restaurants'].length > 1
          for(let company of data['companies']){
            if(company.role_name == 'corporate_admin'){
              this.addAdminNavOptions(company)
              break
            }
          }
          for(let restaurant of data['restaurants']){
            if(restaurant.role_name == 'restaurant_admin'){
              this.isRestaurantAdmin = true
              this.addRestaurantOwnerNavOptions(restaurant)
              break
            }else if(restaurant.role_name == 'restaurant_staff'){
              this.addRestaurantStaffNavOptions()
              break
            }
          }
          if(data['restaurants'].length == 0 && data['companies'].length == 0){
            this.addUserNavOptions()
        }
      })

    
   }  

  onClick(index: number) {
    let checkbox = document.getElementById('hamburger-checkbox') as HTMLInputElement;
    checkbox.checked = false
    this.dropdownList[index].action();
  }

  setRestaurantsessionVariable(restaurant){
    this.__sessionWrapper.setRestaurantSessionVariables(restaurant)
    window.location.reload()
  }

  getSelectedRestaurantId(){
    return localStorage.getItem('restaurant_id')
  }

}

