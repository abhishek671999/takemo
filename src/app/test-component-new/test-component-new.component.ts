import { Component } from '@angular/core';

@Component({
  selector: 'app-test-component-new',
  templateUrl: './test-component-new.component.html',
  styleUrls: ['./test-component-new.component.css']
})
export class TestComponentNewComponent {
  dropdownList = [
    {
      name: 'My Orders',
      href: '',
      action: () => console.log('My order')
    },
    {
      name: 'My Restaurants',
      href: '',
      action: () => console.log('My Restaurants')
    },
    {
      name: 'Settings',
      href: '',
      action: () => console.log('My settings')
    },
    {
      name: 'Logout',
      href: '',
      action: () => console.log('My Logout')
    },
  ];
  
  onClick(name: string){
    console.log(name)
  }

}
