import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { host, Utility } from '../../site-variable';

@Injectable({
  providedIn: 'root'
})

export class RestaurantService {

  constructor(private _httpClient: HttpClient, public utility: Utility) { }

  _getRestaurantEndpoint = 'restaurant/get_restaurants/'
  _editIsRestaurantOpenEndpoint = 'restaurant/edit_is_open/'
  private validatePasswordEndpoint = 'restaurant/validate_restaurant_password/'


  getResturantInfo(){
    return this._httpClient.get(host+this._getRestaurantEndpoint, {headers: this.utility.getHeaders()})
  }
  
  editIsRestaurantOpen(body){
    return this._httpClient.post(host+this._editIsRestaurantOpenEndpoint, body,{headers: this.utility.getHeaders()})
  }

  validatePassword(body){
    return this._httpClient.post(host + this.validatePasswordEndpoint, body)
  }

}
