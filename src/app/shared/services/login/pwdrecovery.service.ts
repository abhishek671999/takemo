import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UrlSegment } from '@angular/router';
import { catchError, concatAll, throwError } from 'rxjs';
import { host } from '../../site-variable';

@Injectable({
  providedIn: 'root'
})
export class PwdrecoveryService {
  __base_url = host
  _pwd_otp_auth = this.__base_url + "users/get_password_reset_token/"
  _pwd_auth_token = this.__base_url + "users/reset_password/"
  

  constructor(private _http: HttpClient) { }
  
  errorHandler(error: HttpErrorResponse){
    console.log('Error in pwd recovery service: ', error);
    return throwError(error)
  }

  authUser(userName: string | null | undefined){
    console.log('Requesting back for email otp: '+ userName);
    let queryParams = new HttpParams()
    if(Number(userName)){
      let mobile = Number(userName)
      queryParams = queryParams.append('mobile', mobile)
      return this._http.get<any>(this._pwd_otp_auth, {params: queryParams})
                                  .pipe(catchError(this.errorHandler))
    }
    else{
      let user = String(userName)
      queryParams = queryParams.append('email', user)
      return this._http.get<any>(this._pwd_otp_auth, {params: queryParams})
                      .pipe(catchError(this.errorHandler))
    }
  }

  updatePwd(userName: string | null | undefined, otp: string | null | undefined, newPassword: string | null | undefined ){
    let body = {
      'key': otp,
      'new_password': newPassword
    }
    let usernameType = Number(userName) ? {mobile: "+91" + Number(userName)} :{email: userName}
    body = Object.assign(usernameType, body)
    console.log('THis is body in updatePwd', body)
    return this._http.post<any>(this._pwd_auth_token, body)
                  .pipe(catchError(this.errorHandler))
  }
}
