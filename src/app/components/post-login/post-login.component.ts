import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectComponentsService } from 'src/app/shared/services/connect-components/connect-components.service';
import { MeService } from 'src/app/shared/services/register/me.service';
import { Utility, meAPIUtility, sessionWrapper } from 'src/app/shared/site-variable';
import { LoginService } from 'src/app/shared/services/register/login.service';

@Component({
  selector: 'app-post-login',
  templateUrl: './post-login.component.html',
  styleUrls: ['./post-login.component.css']
})
export class PostLoginComponent {
  constructor(private _router: Router, private _cc: ConnectComponentsService, 
    public meAPIUtility: meAPIUtility, public loginService: LoginService, private sessionWrapper: sessionWrapper ){
  }

  showSpinner = true
  errorOccured = false
  myInfo;
  ngOnInit() {
    sessionStorage.clear()
    this.meAPIUtility.getMeData().subscribe((data) => {
      this.myInfo = data;
        if (this.myInfo['restaurants'].length > 0) {
          let restaurant = data['restaurants'][0]
          if(sessionStorage.getItem('load_header') == 'true' || sessionStorage.getItem('load_header') == null) {
            this.meAPIUtility.setRestaurant(restaurant)
          }
          let navigationURL =
            restaurant['restaurant_kds'] == 'true'? '/owner/orders/pending-orders': restaurant['type'] == 'e-commerce'? '/owner/orders/unconfirmed-orders' : '/owner/orders/orders-history';
          this._router.navigate([navigationURL]);
        } else if (this.myInfo['companies'].length > 0) {
          this.meAPIUtility.setCompany(data['companies'][0])
          localStorage.setItem('role', 'corporate_admin')
          this._router.navigate(['admin/user-management']);
        } else {
          if (Boolean(this.myInfo['first_name'])) {
            if (this.loginService.redirectURL) {
              this._router.navigate([this.loginService.redirectURL])
            } else if (this.sessionWrapper.isPaymentDone) {
              if (this.sessionWrapper.isKDSEnabled) this._router.navigate(['/user/myorders/current-orders'])
              else this._router.navigate(['user/myorders/order-history'])
              this.sessionWrapper.isPaymentDone = false
              this.sessionWrapper.isKDSEnabled = false
            }
            else {
              this._router.navigate(['user/']);
            }
          } else {
            this._router.navigate(['user/profile']);
          }
      }
      this.showSpinner = false;
    },
      error => {
      alert('Me api load failed')
    });
  }

  
}
