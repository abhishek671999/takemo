import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Utility, getHeaders, host } from '../../site-variable';

@Injectable({
  providedIn: 'root'
})
export class BillingService {
  private restaurantBillingEndponit = 'billing/get_restaurant_billing_data/'
  constructor(private _httpClient: HttpClient, public utility: Utility) { }

  getRestaurantBilling(body){
    return this._httpClient.post(host+this.restaurantBillingEndponit,body, {headers: this.utility.getHeaders()})
  }

}
