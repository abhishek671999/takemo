import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getHeaders, host } from '../../site-variable';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private _http: HttpClient) { }
  host = host
  orderHistoryEndpoint = 'order/get_my_order_history/'
  checkIfPaymentRequiredEndpoint = 'order/check_if_payment_required/'
  createOrdersEnpoint = 'order/create_order/'
  getCurrentOrdersCardsEndpoint = 'order/get_current_orders_cards/'



  getCurrentOrders(){
    return this._http.get(this.host + this.orderHistoryEndpoint, {headers: getHeaders()})
  }


  checkIfPaymentRequired(){
    let httpParams = new HttpParams()
    httpParams = httpParams.append('restaurant_id', 1)
    return this._http.get(this.host + this.checkIfPaymentRequiredEndpoint, {headers: getHeaders(), params: httpParams})
  }

  createOrders(body){
    return this._http.post(this.host + this.createOrdersEnpoint, body, {headers: getHeaders()} )
  }

  getCurrentOrdersCards(params){
    let httpParams = new HttpParams()
    httpParams = httpParams.append('restaurant_id', params['restaurant_id'])
    return this._http.get(host + this.getCurrentOrdersCardsEndpoint, {params: httpParams, headers: getHeaders()})
  }

  
}
