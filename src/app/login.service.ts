import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class LoginService {

  _login_url = 'http://65.20.75.191:8001/api/v1' + '/rest-auth/login/'
  constructor(private _http: HttpClient) {}

  login(user: any){
    if (Number(user.username)){
      user.username = '+91' + user.username
    }
    const body = {'username': user.username , 'password': user.password}
    return this._http.post<any>(this._login_url, body)
                .pipe(catchError(this.errorHandler))
  }

  errorHandler(error: HttpErrorResponse){
    return throwError(error)
  }

}
