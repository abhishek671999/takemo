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
    let unAuthRequestsURLs = [host + 'rest-auth/login/', host + 'users/auth/token/', host + 'users/auth/email/', host + 'users/auth/mobile/',  ,  host + 'users/auth/mobile/']
    if(!unAuthRequestsURLs.includes(request.url)){
      request = request.clone({headers: this.utility.getHeaders()})
    }
    return next.handle(request).pipe(
      tap((event) => {
        console.log('Got correct resposne', event)
      },
      error => {
        if(error instanceof HttpErrorResponse){
          console.log('intercepted event', error, request.url, error.status, host + 'rest-auth/logout/' )
          if(error.status == 0){
            alert('Device not connected to Internet. Please check')
          }
          else if(error.status == 401 && request.url != host +'rest-auth/logout/'){
            this._loginService.logOut()
          }
        }
      }
      )
    );
  }
}
