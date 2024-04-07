import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { host } from '../../site-variable';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  private __getVendorEndpoint = 'expense/get_vendors/'
  private __addVendorEndpoint = 'expense/add_vendor/'
  private __editVendorEndpoint = 'expense/edit_vendor/'
  private __deleteVendorEndpoint = 'expense/delete_vendor/'

  
  constructor(private __httpClient: HttpClient) { }

  getVendor(httpParams: HttpParams) {
    return this.__httpClient.get(host + this.__getVendorEndpoint, {params: httpParams})
  }

  addVendor(body) {
    return this.__httpClient.post(host + this.__addVendorEndpoint, body)
  }

  editVendor(body) {
    return this.__httpClient.post(host + this.__editVendorEndpoint, body)
  }

  deleteVendor(body) {
    return this.__httpClient.delete(host + this.__deleteVendorEndpoint, {body: body})
  }


  
}
