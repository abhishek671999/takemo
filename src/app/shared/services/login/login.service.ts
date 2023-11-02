import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { host, getToken } from '../../site-variable';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private _http: HttpClient, private _router: Router) {}

  _host = host;
  _login_endpoint = 'rest-auth/login/';

  login(user: any) {
    if (Number(user.username)) {
      user.username = '+91' + user.username;
    }
    const body = { username: user.username, password: user.password };

    return this._http
      .post<any>(this._host + this._login_endpoint, body)
      .pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error);
  }

  isLoggedIn() {
    return getToken() != null;
  }

  logOut() {
    localStorage.removeItem('token');
    this._router.navigate(['login']);
  }
}
