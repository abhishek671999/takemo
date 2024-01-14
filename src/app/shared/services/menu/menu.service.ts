import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { host, Utility } from '../../site-variable';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  
  headers:any;
  constructor(private _http: HttpClient, public utility: Utility) { }
  host = host
  private _getMenuEndpoint = 'inventory/get_menu/'
  private _getPOSMenuEndpoing = 'inventory/get_pos_menu/'

  getMenu(id){
    let queryParams = new HttpParams()
    queryParams = queryParams.append('restaurant_id', id.toString())
    return this._http.get(this.host+this._getMenuEndpoint, {params: queryParams, headers: this.utility.getHeaders()})
  }

  getPOSMenu(id){
    let queryParams = new HttpParams()
    queryParams = queryParams.append('restaurant_id', id.toString())
    return this._http.get(this.host+this._getPOSMenuEndpoing, {params: queryParams, headers: this.utility.getHeaders()})
  }

}
