import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { booleanAttribute, Injectable } from '@angular/core';
import { MeService } from './services/register/me.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CacheService } from './services/cache/cache.service';

// export let host = 'http://65.20.75.191:8001/api/v1/' // local test
export let host = 'https://takemotest.in/api/v1/'; // Demo test
// export let host = 'http://139.84.139.204:8000/api/v1/'
//export let host = 'https://takemo.in/api/v1/' //Prod

@Injectable({
  providedIn: 'root',
})
export class Utility {
  constructor(public cookieService: CookieService, public router: Router) {}

  getToken() {
    var token = this.cookieService.get('token');
    if (token) {
      this.setToken(token);
      return token;
    } else {
      return '';
    }
  }

  getHeaders() {
    const headers = new HttpHeaders({
      Authorization: 'Token ' + this.getToken(),
    });
    return headers;
  }

  setToken(key: string) {
    let totalExpiryDate = 60; // days
    let newDate = new Date(
      new Date().getTime() + totalExpiryDate * 24 * 60 * 60 * 1000
    );
    this.cookieService.set('token', key, newDate, '/');
  }
}

@Injectable({
  providedIn: 'root',
})
export class meAPIUtility {
  constructor(
    public cookieService: CookieService,
    private _meService: MeService,
    private cacheService: CacheService
  ) {

  }

  public indexSet = 0;
  public isMultiRestaurantOwner = false;
  public doesUserBelongToITT: boolean = false
  public doesUserBelongToRaviGobi: boolean = false


  setRestaurant(restaurant, duration=6000){
    this.cookieService.delete('company', '/')
    let expiryDuration = duration; // min
    this.cookieService.set(
      'restaurant',
      JSON.stringify(restaurant),
      new Date(new Date().getTime() + expiryDuration * 60 * 1000),
      '/'
    );
    localStorage.setItem('restaurant_id', restaurant.restaurant_id)
    localStorage.removeItem('company_id')
  }

  getRestaurant(){
    let restaurantObservable = new Observable((observer) => {
      if(!Boolean(localStorage.getItem('company_id'))){
        let restaurantData = this.cookieService.get('restaurant')
        if(!(typeof(restaurantData) == "undefined" || restaurantData === "" || restaurantData == "undefined")){
          let data = JSON.parse(restaurantData)
          this.doesUserBelongToITT = [1,2].includes(data['restaurant_id'])
          this.doesUserBelongToRaviGobi = data['restaurant_id'] == 7
          observer.next(data)
        } else {
          this.getMeData().subscribe((data) => {
            if(data['restaurants'].length > 0){
              let restaurantData = this.cookieService.get('restaurant')
              if(!(typeof(restaurantData) == "undefined" || restaurantData === "" || restaurantData == "undefined")){
                let data = JSON.parse(restaurantData)
                observer.next(data)
              }
            }
          })
        }
      }
    })
    return restaurantObservable
  }

  setCompany(company, duration=6000){
    this.cookieService.delete('restaurant', '/')
    let expiryDuration = duration; // min
    this.cookieService.set(
      'company',
      JSON.stringify(company),
      new Date(new Date().getTime() + expiryDuration * 60 * 1000),
      '/'
    );
    localStorage.setItem('company_id', company.company_id)
    localStorage.removeItem('restaurant_id')
  }

  getCompany(){
    let restaurantObservable = new Observable((observer) => {
      if(!Boolean(localStorage.getItem('restaurant_id'))){
        let restaurantData = this.cookieService.get('company')
        if(!(typeof(restaurantData) == "undefined" || restaurantData === "" || restaurantData == "undefined")){
          observer.next(JSON.parse(restaurantData))
        } else {
          this.getMeData().subscribe((data) => {
            if(data['companies'].length > 0){
              let restaurantData = this.cookieService.get('company')
              if(!(typeof(restaurantData) == "undefined" || restaurantData === "" || restaurantData == "undefined")){
                observer.next(JSON.parse(restaurantData))
              }
            }
          })
        }
      }
    })
    return restaurantObservable
  }

  getMeData() {
    let meDataObservable = new Observable((observer) => {
      this._meService.getMyInfo().subscribe((data) => {
        this.isMultiRestaurantOwner = data['restaurants'].length > 1
        if(data['companies'].length > 0){
          this.cacheService.set('companies', data['companies'])
          let savedCompanyId = localStorage.getItem('company_id') ? Number(localStorage.getItem('company_id')): 0
          let savedCompany = data['companies'].filter((company: any) => company.restaurant_id == savedCompanyId)
          savedCompany = savedCompany.length > 0? savedCompany[0] : data['companies'][0]
          this.setCompany(savedCompany)
        }
        else if(data['restaurants'].length > 0){
          this.cacheService.set('restaurants', data['restaurants'])
          let savedRestaurantId = localStorage.getItem('restaurant_id') ? Number(localStorage.getItem('restaurant_id')): 0
          let savedRestaurant = data['restaurants'].filter((restaurant: any) => restaurant.restaurant_id == savedRestaurantId)
          savedRestaurant = savedRestaurant.length > 0? savedRestaurant[0] : data['restaurants'][0]
          this.doesUserBelongToITT = [1,2].includes(savedRestaurant['restaurant_id'])
          this.doesUserBelongToRaviGobi = savedRestaurant['restaurant_id'] == 7
          this.setRestaurant(savedRestaurant)
        }
        observer.next(data);
        });
    });
    return meDataObservable;
  }

  removeMeData() {
    this.cookieService.deleteAll('/');
    this.cookieService.delete('token');
    this.cookieService.delete('me');
    this.cookieService.delete('restaurant')
    this.cookieService.delete('company')
    if (this.cookieService.getAll()) {
      this.cookieService.delete('token');
      this.cookieService.deleteAll('/');
      this.cookieService.delete('restaurant')
      this.cookieService.delete('company')
    }
  }
}


@Injectable({
  providedIn: 'root',
})
export class sessionWrapper {

  constructor(public meAPIUtility: meAPIUtility) { }


  getItem(key: string) {
    let item = sessionStorage.getItem(key);
    return item
  }

  public set isKDSEnabled(value: boolean) {
    localStorage.setItem('isKDSEnabled', String(value))
  }

  public get isKDSEnabled() {
    let value = localStorage.getItem('isKDSEnabled')
    return value == 'true' ? true: false
  }

  public set isPaymentDone(value: boolean) {
    localStorage.setItem('isPaymentDone', String(value))
  }

  public get isPaymentDone() {
    let value = localStorage.getItem('isPaymentDone')
    return value == 'true' ? true: false
  }

  isTableManagementEnabled() {
    return this.getItem('table_management') == 'true' ? true : false;
  }
    
}