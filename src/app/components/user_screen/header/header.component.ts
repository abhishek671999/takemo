import { Component } from '@angular/core';
import { LoginService } from 'src/app/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private _loginService: LoginService){}

  dropdownList = [
    {
      name: 'My Orders',
      href: '',
      action: () => console.log('My order')
    },
    {
      name: 'Settings',
      href: '',
      action: () => console.log('My settings')
    },
    {
      name: 'Logout',
      href: '',
      action: () => this._loginService.logOut()
    },
  ];

  onClick(index: number){
    this.dropdownList[index].action()
  }}
