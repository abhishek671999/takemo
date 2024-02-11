import { Component } from '@angular/core';
import Chart from 'chart.js/auto';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';

@Component({
  selector: 'app-admin-landing',
  templateUrl: './admin-landing.component.html',
  styleUrls: ['./admin-landing.component.css']
})
export class AdminLandingComponent {
  chart: any = []
  chart2: any = []

  constructor(private _analyticsService: AnalyticsService){}

  ngOnInit(){
    //this.createDefaultChart()
    this.getAnalyticsResponse()
  }

  getAnalyticsResponse(){
    let body = {
      "restaurant_id": 1,
      "_comment": "rule_id is optional and 1(default) will be taken if not given",
      "time_frame": "today",
      "_comment1": "Possible options for above field: today, this_week, this_month, last_3_months, last_6_months, this_year, custom",
      "_comment2": "if custom is given, 2 more fields, from_date and to_date must be sent",
      "item_wise": false,
      "_comment3": "item_wise or category_wise booean fields. Either or none must be used"
  }
    this._analyticsService.getSalesAnalyticsData(body).subscribe(
      data =>{
        console.log(data)
        this.createAnalyticsChart(data)
      },
      error => console.log(error)
    )
  }

  createAnalyticsChart(data){
    this.chart2 = new Chart('canvas2',{
    type: 'bar',
    data: {
      labels: [Object.keys(data)[0]],
      datasets: [
        {
          label: '# of orders',
          data: [data[Object.keys(data)[0]]+1],
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    }
  })  
  }

  createDefaultChart(){
    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
          {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
