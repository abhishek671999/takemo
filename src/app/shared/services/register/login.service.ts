import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { host, getToken, Utility, meAPIUtility } from '../../site-variable';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private _http: HttpClient, private _router: Router, public cookieService: CookieService, 
    public utility: Utility, private meAPIUtility: meAPIUtility) {}

  _host = host;
  _login_endpoint = 'rest-auth/login/';

  login(user: any) {
    if (Number(user.username)) {
      user.username = '+91' + user.username;
    }
    const body = { username: user.username, password: user.password };

    return this._http
      .post<any>(this._host + this._login_endpoint, body)
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error);
  }

  isLoggedIn() {
    var token = this.utility.getToken()
    return token.length != 0 || token != '' || token != null
  }

  logOut() {
    sessionStorage.removeItem('restaurant_id')
    sessionStorage.removeItem('company_id')
    this.meAPIUtility.removeMeData()
    this._router.navigate(['login']);
  }
}
