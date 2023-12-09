import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ConnectComponentsService {

  private message = new BehaviorSubject('Hi there');

  getMessage = this.message.asObservable()

  setMessage(message){
    this.message.next(message)
  }

  constructor() { }


}
