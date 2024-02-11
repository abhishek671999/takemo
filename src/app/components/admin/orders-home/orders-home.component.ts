import { Component } from '@angular/core';

@Component({
  selector: 'app-orders-home',
  templateUrl: './orders-home.component.html',
  styleUrls: ['./orders-home.component.css']
})
export class OrdersHomeComponent {
  navLinks = [
    // {
    //   label: 'Pending',
    //   link: '/admin/pending-orders',
    //     index: 0
    // },
    {
      label: 'History', // Should be changed when refactoring
      link: '/admin/orders/current-orders',
      index: 1
    },
    // {
    //     label: 'History',
    //     link: '/owner/orders-history',
    //     index: 2
    // },
    // {
    //   label: 'Cancelled',
    //   link: '/owner/cancelled-orders',
    //   index: 3
    // }
]; 
}
