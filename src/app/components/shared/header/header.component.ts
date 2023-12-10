import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectComponentsService } from 'src/app/shared/services/connect-components/connect-components.service';
import { LoginService } from 'src/app/shared/services/register/login.service';
import { MeService } from 'src/app/shared/services/register/me.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  constructor(
    private _loginService: LoginService, 
    private router: Router,
    private _meService: MeService,
    private _cc: ConnectComponentsService) {
    }
    AvailableDropdownList = {
      'profile': {
        name: 'Profile',
        href: '',
        action: () => {
          console.log('My Profile');
          this.router.navigate(['./admin/myprofile']);
        },
      },
      'analytics': {
        name: 'Analytics',
        href: '',
        action: () => {
          console.log('analytics');
          this.router.navigate(['./admin/analytics/sales-analytics']);
        },
      },
      'shift': {
        name: 'Shift',
        href: '',
        action: () => {
          console.log('User management');
          this.router.navigate(['./admin/user-management']);
        },
      },
      'billing': {
        name: 'Billing',
        href: '',
        action : () => {
          console.log('Billing')
          this.router.navigate(['./admin/billing'])
        }
      },
      'settings': {
        name: 'Settings',
        href: '',
        action: () => console.log('My settings'),
      },
      'edit_menu': {
        name: 'Menu',
        href: '',
        action: () => {
          this.router.navigate(['./owner/edit-menu/' + sessionStorage.getItem('restaurant_id')])
        }
      },
      'orders': {
          name: 'Orders',
          href: '',
          action: () => {
            this.router.navigate(['./owner/pending-orders'])
          }
      },
      'logout': {
        name: 'Logout',
        href: '',
        action: () => this._loginService.logOut(),
      },
      'menu':{
        name: 'Menu',
        href: '',
        action: () => {
          this.router.navigate(['./user'])
        }
      },
      'userOrders': {
        name: 'Orders',
        href: '',
        action: () => {
          this.router.navigate(['./user/myorders'])
        }
      }
    }
  
    addAdminNavOptions(){
      let adminNavOptions = ['shift', 'userOrders', 'billing', 'menu']
      for(let option of adminNavOptions){
        if(this.dropdownList.indexOf(this.AvailableDropdownList[option]) === -1){
          this.dropdownList.splice(0, 0, this.AvailableDropdownList[option])
        }
      }
      
    }
  
  addRestaurantOwnerNavOptions(){
    let restaurantOwnerNavOptions = ['analytics', 'edit_menu', 'billing', 'orders']
    for(let option of restaurantOwnerNavOptions){
      if(this.dropdownList.indexOf(this.AvailableDropdownList[option]) === -1){
        this.dropdownList.splice(0, 0, this.AvailableDropdownList[option])
      }
    }
  }

  addUserNavOptions(){
    let userNavOptions = ['menu', 'userOrders']
    for(let option of userNavOptions){
      if(this.dropdownList.indexOf(this.AvailableDropdownList[option]) === -1){
        this.dropdownList.splice(0, 0, this.AvailableDropdownList[option])
      }
    }
  }

  addRestaurantStaffNavOptions(){
    let restaurantStaffNavOptions = ['edit_menu', 'orders']
    for(let option of restaurantStaffNavOptions){
      if(this.dropdownList.indexOf(this.AvailableDropdownList[option]) === -1){
        this.dropdownList.splice(0, 0, this.AvailableDropdownList[option])
      }
    }
  }
  

    
  dropdownList = [this.AvailableDropdownList['logout']] //this.AvailableDropdownList['profile']
  username: string
  message: string

  ngOnInit(){
    this._cc.getMessage.subscribe(
      data => {
        console.log(data)
        this.username = data['username'] ? data['username'] : data['email']
        for(let company of data['companies']){
          if(company.role_name == 'corporate_admin'){
            this.addAdminNavOptions()
            break
          }
        }
        for(let restaurant of data['restaurants']){
          if(restaurant.role_name == 'restaurant_admin'){
            this.addRestaurantOwnerNavOptions()
            break
          }else if(restaurant.role_name == 'restaurant_staff'){
            this.addRestaurantStaffNavOptions()
            break
          }
        }
        if(data['restaurants'].length == 0 && data['companies'].length == 0){
          this.addUserNavOptions()
        }
      },
      error => {
        console.log('Error while getting my info', error)
      }
    )
   }  

  onClick(index: number) {
    this.dropdownList[index].action();
  }
}

