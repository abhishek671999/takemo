import { HttpParams } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { MeService } from 'src/app/shared/services/register/me.service';

@Component({
  selector: 'app-send-email-report-dialog',
  templateUrl: './send-email-report-dialog.component.html',
  styleUrls: ['./send-email-report-dialog.component.css']
})
export class SendEmailReportDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<SendEmailReportDialogComponent>,
    private __meService: MeService,
    private __analyticsService: AnalyticsService
  ) { }

  timeFramesForReport = [
    { displayValue: 'Today', actualValue: 'today' },
    { displayValue: 'Yesterday', actualValue: 'yesterday' },
    { displayValue: 'This week', actualValue: 'this_week' },
    { displayValue: 'This month', actualValue: 'this_month' },
    { displayValue: 'Last month', actualValue: 'last_month' },
    { displayValue: 'Last 3 months', actualValue: 'last_3_months' },
    { displayValue: 'Last 6 months', actualValue: 'last_6_months' },
    { displayValue: 'This year', actualValue: 'this_year' },
    { displayValue: 'Calendar', actualValue: 'custom' },
  ];
  selectedTimeFrame: string = this.timeFramesForReport[0].actualValue;

  adminsEmails;
  checkedEmails = []
  restaurantId = Number(sessionStorage.getItem('restaurant_id'))
  
  ngOnInit() {
    let httpParams = new HttpParams()
    httpParams = httpParams.append('restaurant_id', this.restaurantId)
    this.__meService.getRestaurantAdminEmail(httpParams).subscribe(
      data => {
        this.adminsEmails = data['email_list']
      },
      error => {
        console.log(error)
      }
    )
   }
  
  onChange(adminEmail, event) {
    console.log(event)
    if (adminEmail == 'all' && event.checked) this.checkedEmails = this.adminsEmails
    else if(adminEmail == 'all' && !event.checked) this.checkedEmails = []
    else if(event.checked) this.checkedEmails.push(adminEmail)
    else if(!event.checked) this.checkedEmails = this.checkedEmails.filter(ele => ele != adminEmail)
  }

  sendReport() {
    let body = JSON.parse(JSON.stringify(this.data['requestBody']))
    body['email_list'] = this.checkedEmails
    this.__analyticsService.sendDailyReport(body).subscribe(
      data => console.log(data),
      error => console.log(error)
    )
  }
}
