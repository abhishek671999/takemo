import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectComponentsService } from 'src/app/shared/services/connect-components/connect-components.service';
import { LoginService } from 'src/app/shared/services/register/login.service';
import { MeService } from 'src/app/shared/services/register/me.service';
import { Utility, meAPIUtility } from 'src/app/shared/site-variable';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  constructor(
    private _loginService: LoginService, 
    private router: Router,
    private _meAPIutility: meAPIUtility) {
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
          this.router.navigate(['./admin/analytics/sales-analytics']);
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
          this.router.navigate(['./owner/settings/edit-menu/' + sessionStorage.getItem('restaurant_id')])
        }
      },
      'orders': {
          name: 'Orders',
          action: () => {
            let navigationURL =
            sessionStorage.getItem('restaurant_kds') == 'true'? '/owner/orders/pending-orders': sessionStorage.getItem('restaurantType') == 'e-commerce'? '/owner/orders/unconfirmed-orders' : '/owner/orders/orders-history';
            this.router.navigate([navigationURL]);
          }
      },
      'logout': {
        name: 'Logout',
        action: () => this._loginService.logOut(),
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
      }
    }
  
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
    this.location = restaurant.restaurant_name

    if(restaurant.restaurant_id == 1 || restaurant.restaurant_id == 2){
      restaurantOwnerNavOptions = ['billing', 'analytics', 'edit_menu',  ,'orders']
    }else{
      restaurantOwnerNavOptions = ['analytics', 'edit_menu' ,'orders']
    }
    if (restaurant.expense_management) {
      restaurantOwnerNavOptions.push('expense')
    }
    if (restaurant.type.toLowerCase() == 'restaurant') { 
      restaurantOwnerNavOptions.push('POS') 
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
    let restaurantStaffNavOptions = ['edit_menu', 'POS' ,'orders']
    for(let option of restaurantStaffNavOptions){
      if(this.dropdownList.indexOf(this.AvailableDropdownList[option]) === -1){
        this.dropdownList.splice(0, 0, this.AvailableDropdownList[option])
      }
    }
  }

    
  dropdownList = [ this.AvailableDropdownList['logout']]
  username: string
  message: string
  location: string


  ngOnInit(){
    let data = this._meAPIutility.getMeData().subscribe(data => {
      console.log('Header component: ', data)
    this.username = data['username'] ? data['username'] : data['email']
        for(let company of data['companies']){
          if(company.role_name == 'corporate_admin'){
            sessionStorage.setItem('company_id', data['companies'][0]['company_id'])
            console.log('company_id', sessionStorage.getItem('company_id'))
            this.addAdminNavOptions(company)
            break
          }
        }
        for(let restaurant of data['restaurants']){
          if(restaurant.role_name == 'restaurant_admin'){
            sessionStorage.setItem('restaurant_id', data['restaurants'][0]['restaurant_id'])
            sessionStorage.setItem('restaurant_name', data['restaurants'][0]['restaurant_name'])
            sessionStorage.setItem('restaurant_address', data['restaurants'][0]['restaurant_address'])
            sessionStorage.setItem('restaurant_gst', data['restaurants'][0]['restaurant_gst'])
            sessionStorage.setItem('restaurant_kds', data['restaurants'][0]['restaurant_kds'])
            sessionStorage.setItem('restaurantType', (data['restaurants'][0]['type'] as string).toLowerCase());
            this.addRestaurantOwnerNavOptions(restaurant)
            break
          }else if(restaurant.role_name == 'restaurant_staff'){
            sessionStorage.setItem('restaurant_id', data['restaurants'][0]['restaurant_id'])
            sessionStorage.setItem('restaurant_name', data['restaurants'][0]['restaurant_name'])
            sessionStorage.setItem('restaurant_address', data['restaurants'][0]['restaurant_address'])
            sessionStorage.setItem('restaurant_gst', data['restaurants'][0]['restaurant_gst'])
            sessionStorage.setItem('restaurant_kds', data['restaurants'][0]['restaurant_kds'])
            sessionStorage.setItem('restaurantType', (data['restaurants'][0]['type'] as string).toLowerCase());
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
}

