import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { host, getToken, getHeaders, Utility } from '../../site-variable';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  
  headers:any;
  constructor(private _http: HttpClient, public utility: Utility) { }
  host = host
  _getMenuEndpoint = 'inventory/get_menu/'

  getMenu(id){
    let queryParams = new HttpParams()
    queryParams = queryParams.append('restaurant_id', id.toString())
    return this._http.get(this.host+this._getMenuEndpoint, {params: queryParams, headers: this.utility.getHeaders()})
  }

}
