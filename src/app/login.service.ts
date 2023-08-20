import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from './user';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  _url = 'http://localhost:3000/login'
  constructor(private _http: HttpClient) {}

  login(user: User){
    return this._http.post<any>(this._url, user)
                .pipe(catchError(this.errorHandler))
  }

  errorHandler(error: HttpErrorResponse){
    return throwError(error)
  }

}
