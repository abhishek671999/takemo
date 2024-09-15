import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { host, Utility, meAPIUtility, sessionWrapper } from '../../site-variable';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private _http: HttpClient,
    private _router: Router,
    public cookieService: CookieService,
    public utility: Utility,
    private meAPIUtility: meAPIUtility,
    private sessionWrapper: sessionWrapper
  ) {}

  public redirectURL = null;
  public logginStatus = false
  _login_endpoint = 'rest-auth/login/';
  _logout_endpoint = 'users/logout/';

  login(user: any) {
    if (Number(user.username)) {
      user.username = '+91' + user.username;
    }
    const body = { username: user.username, password: user.password };

    return this._http.post<any>(host + this._login_endpoint, body);
  }

  logOut() {
    this._http
      .post(
        host + this._logout_endpoint,
        {},
        { headers: this.utility.getHeaders() }
      )
      .subscribe(
        (data) => {
          this.logginStatus = false
          console.log('Logging out', data);
          sessionStorage.clear();
          this.meAPIUtility.removeMeData();
          this._router.navigate(['login']);
        },
        (error) => {
          alert('Failed to Logout. Try again. Contact Takemo if persists');
          sessionStorage.clear();
          this.meAPIUtility.removeMeData();
          this._router.navigate(['login']);
        }
      );
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error);
  }

  isLoggedIn() {
    var token = this.utility.getToken();
    return token.length != 0 || token != '';
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    console.log('Is logged in: ', this.isLoggedIn());
    if (this.isLoggedIn()) {
      return true;
    } else {
      this.redirectURL = window.location.pathname == '/' || window.location.pathname == '/home'? null: window.location.pathname;
      this._router.navigate(['login']);
      return false;
      
    }
  }
}
