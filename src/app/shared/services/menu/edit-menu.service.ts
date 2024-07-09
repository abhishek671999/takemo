import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { host, Utility} from '../../site-variable';

@Injectable({
  providedIn: 'root',
})
export class EditMenuService {
  host = host;
  private editItemEndpoint = 'inventory/edit_item/';
  private addItemEndpoint = 'inventory/add_item/';
  private addCategoryEndpoint = 'inventory/add_category/';
  private addItemUnitPriceEndpoint = 'inventory/add_item_unit_price/'
  private deleteItemEndpoint = 'inventory/delete_item/';
  private deleteItemUnitPriceEndpoint = 'inventory/delete_item_unit_price/'
  private deleteCategoryEndpoint = 'inventory/delete_category/';
  private editItemAvailabilityEndpoint = 'inventory/edit_is_available/';
  private editItemUnitPriceEndpoint = 'inventory/edit_item_unit_price/'
  private editCategoryAvailabilityEndpoint = 'inventory/hide_category/'

  constructor(private _http: HttpClient, public utility: Utility) {}

  editCategoryAvailability(body){
    return this._http.post(this.host + this.editCategoryAvailabilityEndpoint, body)
  }
  editMenu(body) {
    console.log('This is the body: ', body);
    return this._http.post(this.host + this.editItemEndpoint, body);
  }

  addItem(body) {
    console.log('This is the body: ', body);
    return this._http.post(this.host + this.addItemEndpoint, body);
  }

  addCategory(body) {
    console.log('This is the body: ', body);
    return this._http.post(this.host + this.addCategoryEndpoint, body);
  }

  deleteItem(body) {
    return this._http.delete(this.host + this.deleteItemEndpoint, {
      body: body,
      headers: this.utility.getHeaders(),
    });
  }

  deleteCategory(body) {
    return this._http.delete(this.host + this.deleteCategoryEndpoint, {
      body: body,
      headers: this.utility.getHeaders(),
    });
  }

  deleteSubItem(body) {
    return this._http.delete(this.host + this.deleteItemUnitPriceEndpoint, {body: body})
  }

  editItemAvailability(body) {
    return this._http.post(
      this.host + this.editItemAvailabilityEndpoint, body);
  }

  addItemUnitPrice(body) {
    return this._http.post(this.host + this.addItemUnitPriceEndpoint, body)
  }
  editItemUnitPrice(body) {
    return this._http.post(this.host + this.editItemUnitPriceEndpoint, body)
  }
}
