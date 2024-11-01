import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { booleanAttribute, Injectable } from '@angular/core';
import { MeService } from './services/register/me.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

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
    private _router: Router,
  ) {

  }

  public indexSet = 0;
  public isMultiRestaurantOwner = false;
  public doesUserBelongToITT: boolean = false
  public doesUserBelongToRaviGobi: boolean = false


  setMeData(meData) {
    let meDataExpiryDuration = 30; // min
    this.isMultiRestaurantOwner = meData['restaurants'].length > 1
    this.cookieService.set(
      'me',
      JSON.stringify(meData),
      new Date(new Date().getTime() + meDataExpiryDuration * 60 * 1000),
      '/'
    );
  }

  setRestaurantIndex(value, duration=6000){
    this.indexSet = value
    let DataExpiryDuration = duration; // min
    this.cookieService.set(
      'index',
      JSON.stringify(value),
      new Date(new Date().getTime() + DataExpiryDuration * 60 * 1000),
      '/'
    );
  }

  getRestaurantIndex(){
    let index = Number(this.cookieService.get('index')); 
    if(index) {
      this.setRestaurantIndex(index)
      return index
    }
    else {
      this.setRestaurantIndex(0)
      return 0
    }
  }

  setRestaurant(restaurant, duration=6000){
    this.cookieService.delete('company', '/')
    let expiryDuration = duration; // min
    this.cookieService.set(
      'restaurant',
      JSON.stringify(restaurant),
      new Date(new Date().getTime() + expiryDuration * 60 * 1000),
      '/'
    );
  }

  getRestaurant(){
    let restaurantObservable = new Observable((observer) => {
      let restaurantData = this.cookieService.get('restaurant')
      if(restaurantData){
        let data = JSON.parse(restaurantData)
        this.doesUserBelongToITT = [1,2].includes(data['restaurant_id'])
        this.doesUserBelongToRaviGobi = data['restaurant_id'] == 7
        observer.next(data)
      } else {
        this.getMeData().subscribe((data) => {
          this.doesUserBelongToITT = [1,2].includes(data['restaurant_id'])
          this.doesUserBelongToRaviGobi = data['restaurant_id'] == 7
          this.setRestaurant(data['restaurants'][0])
          observer.next(data['restaurants'][0])
        })
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
  }

  getCompany(){
    let restaurantObservable = new Observable((observer) => {
      let restaurantData = this.cookieService.get('company')
      if(restaurantData){
        observer.next(JSON.parse(restaurantData))
      } else {
        this.getMeData().subscribe((data) => {
          if(data['companies'].length > 0){
            this.setCompany(data['companies'][0])
            observer.next(data['companies'][0])
          }
        })
      }
    })
    return restaurantObservable
  }

  getMeData() {
    let meDataObservable = new Observable((observer) => {
      let meData: any = this.cookieService.get('me');
      if (meData) {
        let data = JSON.parse(meData)
        this.isMultiRestaurantOwner = data['restaurants'].length > 1
        observer.next(data);
      } else {
        this._meService.getMyInfo().subscribe((data) => {
          this.isMultiRestaurantOwner = data['restaurants'].length > 1
          this.setMeData(data);
          observer.next(data);
        });
      }
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

  async setSessionVariables() {
    let myPromise =  new Promise((resolve, reject) => {
      this.meAPIUtility.getMeData().subscribe((data) => {
        if (data['restaurants'].length > 0) {
          if (data['restaurants'].length > 1) {
            this.isMultiRestaurantOwner = true;
            this.setRestaurantSessionVariables(data['restaurants'][this.meAPIUtility.getRestaurantIndex()]);
          } else {
            this.isMultiRestaurantOwner = false;
            this.setRestaurantSessionVariables(data['restaurants'][this.meAPIUtility.getRestaurantIndex()]);
          }
        } else if (data['companies'].length > 0) {
          this.setCompanySessionVariable(data['companies'][this.meAPIUtility.getRestaurantIndex()]);
        }
        console.log('Success in promise')
        resolve(true);
      }),
      (error: any) =>{
        console.log('Error in promise', error)
        reject(false)
      }
          
    })
    await myPromise
  }

  getItem(key: string) {
    let item = sessionStorage.getItem(key);
    console.log('getitem', key)
    if (item) return (item);
    else {
      this.setSessionVariables()
      let value = sessionStorage.getItem(key)
      
      return value
    }
  }

  setRestaurantSessionVariables(restaurant){
    sessionStorage.setItem('restaurant_id', restaurant['restaurant_id']) 
    localStorage.setItem('restaurant_id', restaurant['restaurant_id']) 
    localStorage.setItem('role', restaurant['role_name'])
    sessionStorage.setItem(
      'restaurant_name',
      restaurant['restaurant_name']
    );
    sessionStorage.setItem(
      'restaurant_address',
      restaurant['restaurant_address']
    );
    sessionStorage.setItem(
      'restaurant_gst',
      restaurant['restaurant_gst']
    );
    sessionStorage.setItem(
      'restaurant_kds',
      restaurant['restaurant_kds']
    );
    sessionStorage.setItem(
      'restaurantType',
      (restaurant['type'] as string).toLowerCase()
    );
    sessionStorage.setItem(
      'counter_management',
      restaurant['counter_management']
    );
    sessionStorage.setItem('pay_on_delivery', restaurant['pay_on_delivery'])
    sessionStorage.setItem('inventory_management', restaurant['inventory_management']);
    sessionStorage.setItem('counter_management', restaurant['counter_management'])
    sessionStorage.setItem('table_management', restaurant['table_management'])
    sessionStorage.setItem('mobile_ordering', restaurant['mobile_ordering'])
    sessionStorage.setItem('kot_receipt', restaurant['kot_receipt'])
    sessionStorage.setItem('pos', restaurant['pos'])
    sessionStorage.setItem('load_header', 'false')
    sessionStorage.setItem('ui_polling_for_mobile_order_receipt_printing', restaurant['ui_polling_for_mobile_order_receipt_printing'])
    sessionStorage.setItem('ui_polling_for_mobile_order_receipt_printing_frequency', restaurant['ui_polling_for_mobile_order_receipt_printing_frequency'])
    sessionStorage.setItem('tax_inclusive',restaurant['tax_inclusive'])
    sessionStorage.setItem('tax_percentage', restaurant['tax_percentage'])
  }

  setCompanySessionVariable(company){
    sessionStorage.setItem('company_id', company['company_id'])
  }
  
  public set isMultiRestaurantOwner(value: boolean){
    localStorage.setItem('isMultiRestaurantOwner', String(value))
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

  isTaxInclusive(){
    return this.getItem('tax_inclusive') == 'true' ? true : false
  }

  isCounterManagementEnabled() {
    return this.getItem('counter_management') == 'true' ? true : false
  }

  isExpenseManagementEnabled() {
    return this.getItem('expense_management') == 'true' ? true : false
  }

  isInventoryManagementEnabled() {
    return this.getItem('inventory_management') == 'true' ? true : false
  }

  isTableManagementEnabled() {
    return this.getItem('table_management') == 'true' ? true : false;
  }
  
  isMobileOrderingEnabled() {
    return this.getItem('mobile_ordering') == 'true' ? true : false;
  }

  isKOTreceiptEnabled() {
    return this.getItem('kot_receipt') == 'true' ? true : false;
  }

  isPOSEnabled() {
    return this.getItem('pos') == 'true' ? true : false;
  }

  isPollingRequired(){
    return this.getItem('ui_polling_for_mobile_order_receipt_printing') == 'true' ? true: false
  }

  
}