import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Utility, getHeaders, host } from '../../site-variable';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private _http: HttpClient, public utility: Utility) { }

  private orderHistoryEndpoint = 'order/get_my_orders/'
  private checkIfPaymentRequiredEndpoint = 'order/check_if_payment_required/'
  private createOrdersEnpoint = 'order/create_order/'
  private deliverIndividualOrderEndpoint = 'order/deliver_single_item/'
  private deliverEntireOrderEndpoint = 'order/deliver_entire_order/'
  private getRestaurantOrdersEndpoint = 'order/get_restaurant_orders/'
  private getCurrentOrdersCardsEndpoint = 'order/get_current_orders_cards/'
  private updateOrderStatusEndpoint = 'order/update_single_item_status/'
  private cancelOrderEndpoint = 'order/cancel_order/'
  private cancelledRestaurantOrdersEndpoint = 'order/get_my_canceled_orders/'


  getMyOrders(body){
    console.log('Get current orders called')
    return this._http.post(host + this.orderHistoryEndpoint, body, {headers: this.utility.getHeaders()})
  }

  checkIfPaymentRequired(){
    let httpParams = new HttpParams()
    httpParams = httpParams.append('restaurant_id', 1)
    return this._http.get(host + this.checkIfPaymentRequiredEndpoint, {headers: this.utility.getHeaders(), params: httpParams})
  }

  createOrders(body){
    return this._http.post(host + this.createOrdersEnpoint, body, {headers: this.utility.getHeaders()} )
  }

  getCurrentOrdersCards(params){
    let httpParams = new HttpParams()
    httpParams = httpParams.append('restaurant_id', params['restaurant_id'])
    return this._http.get(host + this.getCurrentOrdersCardsEndpoint, {params: httpParams, headers: this.utility.getHeaders()})
  }

  updateOrderStatus(body){
    return this._http.post(host + this.updateOrderStatusEndpoint, body, {headers: this.utility.getHeaders()})
  }
  deliverIndividualOrder(body){
    return this._http.post(host + this.deliverIndividualOrderEndpoint, body, {headers: this.utility.getHeaders()})
  }

  deliverEntireOrder(body){
    return this._http.post(host + this.deliverEntireOrderEndpoint, body, {headers: this.utility.getHeaders()})
  }

  getRestaurantOrders(body){
    return this._http.post(host + this.getRestaurantOrdersEndpoint, body, {headers: this.utility.getHeaders()})
  }

  cancelOrder(body){
    return this._http.post(host + this.cancelOrderEndpoint, body, {headers: this.utility.getHeaders()})
  }

  getCancelledOrders(body){
    return this._http.post(host + this.cancelledRestaurantOrdersEndpoint, body, {headers: this.utility.getHeaders()})
  }
}
