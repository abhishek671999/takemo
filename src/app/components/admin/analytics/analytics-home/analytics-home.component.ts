import { Component } from '@angular/core';


@Component({
  selector: 'app-analytics-home',
  templateUrl: './analytics-home.component.html',
  styleUrls: ['./analytics-home.component.css']
})
export class AnalyticsHomeComponent {
  analyticsPages = [
    {name: 'Sales-analytics' , href: "sales-analytics" },
    {name: 'Timely-analytics', href: "timely-analytics"}
  ]


}
