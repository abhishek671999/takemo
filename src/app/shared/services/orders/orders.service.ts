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
  private createOfflineOrdersEndpoint = 'order/create_offline_orders/';
  private createEcomOrdersEndpoint = 'order/create_ecom_order/';
  private deliverIndividualOrderEndpoint = 'order/deliver_single_item/';
  private deliverAllOrdersEndpoint = 'order/deliver_all_pending_orders/';
  private deliverEntireOrderEndpoint = 'order/deliver_entire_order/';
  private getRestaurantOrdersEndpoint = 'order/get_restaurant_orders/';
  private getRestaurantTableFulfilledOrdersEndpoint =  host + 'order/get_table_orders_history/';
  private getEcomOrdersEndpoint = 'order/get_ecom_orders/';
  private getCurrentOrdersCardsEndpoint = 'order/get_current_orders_cards/';
  private updateOrderStatusEndpoint = 'order/update_single_item_status/';
  private updateEcomOrderStatusEndpoint = 'order/update_ecom_order_status/';
  
  private cancelOrderEndpoint = 'order/cancel_order/';
  private deleteOrderEndpoint = 'order/delete_order/';

  private myCancelledOrdersEndpoint = 'order/get_my_canceled_orders/';
  private cancellledRestaurantOrdersEndpoint =
    'order/get_restaurant_canceled_orders/';
  private getRestaurantShiftOrders = 'order/get_restaurant_shift_orders/';
  private getTableOrdersEndpoint = 'order/get_table_orders/'
  private updateLineItemEndpoint = 'order/update_line_item/'
  private deleteLineItemEndpoint = 'order/delete_line_item/'
  private mobileOrdersForReceiptEndpoint = host + 'order/get_mobile_orders_for_receipt/'
  private markOrderAsPrintedEndpoint = host + 'order/mark_orders_as_printed/'
  private getTableOrdersByOrderSessionEndpoint = host + 'order/get_table_orders_group_by_orders/'
  private modifyOrderAfterEndpoint = host + 'order/update_order_print_time/'

  getTableOrdersByOrderSession(httpParmas: HttpParams){
    return this._http.get(this.getTableOrdersByOrderSessionEndpoint, {params: httpParmas})
  }

  getFulfilledTableOrders(body){
    return this._http.post(this.getRestaurantTableFulfilledOrdersEndpoint, body)
  }

  markOrderAsPrinted(body){
    return this._http.post(this.markOrderAsPrintedEndpoint, body)
  }


  getMobileOrdersToPrint(httpParams){
    return this._http.get(this.mobileOrdersForReceiptEndpoint, {params: httpParams})
  }

  getMyOrders(body) {
    console.log('Get current orders called');
    return this._http.post(host + this.orderHistoryEndpoint, body);
  }

  checkIfPaymentRequired(httpParams) {
    return this._http.get(host + this.checkIfPaymentRequiredEndpoint, {
      params: httpParams,
    });
  }

  createOrders(body) {
    return this._http.post(host + this.createOrdersEnpoint, body);
  }

  createOfflineOrders(body){
      return this._http.post(host + this.createOfflineOrdersEndpoint, body)
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

  getRestaurantOrdersForAdmins(body, httpParams?) {
    return this._http.post(host + this.getRestaurantShiftOrders, body, {params: httpParams});
  }

  cancelOrder(body) {
    return this._http.post(host + this.cancelOrderEndpoint, body);
  }

  deleteOrder(body) {
    return this._http.delete(host + this.deleteOrderEndpoint, {body: body});
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

  updateLineItem(body) {
    return this._http.post(host + this.updateLineItemEndpoint, body)
  }

  deleteLineItem(body) {
    return this._http.post(host + this.deleteLineItemEndpoint, body)
  }

  modifyOrderAfter(body) {
    return this._http.post(this.modifyOrderAfterEndpoint, body)
  }
}
