import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/shared/services/login/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  constructor(private _loginService: LoginService, private router: Router) {}

  dropdownList = [
    {
      name: 'My Orders',
      href: '',
      action: () => {
        console.log('My order');
        this.router.navigate(['./home/myorders']);
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
