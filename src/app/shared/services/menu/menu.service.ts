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
  _submit_url = 'inventory/create_order/'


  getMenu(id){
    let queryParams = new HttpParams()
    queryParams = queryParams.append('restaurant_id', id.toString())
    return this._http.get(this.host+this._getMenuEndpoint, {params: queryParams, headers: this.utility.getHeaders()})
  }

  submitOrder(body){
    this._http.post(this.host+this._submit_url, body).subscribe(
      data => console.log('Successful ', data),
      error => console.log('Error: ', error) 
    )
  }
}
