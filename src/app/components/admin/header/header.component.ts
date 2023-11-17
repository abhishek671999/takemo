import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
    private _meService: MeService) {
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
          this.router.navigate(['./owner/edit-menu/1'])
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
    }
  
    addAdminNavOptions(){
      let adminNavOptions = ['shift', 'analytics', 'billing']
      for(let option of adminNavOptions){
        if(this.dropdownList.indexOf(this.AvailableDropdownList[option]) === -1){
          this.dropdownList.splice(1, 0, this.AvailableDropdownList[option])
        }
      }
      
    }
  
  addRestaurantOwnerNavOptions(){
    let restaurantOwnerNavOptions = ['analytics', 'edit_menu', 'billing', 'orders']
    for(let option of restaurantOwnerNavOptions){
      if(this.dropdownList.indexOf(this.AvailableDropdownList[option]) === -1){
        this.dropdownList.splice(1, 0, this.AvailableDropdownList[option])
      }
    }
  }
  

    
  dropdownList = [this.AvailableDropdownList['profile'], this.AvailableDropdownList['logout']]
  username: string

  ngOnInit(){
    this._meService.getMyInfo().subscribe(
      data => {
        console.log(data)
        this.username = data['email']
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
          }
        }
      },
      error => {
        console.log('Error while getting my info', error)
      }
    )

    // this._meService.getRoles().subscribe(
    //   data => {
    //     for (let role of data['roles']){
    //       console.log(role)
    //       if(role.role_name=='restaurant_admin'){
    //         this.dropdownList.splice(1, 0, this.AvailableDropdownList['analytics'])
    //         this.dropdownList.splice(1, 0, this.AvailableDropdownList['edit_menu'])
    //       }else if(role.role_name == 'corporate_admin'){
    //         this.dropdownList.splice(1, 0, this.AvailableDropdownList['shift'])
    //       }
    //     }
    //   },
    //   error => {
    //     console.log('Error while loading the file')
    //   }
    // )
      
  }

  

  onClick(index: number) {
    this.dropdownList[index].action();
  }
}

