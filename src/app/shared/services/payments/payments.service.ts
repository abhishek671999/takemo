import { Injectable } from '@angular/core';
import { Utility, host } from '../../site-variable';
import { HttpClient, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  
  private _getTransactionStatusEndpoint = 'payment/get_transaction_status/'
  private _getWalletRechargeTransStatusEndpoint = 'payment/get_wallet_recharge_status/'
  private _getWalletDetailsEndpoint = 'payment/get_wallet_details/'
  private _rechargeWalletEndpoint = 'payment/recharge_wallet/'

  constructor(private _http: HttpClient, public utility: Utility) { }

  getTransactionStatus(transaction_id){
    let httpParams = new HttpParams()
    httpParams = httpParams.append('transaction_id', transaction_id)
    return this._http.get(host+this._getTransactionStatusEndpoint, {params: httpParams, headers: this.utility.getHeaders()})
  }

  getWalletTransactionStatus(transaction_id){
    let httpParams = new HttpParams()
    httpParams = httpParams.append('transaction_id', transaction_id)
    return this._http.get(host + this._getWalletRechargeTransStatusEndpoint, {params: httpParams, headers: this.utility.getHeaders()})
  }

  getWalletDetails(){
    return this._http.get(host + this._getWalletDetailsEndpoint, {headers: this.utility.getHeaders()})
  }

  rechargeWallet(body){
    return this._http.post(host + this._rechargeWalletEndpoint, body, {headers: this.utility.getHeaders()})
  }

}
