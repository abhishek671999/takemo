import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EditMenuService {

  host = 'http://65.20.75.191:8001/api/v1/'
  editItemEndpoint = 'inventory/edit_item/'
  addItemEndpoint = 'inventory/add_item/'
  addCategoryEndpoint = 'inventory/add_category/'
  deleteItemEndpoint = 'inventory/delete_item/'
  deleteCategoryEndpoint = 'inventory/delete_category/'
  editItemAvailabilityEndpoint = 'inventory/edit_is_available/'

  constructor(private _http: HttpClient) { }

  getHeaders(){
    const headers = new HttpHeaders({'Authorization': 'Token ' + localStorage.getItem('token')})
    return headers
  }
  

  editMenu(body){
    console.log('This is the body: ',body)
    return this._http.post(this.host+this.editItemEndpoint, body, {headers: this.getHeaders()})
  }

  addItem(body){
    console.log('This is the body: ',body)
    return this._http.post(this.host+this.addItemEndpoint, body, {headers: this.getHeaders()})
  }

  addCategory(body){
    console.log('This is the body: ', body)
    return this._http.post(this.host+this.addCategoryEndpoint, body, {headers: this.getHeaders()})
  }

  deleteItem(body){
    return this._http.delete(this.host+this.deleteItemEndpoint, {body: body ,headers: this.getHeaders()})
  }

  deleteCategory(body){
    console.log('This is body to delete: ', body)
    return this._http.delete(this.host+this.deleteCategoryEndpoint, {body: body, headers: this.getHeaders()})
  }

  editItemAvailability(body){
    return this._http.post(this.host+this.editItemAvailabilityEndpoint, body,  {headers: this.getHeaders()})
  }
}
