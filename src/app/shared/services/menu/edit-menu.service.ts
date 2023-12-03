import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { host, getToken, getHeaders, Utility} from '../../site-variable';

@Injectable({
  providedIn: 'root',
})
export class EditMenuService {
  host = host;
  editItemEndpoint = 'inventory/edit_item/';
  addItemEndpoint = 'inventory/add_item/';
  addCategoryEndpoint = 'inventory/add_category/';
  deleteItemEndpoint = 'inventory/delete_item/';
  deleteCategoryEndpoint = 'inventory/delete_category/';
  editItemAvailabilityEndpoint = 'inventory/edit_is_available/';

  constructor(private _http: HttpClient, public utility: Utility) {}

  editMenu(body) {
    console.log('This is the body: ', body);
    return this._http.post(this.host + this.editItemEndpoint, body, {
      headers: this.utility.getHeaders(),
    });
  }

  addItem(body) {
    console.log('This is the body: ', body);
    return this._http.post(this.host + this.addItemEndpoint, body, {
      headers: this.utility.getHeaders(),
    });
  }

  addCategory(body) {
    console.log('This is the body: ', body);
    return this._http.post(this.host + this.addCategoryEndpoint, body, {
      headers: this.utility.getHeaders(),
    });
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

  editItemAvailability(body) {
    return this._http.post(
      this.host + this.editItemAvailabilityEndpoint, body, { headers: this.utility.getHeaders() }
    );
  }
}
