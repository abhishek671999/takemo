import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { host, Utility } from '../../site-variable';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  
  headers:any;
  constructor(private _http: HttpClient, public utility: Utility) { }
  private _getMenuEndpoint = 'inventory/get_user_menu/'
  private _getPOSMenuEndpoint = 'inventory/get_pos_menu/'
  private __getAdminMenuEndpoint = 'inventory/get_admin_menu/'

  getMenu(id){
    let queryParams = new HttpParams()
    queryParams = queryParams.append('restaurant_id', id.toString())
    return this._http.get(host+this._getMenuEndpoint, {params: queryParams})
  }

  getAdminMenu(id){
    let queryParams = new HttpParams()
    queryParams = queryParams.append('restaurant_id', id.toString())
    return this._http.get(host+this.__getAdminMenuEndpoint, {params: queryParams})
  }

  getPOSMenu(id){
    let queryParams = new HttpParams()
    queryParams = queryParams.append('restaurant_id', id.toString())
    return this._http.get(host+this._getPOSMenuEndpoint, {params: queryParams})
  }

}
