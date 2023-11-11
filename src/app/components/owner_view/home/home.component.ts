import { Component } from '@angular/core';
import { Router,NavigationStart }  from "@angular/router";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  navLinks = [
    {
      label: 'Pending',
      link: '/owner/pending-orders',
        index: 0
    }, {
        label: 'History',
        link: '/owner/orders-history',
        index: 1
    }, {
      label: 'Current',
      link: '/owner/current-orders',
      index: 2
    }
]; 

}
