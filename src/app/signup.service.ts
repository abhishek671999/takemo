import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { RegistrationUser } from './user';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SignupService {
  _signup_url = 'http://localhost:3000/signup'
  _signup_is_user_registered = 'http://65.20.75.191:8001/api/v1/users/is_user_registered/'
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
    // queryParams = queryParams.append('is_user_registered', email_or_phone)
    return this._http.get<any>(this._signup_is_user_registered, {params: queryParams} )
                      .pipe(catchError(this.errorHandler))
  }

}

