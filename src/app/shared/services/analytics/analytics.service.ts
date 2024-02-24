import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Utility, host } from '../../site-variable';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  _salesAnalyticEndpoint = 'analytics/get_sales_analytics_data/'
  _timelyAnalyticsEndpoint = 'analytics/get_timely_analytics_data/'

  constructor(private _httpClient: HttpClient, public utility: Utility) { }

  getSalesAnalyticsData(body){
    return this._httpClient.post(host+this._salesAnalyticEndpoint, body)
  }

  getTimelyAnalyticsData(body){
    return this._httpClient.post(host+this._timelyAnalyticsEndpoint, body)
  }
}
