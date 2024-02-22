import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Utility, host } from '../site-variable';
import { LoginService } from './register/login.service';

@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor {

  constructor(public utility: Utility, private _loginService: LoginService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let unAuthRequestsURLs = [host + 'rest-auth/login/', host + 'users/auth/token/', host + 'users/auth/email/']
    if(!unAuthRequestsURLs.includes(request.url)){
      request = request.clone({headers: this.utility.getHeaders()})
    }
    return next.handle(request).pipe(
      tap((event) => {
        if(event instanceof HttpResponse){
          console.log('intercepted event', event, request.url, event.status)
          if(event.status == 401){
            this._loginService.logOut()
          }
        }
        
      })
    );
  }
}
