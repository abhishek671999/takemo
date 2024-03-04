import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CounterService } from 'src/app/shared/services/inventory/counter.service';

@Component({
  selector: 'app-orders-home',
  templateUrl: './orders-home.component.html',
  styleUrls: ['./orders-home.component.css']
})

export class OrdersHomeComponent {

  constructor(private router: Router, private _counterService: CounterService){}
  navLinks = [
  
      // {
    //   label: 'Cancelled',
    //   link: '/owner/cancelled-orders',
    //   index: 3
    // }
  ]
counters = []
ngOnInit(){
  this._counterService.getRestaurantCounter(sessionStorage.getItem('restaurant_id')).subscribe(
    data => {
      this.counters = data['counters']
    },
    error => {
      alert("Couldn't fetch counters")
    }
  )
  console.log(sessionStorage.getItem('restaurant_kds'))
  if (sessionStorage.getItem('restaurant_kds') == 'true'){
        this.navLinks.push(
          {
            label: 'Pending',
            link: '/owner/pending-orders',
              index: 1
          },
          {
            label: 'Current',
            link: '/owner/current-orders',
            index: 2
          },
          {
            label: 'History',
            link: '/owner/orders-history',
            index: 0
          }
        )
      }else{
        this.navLinks.push(
          {
            label: 'History',
            link: '/owner/orders-history',
            index: 0
        }
        )
      }
  }

navigateToPOS(){
  this.router.navigate(['/owner/point-of-sale'])
}

navigateToEditMenu(){
  this.router.navigate([`/owner/settings/edit-menu/${sessionStorage.getItem('restaurant_id')}`])
}
}
