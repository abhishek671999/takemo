import { Component } from '@angular/core';
import { meAPIUtility } from 'src/app/shared/site-variable';

@Component({
  selector: 'app-managment-home',
  templateUrl: './managment-home.component.html',
  styleUrls: ['./managment-home.component.css']
})
export class ManagmentHomeComponent {


  constructor(private meUtility: meAPIUtility) { }
  managementPages = [
    {name: 'Edit Menu' , href: `edit-menu/` },
  ]

  counterPage = { name: 'Counter', href: "food-counter-management" }  
  activityPage = { name: 'Activity', href: 'activity-log' }
  tablePage = { name: 'Table', href: 'table-management'}

  counterManagement
  inventoryManagement
  tableManagement

  ngOnInit() {

    this.meUtility.getRestaurant().subscribe(
      (restaurant) => {
        this.counterManagement = restaurant['counter_management']
        this.inventoryManagement = restaurant['inventory_management']
        this.tableManagement = restaurant['table_management']
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
    )

  }
}
