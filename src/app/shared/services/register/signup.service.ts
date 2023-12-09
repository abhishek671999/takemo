import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
  HttpHeaders,
} from '@angular/common/http';
import { RegistrationUser } from '../../../user';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { host } from '../../site-variable';
import { timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  __base_url = host;
  _signup_is_user_registered = this.__base_url + 'users/is_user_registered/';
  _email_otp_auth = this.__base_url + 'users/auth/email/';

  _phone_plauth = this.__base_url + 'users/auth/mobile/';
  _phone_otp_auth = this.__base_url + 'users/send_otp_sms/';

  _user_auth_token = this.__base_url + 'users/auth/token/';
  _fill_dummy_values =
    this.__base_url + 'users/fill_dummy_password_username_and_email/';
  _change_password = this.__base_url + 'change-password/';

  constructor(private _http: HttpClient) {}

  errorHandler(error: HttpErrorResponse) {
    console.log('Error in sign up service: ', error);
    return throwError(error);
  }

  isUserRegistered(email_or_phone: string) {
    console.log(
      'Requesting backend to verify if user data exisis' + email_or_phone
    );
    let queryParams = new HttpParams();
    if (Number(email_or_phone)) {
      queryParams = queryParams.append('mobile', Number(email_or_phone));
    } else {
      let email = email_or_phone;
      queryParams = queryParams.append('email', email);
    }
    console.log('Query params for is user registered: ', queryParams);
    return this._http.get<any>(this._signup_is_user_registered, {
      params: queryParams,
    });
  }

  hitPhonePlauth(body){
    console.log('call 1')
    return this._http.post<any>(this._phone_plauth, body)
  }

  sendOTP(body){
    console.log('Call 2')
    return this._http
        .post<any>(this._phone_otp_auth, body)
        .pipe(catchError(this.errorHandler));
  }

  // Change all email variables to username
   authUser(email: string | null | undefined) {
    console.log('Requesting back for email otp: ' + email);
    if (Number(email)) {
      let mobile = Number(email);
      let body = { mobile: '+91' + mobile };
      return this.hitPhonePlauth(body).pipe(
        switchMap( () => {
          console.log('Call 1 response *')
          return this.sendOTP(body)
        }
       ), 
        catchError(() => {
          console.log('Call 1 response')
          return this.sendOTP(body)})
        )
    } else {
      let body = { email: email };
      return this._http
        .post<any>(this._email_otp_auth, body)
        .pipe(catchError(this.errorHandler));
    }
  }

  validateUser(
    email: string | null | undefined,
    otp: string | null | undefined
  ) {
    let body;
    if (Number(email)) {
      let mobile = Number(email);
      body = { mobile: '+91' + mobile, token: otp };
    } else {
      body = { email: email, token: otp };
    }
    console.log(email, )
    console.log('Requesting backend to validate OTP: ' + body);
    return this._http
      .post<any>(this._user_auth_token, body)
      .pipe(catchError(this.errorHandler));
  }

  fillDummyValue(token: string) {
    const headers = new HttpHeaders({ Authorization: 'Token ' + token });
    const requestOptions = { headers };
    const body = {};
    console.log('Sending back to fill dummy values: ', requestOptions);

    return this._http
      .post<any>(this._fill_dummy_values, body, requestOptions)
      .pipe(catchError(this.errorHandler));
  }

  changePassword(
    token: string,
    new_password: string,
    isNewUser: boolean = false
  ) {
    console.log('Token: ', token, 'Password: ', new_password);
    const headers = new HttpHeaders({ Authorization: 'Token ' + token });
    const body = {
      old_password: new_password,
      new_password: new_password,
      is_new_user: isNewUser,
    };
    const requestOptions = { headers };

    return this._http
      .put<any>(this._change_password, body, requestOptions)
      .pipe(catchError(this.errorHandler));
  }
}
