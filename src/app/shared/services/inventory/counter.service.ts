import { Injectable } from '@angular/core';
import { Utility, host } from '../../site-variable';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CounterService {
  private restaurantCounterEndpoint = 'inventory/get_restaurant_counters/';
  private addCounterEndpoint = 'inventory/add_counter/';
  private editCounterEndpoint = 'inventory/edit_counter/';
  private inventoryLogEndpoint = 'inventory/get_inventory_stock_log/';
  private deleteCounterEndpoint = 'inventory/delete_counter/'
  private getItemSpecialNotesEndpoint = 'inventory/get_item_special_notes/'

  constructor(private _http: HttpClient) {}

  deleteCounter(body){
    return this._http.delete(host + this.deleteCounterEndpoint, {body: body})
  }

  getRestaurantCounter(id) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('restaurant_id', id.toString());
    return this._http.get(host + this.restaurantCounterEndpoint, {
      params: queryParams,
    });
  }

  addRestaurantCounter(body) {
    return this._http.post(host + this.addCounterEndpoint, body);
  }

  editRestaurantCounter(body) {
    return this._http.post(host + this.editCounterEndpoint, body);
  }

  getInventoryLogs(httpParams) {
    return this._http.get(host + this.inventoryLogEndpoint, {
      params: httpParams,
    });
  }

  getItemSpecialNotes(httpParams){
    return this._http.get(host + this.getItemSpecialNotesEndpoint, {params: httpParams});
  }
}
