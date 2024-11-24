import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { host, Utility } from '../../site-variable';

@Injectable({
  providedIn: 'root'
})

export class RestaurantService {

  constructor(private _httpClient: HttpClient, public utility: Utility) { }

  _getRestaurantEndpoint = 'restaurant/get_restaurants/'
  _editIsRestaurantOpenEndpoint = 'restaurant/edit_is_open/'
  private validatePasswordEndpoint = 'restaurant/validate_restaurant_password/'
  private getRestaruantEmployeesEndpoint = 'restaurant/get_restaurant_employees/'
  private addEmployeeEndpoint = 'restaurant/add_employee/'
  private editEmployeeEndpoint = 'restaurant/edit_employee/'
  private deleteEmployeeEndpoint = 'restaurant/delete_employee/'
  private getAttendenceEndpoint = 'restaurant/get_attendance/'
  private punchInEndpoint = 'restaurant/punch_in/'
  private punchOutEndpoint = 'restaurant/punch_out/'

  getResturantInfo(){
    return this._httpClient.get(host+this._getRestaurantEndpoint, {headers: this.utility.getHeaders()})
  }
  
  editIsRestaurantOpen(body){
    return this._httpClient.post(host+this._editIsRestaurantOpenEndpoint, body,{headers: this.utility.getHeaders()})
  }

  validatePassword(body){
    return this._httpClient.post(host + this.validatePasswordEndpoint, body)
  }

  getRestaurantEmployees(httpParams: HttpParams){
    return this._httpClient.get(host + this.getRestaruantEmployeesEndpoint, {params: httpParams} )
  }

  addEmployee(body){
    return this._httpClient.post(host + this.addEmployeeEndpoint, body)
  }

  editEmployee(body){
    return this._httpClient.post(host + this.editEmployeeEndpoint, body)
  }

  deleteEmployee(body){
    return this._httpClient.delete(host + this.deleteEmployeeEndpoint, {body: body})
  }

  getAttendence(httpParams: HttpParams){
    return this._httpClient.get(host + this.getAttendenceEndpoint,  {params: httpParams})
  }

  punchIn(body){
    return this._httpClient.post(host + this.punchInEndpoint, body)
  }

  punchOut(body){
    return this._httpClient.post(host + this.punchOutEndpoint, body)
  }

}
