import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { sessionWrapper } from 'src/app/shared/site-variable';


@Component({
  selector: 'app-analytics-home',
  templateUrl: './analytics-home.component.html',
  styleUrls: ['./analytics-home.component.css']
})
export class AnalyticsHomeComponent {

  constructor(private sessionWrapper: sessionWrapper, private router: Router){}
  analyticsPages = [
    {name: 'Sales-analytics' , href: "sales-analytics" },
    {name: 'Timely-analytics', href: "timely-analytics"},
  ]

  ngOnInit(){
    if( this.sessionWrapper.isMultiRestaurantOwner ){
      this.analyticsPages.splice(0, 0,{name: 'All-restaurants', href: 'all-restaurants'})
      this.router.navigate(['./admin/analytics/all-restaurants'])
    }else{
      this.router.navigate(['./admin/analytics/sales-analytics'])
    }
  }

}
