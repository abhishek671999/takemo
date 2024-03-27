import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectComponentsService } from 'src/app/shared/services/connect-components/connect-components.service';
import { MeService } from 'src/app/shared/services/register/me.service';
import { Utility, meAPIUtility } from 'src/app/shared/site-variable';
import { LoginService } from 'src/app/shared/services/register/login.service';

@Component({
  selector: 'app-post-login',
  templateUrl: './post-login.component.html',
  styleUrls: ['./post-login.component.css']
})
export class PostLoginComponent {
  constructor(private _meService: MeService, private _router: Router, private _cc: ConnectComponentsService, 
    private _utility: Utility, private _meAPIUtility: meAPIUtility,
    public meAPIUtility: meAPIUtility, public loginService: LoginService ){
    // this.myInfo = this.meAPIUtility.getMeData()
  }

  showSpinner = true
  errorOccured = false
  myInfo;
  ngOnInit(){
     console.log('In user component')
    this.meAPIUtility.getMeData().subscribe((data) => {
      console.log(
        'This is in post logingL ',
        data,
        Boolean(data['first_name'])
      );
      this.myInfo = data;
      this.showSpinner = false;
      if (this.myInfo['restaurants'].length > 0) {
        sessionStorage.setItem('restaurant_id', data['restaurants'][0]['restaurant_id'])
        sessionStorage.setItem(
          'restaurant_name',
          data['restaurants'][0]['restaurant_name']
        );
        sessionStorage.setItem(
          'restaurant_address',
          data['restaurants'][0]['restaurant_address']
        );
        sessionStorage.setItem(
          'restaurant_gst',
          data['restaurants'][0]['restaurant_gst']
        );
        sessionStorage.setItem(
          'restaurant_kds',
          data['restaurants'][0]['restaurant_kds']
        );
        sessionStorage.setItem(
          'restaurantType',
          (data['restaurants'][0]['type'] as string).toLowerCase()
        );
        sessionStorage.setItem(
          'counter_management',
          data['restaurants'][0]['counter_management']
        );
        sessionStorage.setItem('inventory_management', data['restaurants'][0]['inventory_management']);
        sessionStorage.setItem('counter_management', data['restaurants'][0]['counter_management'])
        let navigationURL =
          sessionStorage.getItem('restaurant_kds') == 'true'? '/owner/orders/pending-orders': sessionStorage.getItem('restaurantType') == 'e-commerce'? '/owner/orders/unconfirmed-orders' : '/owner/orders/orders-history';
        this._router.navigate([navigationURL]);
      } else if (this.myInfo['companies'].length > 0) {
        console.log('Navigationto admin');
        sessionStorage.setItem('company_id', data['companies'][0]['company_id'])
        this._router.navigate(['admin/user-management']);
      } else {
        if (Boolean(this.myInfo['first_name'])) {
          this.loginService.redirectURL
            ? this._router.navigate([this.loginService.redirectURL])
            : this._router.navigate(['user/']);
        } else {
          this._router.navigate(['user/profile']);
        }
      }
    });
      
  }

  
}
