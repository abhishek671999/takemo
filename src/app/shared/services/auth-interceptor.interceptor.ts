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
import { Utility, host, meAPIUtility } from '../site-variable';
import { LoginService } from './register/login.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor {

  constructor(public utility: Utility, private _loginService: LoginService, private _router: Router, private meAPIUtility: meAPIUtility) {}
  loggedInFlag = false
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let unAuthRequestsURLs = [host + 'rest-auth/login/', host + 'users/auth/token/', host + 'users/auth/email/', host + 'users/auth/mobile/',  ,  host + 'users/auth/mobile/']
    if(!unAuthRequestsURLs.includes(request.url)){
      request = request.clone({headers: this.utility.getHeaders()})
    }
    return next.handle(request).pipe(
      tap((event) => {
        console.log('Got correct resposne', event)
        this.loggedInFlag = true
      },
      error => {
        if(error instanceof HttpErrorResponse){
          console.log('intercepted event', error, request.url, error.status, host + 'rest-auth/logout/')
          if(error.status == 0){
            alert('Device not connected to Internet. Please check')
          } else if (error.error.detail?.toLowerCase().startsWith('invalid token')) {
            if (this.loggedInFlag) {
              this.loggedInFlag = false
              sessionStorage.clear();
              this.meAPIUtility.removeMeData();
              this._router.navigate(['login']);
              alert('Session over. Please login')
             }
          }
          else if(error.status == 401 && request.url != host +'rest-auth/logout/'){
           this._router.navigate(['home'])
          }
        }
      }
      )
    );
  }
}
