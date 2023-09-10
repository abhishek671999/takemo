import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams , HttpHeaders} from '@angular/common/http';
import { RegistrationUser } from './user';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { emailValidator } from './shared/email.validator';
import { Token } from '@angular/compiler';


@Injectable({
  providedIn: 'root'
})
export class SignupService {
  _signup_url = 'http://localhost:3000/signup'
  __base_url = "http://65.20.75.191:8001/api/v1"
  _signup_is_user_registered = this.__base_url + '/users/is_user_registered/'
  _email_otp_auth = this.__base_url + '/users/auth/email/'
  _email_auth_token = this.__base_url + '/users/auth/token/'
  _fill_dummy_values = this.__base_url + '/users/fill_dummy_password_username_and_email/'
  _change_password = this.__base_url + '/change-password/'

  constructor(private _http: HttpClient) {}

  signup(regUser: any){
    console.log(regUser)
    return this._http.post<any>(this._signup_url, regUser)
                .pipe(catchError(this.errorHandler))
  }

  errorHandler(error: HttpErrorResponse){
    return throwError(error)
  }


  isUserRegistered(email_or_phone: string){
    console.log('Requesting backend to verify if user data exisis' + email_or_phone)
    let queryParams = new HttpParams();
    if (Number(email_or_phone)){
      queryParams = queryParams.append('mobile', Number(email_or_phone))
    }else{
      let email = email_or_phone
      queryParams = queryParams.append('email', email)
    }
    return this._http.get<any>(this._signup_is_user_registered, {params: queryParams} )
                      .pipe(catchError(this.errorHandler))
  }
  
  authUserEmail(email: string | null | undefined){
    console.log('Requesting back for email otp: '+ email);
    return this._http.post<any>(this._email_otp_auth, {'email': email})
                      .pipe(catchError(this.errorHandler))
  }

  validateUserEmail(email: string | null | undefined, otp: string | null | undefined){
    let body = {'email': email, 'token': otp}
    console.log('Requesting backend to validate OTP: '+ body)
    return this._http.post<any>(this._email_auth_token, body)
                      .pipe(catchError(this.errorHandler))
  }

  fillDummyValue(token: string){
    const headers = new HttpHeaders({'Authorization': 'Token ' + token})
    const requestOptions = {headers}
    const body = {}
    console.log('Sending back to fill dummy values: ', requestOptions)

    return this._http.post<any>(this._fill_dummy_values,body, requestOptions)
                      .pipe(catchError(this.errorHandler))
  }

  changePassword(token: string, new_password: string){
    const headers = new HttpHeaders({'Authorization': 'Token ' + token})
    const body = {
      "old_password": new_password,
      "new_password": new_password,
      "is_new_user": false
  }
  const requestOptions = {headers}

  return this._http.put<any>(this._change_password, body, requestOptions)
                    .pipe(catchError(this.errorHandler))
  }

}

