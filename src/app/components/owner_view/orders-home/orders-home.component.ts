import { Component } from '@angular/core';

@Component({
  selector: 'app-orders-home',
  templateUrl: './orders-home.component.html',
  styleUrls: ['./orders-home.component.css']
})
export class OrdersHomeComponent {
  navLinks = [
    {
      label: 'Pending',
      link: '/owner/pending-orders',
        index: 0
    },
    {
      label: 'Current',
      link: '/owner/current-orders',
      index: 1
    },
    {
        label: 'History',
        link: '/owner/orders-history',
        index: 2
    },
]; 
}
