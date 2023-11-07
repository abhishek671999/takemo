import { Component } from '@angular/core';

@Component({
  selector: 'app-analytics-home',
  templateUrl: './analytics-home.component.html',
  styleUrls: ['./analytics-home.component.css']
})
export class AnalyticsHomeComponent {
  analyticsPages = [
    {name: 'Sales-analytics' , href: "admin/analytics/sales-analytics" },
    {name: 'Timely-analytics', href: "admin/analytics/timely-analytics"}
  ]
}
