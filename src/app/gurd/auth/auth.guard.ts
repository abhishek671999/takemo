import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from 'src/app/shared/services/register/login.service';

export const authGuard: CanActivateFn = (route, state) => {
  debugger
  if (inject(LoginService).isLoggedIn()) {
    console.log('THis is true')
      //inject(Router).navigate(['home'])
    return true;
  } else {
    console.log('Not logged in: setting: ', window.location.href)
    inject(LoginService).redirectURL = window.location.href
    inject(Router).navigate(['login']);
    return false;
  }
};

export const authGuard2: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(LoginService).canActivate(next, state)
}