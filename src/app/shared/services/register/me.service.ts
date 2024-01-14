import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Utility, host } from '../../site-variable';

@Injectable({
  providedIn: 'root'
})
export class MeService {

  meEndpoint = 'users/me/'
  rolesEndpoint = 'role/get_roles/'
  constructor(private __httpClient: HttpClient, public utility: Utility) { }

  getMyInfo(){
    return this.__httpClient.get(host+this.meEndpoint, {headers: this.utility.getHeaders()})
  }

  getRoles(){
    return this.__httpClient.get(host+this.rolesEndpoint, {headers: this.utility.getHeaders()})
  }
  
}
