import { Injectable } from '@angular/core';
import { getHeaders, host } from '../../site-variable';
import { HttpClient, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  
  private _getTransactionStatusEndpoint = 'payment/get_transaction_status/'
  constructor(private _http: HttpClient) { }

  getTransactionStatus(transaction_id){
    let httpParams = new HttpParams()
    httpParams = httpParams.append('transaction_id', transaction_id)
    return this._http.get(host+this._getTransactionStatusEndpoint, {params: httpParams, headers: getHeaders()})
  }
}
