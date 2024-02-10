import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-managment-home',
  templateUrl: './managment-home.component.html',
  styleUrls: ['./managment-home.component.css']
})
export class ManagmentHomeComponent {

  managementPages = [
    {name: 'Counter', href: "food-counter-management"},
    {name: 'Edit Menu' , href: `edit-menu/${sessionStorage.getItem('restaurant_id')}` }
    
  ]

  constructor(private _router: Router){}

  ngOnInit(){}
}
