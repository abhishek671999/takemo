import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { host } from '../site-variable';

@Injectable({
  providedIn: 'root',
})
export class TablesService {
  private __getTableEndpoint = 'tables/get_restaurant_tables/';
  private __addTableEndpoint = 'tables/add_table/';
  private __editTableEndpoint = 'tables/edit_table/';
  private __deleteTableEndponit = 'tables/delete_table/';

  constructor(private __httpClient: HttpClient) {}

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
    return this.__httpClient.delete(host + this.__deleteTableEndponit, {
      body: body,
    });
  }
}
