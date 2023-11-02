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
  
  onClick(){
    window.open('https://mercury-t2.phonepe.com/transact/pg?token=NjAyMTZlNzNiMWViNWYzMDViYWYwYWMyYWE3ZGEwYmVmODcyYWI3NTdkZDE2NmRlOTBiNDE4ZTQ4ZWQ1OWYxMDA0NTQxMDY2ODk2ZmYzZDc5MWE2NjMzMzdiNjQ3MjdkMjgyNDMwMWFhNTEwZjgxZTc5ODI2MmQzNjM4ZTUyOmU0YzY4NGMyMTljMzg4MDc1MjgxNTJlMDE4MjZjZTUw')
  }

}
