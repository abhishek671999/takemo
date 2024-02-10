import { Injectable } from '@angular/core';
import { Utility, host } from '../../site-variable';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CounterService {

  private restaurantCounterEndpoint = 'inventory/get_restaurant_counters/'
  private addCounterEndpoint = 'inventory/add_counter/'

  constructor(private _http: HttpClient, private _utility: Utility) { }

  getRestaurantCounter(id){
    let queryParams = new HttpParams()
    queryParams = queryParams.append('restaurant_id', id.toString())
    return this._http.get(host+this.restaurantCounterEndpoint, {params: queryParams, headers: this._utility.getHeaders()})
  }

  addRestaurantCounter(body){
    return this._http.post(host+this.addCounterEndpoint, body, {headers: this._utility.getHeaders()})
  }

}
