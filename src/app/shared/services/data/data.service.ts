import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService{

  private sessionUpdateSubject = new BehaviorSubject(false);
  public sessionUpdateObservable = this.sessionUpdateSubject.asObservable()

  public sessionUpdated = false

  setSessionUpdate(){
    this.sessionUpdateSubject.next(true)
  }
}
