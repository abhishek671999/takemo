import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/shared/services/register/login.service';
import { MeService } from 'src/app/shared/services/register/me.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
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
      'logout': {
        name: 'Logout',
        href: '',
        action: () => this._loginService.logOut(),
      },
    }
  

    
  dropdownList = [this.AvailableDropdownList['profile'], this.AvailableDropdownList['logout']]
  username: string

  ngOnInit(){
      
  }

  

  onClick(index: number) {
    this.dropdownList[index].action();
  }
}
