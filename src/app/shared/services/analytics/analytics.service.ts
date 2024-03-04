import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Utility, host } from '../../site-variable';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  _salesAnalyticEndpoint = 'analytics/get_sales_analytics_data/'
  _salesAnalyticsRGEndpoint = 'analytics/get_sales_analytics_data_rg/' //hardcode
  _timelyAnalyticsEndpoint = 'analytics/get_timely_analytics_data/'

  constructor(private _httpClient: HttpClient, public utility: Utility) { }

  getSalesAnalyticsData(body){
    let endpoint = body['restaurant_id'] == 7 ? this._salesAnalyticsRGEndpoint : this._salesAnalyticEndpoint
    return this._httpClient.post(host + endpoint, body)
  }

  getTimelyAnalyticsData(body){
    return this._httpClient.post(host+this._timelyAnalyticsEndpoint, body)
  }
  
}
