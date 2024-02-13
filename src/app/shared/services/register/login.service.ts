import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { host, Utility, meAPIUtility } from '../../site-variable';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private _http: HttpClient, private _router: Router, public cookieService: CookieService, 
    public utility: Utility, private meAPIUtility: meAPIUtility) {}

  _login_endpoint = 'rest-auth/login/';
  _logout_endpoint = 'rest-auth/logout/';


  login(user: any) {
    if (Number(user.username)) {
      user.username = '+91' + user.username;
    }
    const body = { username: user.username, password: user.password };

    return this._http
      .post<any>(host + this._login_endpoint, body)
  }

  logOut() {
    this._http.post(host + this._logout_endpoint, {}, {headers: this.utility.getHeaders()}).subscribe(
      data => {
        console.log('Logging out', data)
        sessionStorage.clear()
        this.meAPIUtility.removeMeData()
        this._router.navigate(['login']);
      },
      error => {
        alert('Failed to Logout. Try again. Contact Takemo if persists')
        sessionStorage.clear()
        this.meAPIUtility.removeMeData()
        this._router.navigate(['login']);
      }
    )
    
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error);
  }

  isLoggedIn() {
    var token = this.utility.getToken()
    return token.length != 0 || token != '' || token != null
  }

}
