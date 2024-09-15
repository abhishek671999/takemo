import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { meAPIUtility, sessionWrapper } from 'src/app/shared/site-variable';

@Component({
  selector: 'app-managment-home',
  templateUrl: './managment-home.component.html',
  styleUrls: ['./managment-home.component.css']
})
export class ManagmentHomeComponent {


  constructor(private __sessionWrapper: sessionWrapper) { }
  managementPages = [
    {name: 'Edit Menu' , href: `edit-menu/` },
  ]

  counterPage = { name: 'Counter', href: "food-counter-management" }  
  activityPage = { name: 'Activity', href: 'activity-log' }
  tablePage = { name: 'Table', href: 'table-management'}

  counterManagement = this.__sessionWrapper.isCounterManagementEnabled()
  inventoryManagement = this.__sessionWrapper.isInventoryManagementEnabled()
  tableManagement = this.__sessionWrapper.isTableManagementEnabled()

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
