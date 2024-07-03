import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Utility, host } from '../../site-variable';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private _salesAnalyticEndpoint = 'analytics/get_sales_analytics_data/';
  private _salesAnalyticsRGEndpoint = 'analytics/get_sales_analytics_data_rg/'; //hardcode
  private _timelyAnalyticsEndpoint = 'analytics/get_timely_analytics_data/';
  private _salesAnalyticsEcomEndpoint = 'analytics/get_sales_analytics_data_ecom/';
  private __sendDailyReportEndpoint = 'analytics/send_daily_report/'

  constructor(private _httpClient: HttpClient, public utility: Utility) {}

  getSalesAnalyticsData(body) {
    let endpoint =
      body['restaurant_id'] == 7
        ? this._salesAnalyticsRGEndpoint
        : body['ecom']
        ? this._salesAnalyticsEcomEndpoint
        : this._salesAnalyticEndpoint;
    return this._httpClient.post(host + endpoint, body);
  }

  getTimelyAnalyticsData(body) {
    return this._httpClient.post(host + this._timelyAnalyticsEndpoint, body);
  }

  sendDailyReport(body) {
    return this._httpClient.post(host + this.__sendDailyReportEndpoint, body)
  }

}
