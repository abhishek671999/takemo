import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'
import { CookieService } from 'ngx-cookie-service';
import { sessionWrapper } from '../../site-variable';

@Injectable({
  providedIn: 'root'
})
export class ConnectComponentsService {

  private message = new BehaviorSubject('Hi there');

  getMessage = this.message.asObservable()

  setMessage(message){
    this.message.next(message)
  }



}

@Injectable({
  providedIn: 'root'
})
export class cartConnectService{

  constructor(private __cookieService: CookieService, private __sessionWrapper: sessionWrapper) {}

  setCartItems(cartItems) {
    console.log('setting', cartItems)
    let expiryInDays = 30; // days
    let restaurantId = this.__sessionWrapper.getItem('restaurant_id')
    let expiryDate = new Date(
      new Date().getTime() + expiryInDays * 24 * 60 * 60 * 1000
    );
    cartItems.itemList = cartItems.itemList.filter((ele) => ele.quantity + ele.parcelQuantity != 0)
    let existingCart = this.__cookieService.get('cart');
    let cartCookie = existingCart
      ? { ...JSON.parse(existingCart), [restaurantId]: cartItems }
      : { [restaurantId]: cartItems };
    console.log('This is cartcokkie', cartCookie);
    this.__cookieService.set(
      'cart',
      JSON.stringify(cartCookie),
      expiryDate,
      '/'
    );
  }

  getCartItems() {
    let restaurantId = this.__sessionWrapper.getItem('restaurant_id')
    let rawCartItems = this.__cookieService.get('cart')
    return rawCartItems? JSON.parse(rawCartItems)[restaurantId] : null
  }
}