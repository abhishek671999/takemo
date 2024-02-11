import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from 'src/app/shared/services/register/login.service';

export const authGuard: CanActivateFn = (route, state) => {
  if (inject(LoginService).isLoggedIn()) {
      //inject(Router).navigate(['home'])
    return true;
  } else {
    inject(Router).navigate(['login']);
    return false;
  }
};
