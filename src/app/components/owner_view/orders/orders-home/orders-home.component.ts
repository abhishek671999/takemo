import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CounterService } from 'src/app/shared/services/inventory/counter.service';
import { meAPIUtility } from 'src/app/shared/site-variable';

@Component({
  selector: 'app-orders-home',
  templateUrl: './orders-home.component.html',
  styleUrls: ['./orders-home.component.css'],
})
export class OrdersHomeComponent {
  constructor(
    private router: Router,
    private meUtility: meAPIUtility
  ) {}
  navLinks = [
    // {
    //   label: 'Cancelled',
    //   link: '/owner/cancelled-orders',
    //   index: 3
    // }
  ];

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
    deleted: {
      label: 'Deleted',
      link: '/owner/orders/deleted-orders',
    },
  };
  public isPOSEnabled: boolean
  public restaurantId: number;


  ngOnInit() {
    this.meUtility.getRestaurant().subscribe(
      (restaurant) => {
        this.restaurantId = restaurant['restaurant_id']
        this.isPOSEnabled = restaurant['pos']
        let restaurantType = restaurant['type'].toLowerCase()
        if(restaurantType == "e-commerce"){
          let EcommerceComponents = ['unconfirmed', 'confirmed', 'delivered', 'rejected']
          EcommerceComponents.forEach((tab) => {
            this.navLinks.push(this.availableNavlinks[tab])
          })
        }else{
          let restaurantComponents = restaurant['restaurant_kds'] == true ? ['pending', 'current', 'history'] : ['history']
          if(restaurant['allow_edit_order']) restaurantComponents.push('deleted')
          restaurantComponents.forEach((tab) => {
            this.navLinks.push(this.availableNavlinks[tab])
          })
        }
        this.router.navigate([`.${this.navLinks[0].link}`])
      }
    )

  }

  navigateToPOS() {
    this.router.navigate(['/owner/point-of-sale']);
  }

  navigateToEditMenu() {
    this.router.navigate([`/owner/settings/edit-menu/`]);
  }
}
