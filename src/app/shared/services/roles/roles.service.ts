import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Utility, host } from '../../site-variable';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  roleEndpoint = 'role/get_roles/' 
  constructor(private _httpClient: HttpClient, public utility: Utility) { }

  getRole(){
    return this._httpClient.get(host+this.roleEndpoint, {headers: this.utility.getHeaders()})
  }

}
