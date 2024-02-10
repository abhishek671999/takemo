import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders-home',
  templateUrl: './orders-home.component.html',
  styleUrls: ['./orders-home.component.css']
})

export class OrdersHomeComponent {

  constructor(private router: Router){}
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
    {
      label: 'Cancelled',
      link: '/owner/cancelled-orders',
      index: 3
    }
]; 

navigateToPOS(){
  this.router.navigate(['/owner/point-of-sale'])
}

navigateToEditMenu(){
  this.router.navigate([`/owner/settings/edit-menu/${sessionStorage.getItem('restaurant_id')}`])
}
}
