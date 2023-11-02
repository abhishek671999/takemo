import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private _http: HttpClient) { }

  _contact_us_url = 'http://localhost:3000/contact-us'

  contactUs(contactUsForm: any){
    return this._http.post<any>(this._contact_us_url, contactUsForm)
                      .pipe(catchError(this.errorHandler))
  }
  errorHandler(error: HttpErrorResponse){
    return throwError(error)
  }
}
