import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CounterService } from 'src/app/shared/services/inventory/counter.service';
import { sessionWrapper } from 'src/app/shared/site-variable';

@Component({
  selector: 'app-orders-home',
  templateUrl: './orders-home.component.html',
  styleUrls: ['./orders-home.component.css'],
})
export class OrdersHomeComponent {
  constructor(
    private router: Router,
    private _counterService: CounterService,
    private __sessionWrapper: sessionWrapper
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
      link: '/owner/orders/current-orders',
      index: 2,
    },
    pending: {
      label: 'Pending',
      link: '/owner/orders/pending-orders',
      index: 1,
    },
    history: {
      label: 'History',
      link: '/owner/orders/orders-history',
      index: 0,
    },
    cancelled: {
      label: 'Cancelled',
      link: '/owner/orders/cancelled-orders',
      index: 3,
    },
    unconfirmed: {
      label: 'New orders',
      link: '/owner/orders/unconfirmed-orders',
    },
    confirmed: {
      label: 'Confirmed',
      link: '/owner/orders/confirmed-orders',
    },
    delivered: {
      label: 'Delivered',
      link: '/owner/orders/delivered-orders',
    },
    rejected: {
      label: 'Rejected',
      link: '/owner/orders/rejected-orders',
    },
  };
  public isPOSEnabled = this.__sessionWrapper.isPOSEnabled()
  addComponents() {
    let restaurantType = this.__sessionWrapper.getItem('restaurantType').toLowerCase()
    let EcommerceComponents = restaurantType == "e-commerce" ? ['unconfirmed', 'confirmed', 'delivered', 'rejected'] : []
    let restaurantComponents = this.__sessionWrapper.getItem('restaurant_kds') == 'true' ? ['pending', 'current', 'history'] : restaurantType == "e-commerce" ? [] : ['history']
    let componentsNeeded = EcommerceComponents.concat(restaurantComponents)
    componentsNeeded.forEach((ele) => {
      this.navLinks.push(this.availableNavlinks[ele]);
    });
  }
  ngOnInit() {
    this.addComponents() //temp-fix
    this._counterService
      .getRestaurantCounter(this.__sessionWrapper.getItem('restaurant_id'))
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
      `/owner/settings/edit-menu/${this.__sessionWrapper.getItem('restaurant_id')}`,
    ]);
  }
}
