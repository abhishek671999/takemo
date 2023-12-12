import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectComponentsService } from 'src/app/shared/services/connect-components/connect-components.service';
import { MeService } from 'src/app/shared/services/register/me.service';
import { Utility } from 'src/app/shared/site-variable';

@Component({
  selector: 'app-post-login',
  templateUrl: './post-login.component.html',
  styleUrls: ['./post-login.component.css']
})
export class PostLoginComponent {
  constructor(private _meService: MeService, private _router: Router, private _cc: ConnectComponentsService, private _utility: Utility){
    this._meService.getMyInfo().subscribe(
      data => {
        console.log('Me api from post login')
        this.myInfo = data
        this._cc.setMessage(this.myInfo)
      }
    )
  }

  showSpinner = true
  errorOccured = false
  myInfo;
  ngOnInit(){

    
     console.log('In user component')
      this._meService.getMyInfo().subscribe(
      data => {
        this.showSpinner = false
        console.log(data, data['restaurants'].length, )
        if(data['restaurants'].length > 0){
          sessionStorage.setItem('restaurant_id', data['restaurants'][0]['restaurant_id'])
          this._router.navigate(['owner/pending-orders'])
        }
        else if(data['companies'].length > 0){
          sessionStorage.setItem('company_id', data['companies'][0]['company_id'])
          this._router.navigate(['admin/user-management'])          
        }
        else{
          this._router.navigate(['user/'])
        }
      },
      error => {
        this.errorOccured = true
        this.showSpinner = false
      }
    )
  }

  
}
