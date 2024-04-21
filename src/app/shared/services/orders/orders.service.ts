import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Utility, host } from '../../site-variable';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(private _http: HttpClient, public utility: Utility) {}

  private orderHistoryEndpoint = 'order/get_my_orders/';
  private checkIfPaymentRequiredEndpoint = 'order/check_if_payment_required/';
  private createOrdersEnpoint = 'order/create_order/';
  private createEcomOrdersEndpoint = 'order/create_ecom_order/';
  private deliverIndividualOrderEndpoint = 'order/deliver_single_item/';
  private deliverAllOrdersEndpoint = 'order/deliver_all_pending_orders/';
  private deliverEntireOrderEndpoint = 'order/deliver_entire_order/';
  private getRestaurantOrdersEndpoint = 'order/get_restaurant_orders/';
  private getEcomOrdersEndpoint = 'order/get_ecom_orders/';
  private getCurrentOrdersCardsEndpoint = 'order/get_current_orders_cards/';
  private updateOrderStatusEndpoint = 'order/update_single_item_status/';
  private updateEcomOrderStatusEndpoint = 'order/update_ecom_order_status/';
  private cancelOrderEndpoint = 'order/cancel_order/';
  private myCancelledOrdersEndpoint = 'order/get_my_canceled_orders/';
  private cancellledRestaurantOrdersEndpoint =
    'order/get_restaurant_canceled_orders/';
  private getRestaurantShiftOrders = 'order/get_restaurant_shift_orders/';
  private getTableOrdersEndpoint = 'order/get_table_orders/'
  getMyOrders(body) {
    console.log('Get current orders called');
    return this._http.post(host + this.orderHistoryEndpoint, body);
  }

  checkIfPaymentRequired() {
    let httpParams = new HttpParams();
    httpParams = httpParams.append(
      'restaurant_id',
      sessionStorage.getItem('restaurant_id')
    );
    return this._http.get(host + this.checkIfPaymentRequiredEndpoint, {
      params: httpParams,
    });
  }

  createOrders(body) {
    return this._http.post(host + this.createOrdersEnpoint, body);
  }

  createEcomOrders(body) {
    return this._http.post(host + this.createEcomOrdersEndpoint, body);
  }

  getCurrentOrdersCards(httpParams) {
    return this._http.get(host + this.getCurrentOrdersCardsEndpoint, {
      params: httpParams,
    });
  }

  updateOrderStatus(body) {
    return this._http.post(host + this.updateOrderStatusEndpoint, body);
  }

  updateEcomOrderStatus(body) {
    return this._http.post(host + this.updateEcomOrderStatusEndpoint, body);
  }

  deliverIndividualOrder(body) {
    return this._http.post(host + this.deliverIndividualOrderEndpoint, body);
  }

  deliverEntireOrder(body) {
    return this._http.post(host + this.deliverEntireOrderEndpoint, body);
  }

  deliverAllOrders(body) {
    return this._http.post(host + this.deliverAllOrdersEndpoint, body);
  }

  getRestaurantOrders(body, httpParams?) {
    return this._http.post(host + this.getRestaurantOrdersEndpoint, body, {
      params: httpParams,
    });
  }

  getEcomOrders(body, httpParams?) {
    return this._http.post(host + this.getEcomOrdersEndpoint, body, {
      params: httpParams,
    });
  }

  getRestaurantOrdersForAdmins(body) {
    return this._http.post(host + this.getRestaurantShiftOrders, body);
  }

  cancelOrder(body) {
    return this._http.post(host + this.cancelOrderEndpoint, body);
  }

  getCancelledOrders(body) {
    return this._http.post(host + this.myCancelledOrdersEndpoint, body);
  }

  getRestaurantCancelledOrders(body) {
    return this._http.post(
      host + this.cancellledRestaurantOrdersEndpoint,
      body
    );
  }

  getTableOrders(body) {
    return this._http.post(host + this.getTableOrdersEndpoint, body)
  }
}
