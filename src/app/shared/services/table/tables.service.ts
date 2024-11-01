import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { host } from '../../site-variable';

@Injectable({
  providedIn: 'root',
})
export class TablesService {
  private __getTableEndpoint = 'tables/get_restaurant_tables/';
  private __addTableEndpoint = 'tables/add_table/';
  private __editTableEndpoint = 'tables/edit_table/';
  private __deleteTableEndpoint = 'tables/delete_table/';
  private __checkIfOTPRequiredEndpoint = 'tables/check_if_otp_required/';
  private __checkIfOTPValidEndpoint = 'tables/check_if_otp_valid/'
  private __closeTableSessionEndpoint = 'tables/mark_table_paid/'
  private __markBillPrintedEndpoint = 'tables/mark_bill_printed/'
  private moveTableEndpoint = 'tables/move_table/'

  constructor(private __httpClient: HttpClient) {}

  moveTable(body){
    return this.__httpClient.post(host + this.moveTableEndpoint, body)
  }
  
  getTables(httpParams: HttpParams) {
    return this.__httpClient.get(host + this.__getTableEndpoint, {
      params: httpParams,
    });
  }

  addTable(body) {
    return this.__httpClient.post(host + this.__addTableEndpoint, body);
  }

  editTable(body) {
    return this.__httpClient.post(host + this.__editTableEndpoint, body);
  }

  deleteTable(body) {
    return this.__httpClient.delete(host + this.__deleteTableEndpoint, {
      body: body,
    });
  }

  checkIfOTPRequired(body) {
    return this.__httpClient.post(host + this.__checkIfOTPRequiredEndpoint, body)
  }

  checkIfOTPValid(body) {
    return this.__httpClient.post(host + this.__checkIfOTPValidEndpoint, body)
  }

  closeTableSession(body) {
    return this.__httpClient.post(host + this.__closeTableSessionEndpoint, body)
  }

  markBillPrinted(body){
    return this.__httpClient.post(host + this.__markBillPrintedEndpoint, body)
  }
}
