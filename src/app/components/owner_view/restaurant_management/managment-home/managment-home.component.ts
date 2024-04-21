import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { meAPIUtility } from 'src/app/shared/site-variable';

@Component({
  selector: 'app-managment-home',
  templateUrl: './managment-home.component.html',
  styleUrls: ['./managment-home.component.css']
})
export class ManagmentHomeComponent {


  constructor(private __meUtility: meAPIUtility, private _router: Router) { }
  managementPages = [
    {name: 'Edit Menu' , href: `edit-menu/${sessionStorage.getItem('restaurant_id')}` },
  ]

  counterPage = { name: 'Counter', href: "food-counter-management" }  
  activityPage = { name: 'Activity', href: 'activity-log' }
  tablePage = { name: 'Table', href: 'table-management'}

  counterManagement = this.__meUtility.isCounterManagementEnabled()
  inventoryManagement = this.__meUtility.isInventoryManagementEnabled()
  tableManagement = this.__meUtility.isTableManagementEnabled()

  ngOnInit() {
    if(this.counterManagement) {
      this.managementPages.push(this.counterPage)
    }
    if (this.inventoryManagement) {
      this.managementPages.push(this.activityPage)
    }
    if (this.tableManagement) {
      this.managementPages.push(this.tablePage)
    }

  }
}
