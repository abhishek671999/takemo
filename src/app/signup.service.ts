import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { RegistrationUser } from './user';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SignupService {
  _url = 'http://localhost:3000/signup'
  constructor(private _http: HttpClient) {}

  signup(regUser: any){
    console.log(regUser)
    return this._http.post<any>(this._url, regUser)
                .pipe(catchError(this.errorHandler))
  }

  errorHandler(error: HttpErrorResponse){
    return throwError(error)
  }

}

