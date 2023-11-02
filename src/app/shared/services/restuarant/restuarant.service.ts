import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { host, getHeaders } from '../../site-variable';

@Injectable({
  providedIn: 'root'
})

export class RestuarantService {

  constructor(private _httpClient: HttpClient) { }

  _host = host
  _getRestaurantEndpoint = 'restaurant/get_restaurants/'


  getResturantInfo(){
    return this._httpClient.get(this._host+this._getRestaurantEndpoint, {headers: getHeaders()})
    }
}
