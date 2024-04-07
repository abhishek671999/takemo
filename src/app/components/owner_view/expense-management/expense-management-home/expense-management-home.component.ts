import { Component } from '@angular/core';

@Component({
  selector: 'app-expense-management-home',
  templateUrl: './expense-management-home.component.html',
  styleUrls: ['./expense-management-home.component.css']
})
export class ExpenseManagementHomeComponent {

  managementPages = [
    {name: 'Expense' , href: `expense` },
    {name: 'Vendor', href: "vendor"}    
  ]
}
