import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  dropdownList = [
    {
      name: 'My Order',
      href: ''
    },
    {
      name: 'My Restaurant',
      href: ''
    },
    {
      name: 'Setting',
      href: ''
    },
    {
      name: 'Logout',
      href: ''
    },
  ];
}
