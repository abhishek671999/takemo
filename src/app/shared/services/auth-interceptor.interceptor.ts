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
import { MatDialog } from '@angular/material/dialog';
import { ErrorMsgDialogComponent } from 'src/app/components/shared/error-msg-dialog/error-msg-dialog.component';

@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor {

  constructor(public utility: Utility, private _loginService: LoginService, private _router: Router, private meAPIUtility: meAPIUtility, private matDialog: MatDialog) {}
  loggedInFlag = false
  showErrorMessage = true
  offlineRedirected = false
  

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let unAuthRequestsURLs = [host + 'rest-auth/login/', host + 'users/auth/token/', host + 'users/auth/email/', host + 'users/auth/mobile/', host + 'users/auth/mobile/']
    if(!unAuthRequestsURLs.includes(request.url)){
      request = request.clone({headers: this.utility.getHeaders()})
    }
    if(!navigator.onLine && !this.offlineRedirected){
      alert('Browser offline. Redirecting to POS')
      this.offlineRedirected = true
      let tableName = sessionStorage.getItem('table_name')
      this.meAPIUtility.getRestaurant().subscribe(
        (restaurant) => {
          if(restaurant['table_management'] && !tableName){
            this._router.navigate(['./owner/dine-in/table-cockpit'])
          }else{
            this._router.navigate(['/owner/point-of-sale'])
          }
        })
    }else if(navigator.onLine){
      this.offlineRedirected = false
    }
    return next.handle(request).pipe(
      tap((event) => {
        this.loggedInFlag = true
        this.showErrorMessage = true
      },
      error => {
        if(error instanceof HttpErrorResponse){
          console.log('intercepted event', error, request.url, error.status)
          setTimeout(() => {
            this.showErrorMessage = true
          }, 5000);
          if(error.status == 0){
            if(this.showErrorMessage){
             alert('Device not connected to Internet. Please check')
            }  
          } else if (error.status != 400 && error.error.detail?.toLowerCase().startsWith('invalid token')) {
            if (this.loggedInFlag) {
              this.loggedInFlag = false
              sessionStorage.clear();
              this.meAPIUtility.removeMeData();
              this._router.navigate(['login']);
              alert('Session over. Please login')
             }
          } else if(error.status == 400 && error.error.description){
            if(this.showErrorMessage) this.matDialog.open(ErrorMsgDialogComponent, {data: {msg: `${error.error.description}`}})
          }
          else if(error.status == 401 ){
            if(error.error.description == "You do not have access to perform this action") this._router.navigate(['user/profile'])
            else if(request.url != host +'rest-auth/logout/') this._router.navigate(['home'])
          }
          this.showErrorMessage = false
        }
      }
      )
    );
  }
}
