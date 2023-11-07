import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getHeaders, host } from '../../site-variable';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  _salesAnalyticEndpoint = 'analytics/get_sales_analytics_data/'
  _timelyAnalyticsEndpoint = 'analytics/get_timely_analytics_data/'

  constructor(private _httpClient: HttpClient) { }

  getSalesAnalyticsData(body){
    return this._httpClient.post(host+this._salesAnalyticEndpoint, body, {headers: getHeaders()})
  }

  getTimelyAnalyticsData(body){
    return this._httpClient.post(host+this._timelyAnalyticsEndpoint, body, {headers: getHeaders()})
  }
}
