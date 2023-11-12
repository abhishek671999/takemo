import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/shared/services/register/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  constructor(private _loginService: LoginService, private router: Router) {}

  dropdownList = [
    {
      name: 'Profile',
      href: '',
      action: () => {
        console.log('My Profile');
        this.router.navigate(['./admin/myprofile']);
      },
    },
    {
      name: 'Analytics',
      href: '',
      action: () => {
        console.log('analytics');
        this.router.navigate(['./admin/analytics/sales-analytics']);
      },
    },
    {
      name: 'Shift',
      href: '',
      action: () => {
        console.log('User management');
        this.router.navigate(['./admin/user-management']);
      },
    },
    {
      name: 'Settings',
      href: '',
      action: () => console.log('My settings'),
    },
    {
      name: 'Logout',
      href: '',
      action: () => this._loginService.logOut(),
    },
  ];

  onClick(index: number) {
    this.dropdownList[index].action();
  }
}
