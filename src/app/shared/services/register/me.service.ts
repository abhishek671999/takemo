import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { getHeaders, host } from '../../site-variable';

@Injectable({
  providedIn: 'root'
})
export class MeService {

  meEndpoint = 'users/me/'
  constructor(private __httpClient: HttpClient) { }

  getMyInfo(){
    return this.__httpClient.get(host+this.meEndpoint, {headers: getHeaders()})
  }
}
