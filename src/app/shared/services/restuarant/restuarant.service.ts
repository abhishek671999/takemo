import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { host, getHeaders, Utility } from '../../site-variable';

@Injectable({
  providedIn: 'root'
})

export class RestuarantService {

  constructor(private _httpClient: HttpClient, public utility: Utility) { }

  _getRestaurantEndpoint = 'restaurant/get_restaurants/'
  _editIsRestaurantOpenEndpoint = 'restaurant/edit_is_open/'


  getResturantInfo(){
    return this._httpClient.get(host+this._getRestaurantEndpoint, {headers: this.utility.getHeaders()})
  }
  
  editIsRestaurantOpen(body){
    return this._httpClient.post(host+this._editIsRestaurantOpenEndpoint, body,{headers: this.utility.getHeaders()})
  }

}
