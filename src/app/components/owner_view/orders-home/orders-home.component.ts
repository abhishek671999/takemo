import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CounterService } from 'src/app/shared/services/inventory/counter.service';

@Component({
  selector: 'app-orders-home',
  templateUrl: './orders-home.component.html',
  styleUrls: ['./orders-home.component.css'],
})
export class OrdersHomeComponent {
  constructor(
    private router: Router,
    private _counterService: CounterService
  ) {}
  navLinks = [
    // {
    //   label: 'Cancelled',
    //   link: '/owner/cancelled-orders',
    //   index: 3
    // }
  ];
  counters = [];

  availableNavlinks = {
    current: {
      label: 'Current',
      link: '/owner/current-orders',
      index: 2,
    },
    pending: {
      label: 'Pending',
      link: '/owner/pending-orders',
      index: 1,
    },
    history: {
      label: 'History',
      link: '/owner/orders-history',
      index: 0,
    },
    cancelled: {
      label: 'Cancelled',
      link: '/owner/cancelled-orders',
      index: 3,
    },
    unconfirmed: {
      label: 'New orders',
      link: '/owner/unconfirmed-orders',
    },
    confirmed: {
      label: 'Confirmed',
      link: '/owner/confirmed-orders',
    },
    delivered: {
      label: 'Delivered',
      link: '/owner/delivered-orders',
    },
    rejected: {
      label: 'Rejected',
      link: '/owner/rejected-orders',
    },
  };

  addComponents() {
    let restaurantType = sessionStorage.getItem('restaurantType').toLowerCase()
    let componentsNeeded = restaurantType == "e-commerce"? ['unconfirmed', 'confirmed', 'delivered', 'rejected'] : ['pending', 'current', 'history' ]
    componentsNeeded.forEach((ele) => {
      this.navLinks.push(this.availableNavlinks[ele]);
    });
  }
  ngOnInit() {
    this.addComponents() //temp-fix
    this._counterService
      .getRestaurantCounter(sessionStorage.getItem('restaurant_id'))
      .subscribe(
        (data) => {
          this.counters = data['counters'];
        },
        (error) => {
          alert("Couldn't fetch counters");
        }
      );


  }

  navigateToPOS() {
    this.router.navigate(['/owner/point-of-sale']);
  }

  navigateToEditMenu() {
    this.router.navigate([
      `/owner/settings/edit-menu/${sessionStorage.getItem('restaurant_id')}`,
    ]);
  }
}
