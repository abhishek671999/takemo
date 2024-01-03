import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectComponentsService } from 'src/app/shared/services/connect-components/connect-components.service';
import { MeService } from 'src/app/shared/services/register/me.service';
import { Utility, meAPIUtility } from 'src/app/shared/site-variable';
import { getMessaging, getToken } from "firebase/messaging";
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-post-login',
  templateUrl: './post-login.component.html',
  styleUrls: ['./post-login.component.css']
})
export class PostLoginComponent {
  constructor(private _meService: MeService, private _router: Router, private _cc: ConnectComponentsService, 
    private _utility: Utility, private _meAPIUtility: meAPIUtility,
    public meAPIUtility: meAPIUtility ){
    // this.myInfo = this.meAPIUtility.getMeData()
  }

  showSpinner = true
  errorOccured = false
  myInfo;
  ngOnInit(){
      this.requestPermission();
     console.log('In user component')
     this.meAPIUtility.getMeData().subscribe(data =>{
      this.myInfo = data
      this.showSpinner = false
        if(this.myInfo['restaurants'].length > 0){
          console.log('navigating to owner')
          sessionStorage.setItem('restaurant_id', this.myInfo['restaurants'][0]['restaurant_id'])
          this._router.navigate(['owner/pending-orders'])
        }
        else if(this.myInfo['companies'].length > 0){
          console.log('Navigationto admin')
          sessionStorage.setItem('company_id', this.myInfo['companies'][0]['company_id'])
          this._router.navigate(['admin/user-management'])          
        }
        else{
          console.log('Navigating to user')
          this._router.navigate(['user/'])
        }
      
     })
      
  }
  requestPermission() {
    const messaging = getMessaging();
    getToken(messaging, 
     { vapidKey: environment.firebase.vapidKey}).then(
       (currentToken) => {
         if (currentToken) {
           console.log("Hurraaa!!! we got the token.....");
           console.log(currentToken);
           let body = {
            token: currentToken
           }
           this._meService.updatePostNotifcationToken(body).subscribe(
              data => {
                console.log('Updated push notification successfully')
              },
              error => {
                console.log('Error while posting token')
              }
           )
         } else {
           console.log('No registration token available. Request permission to generate one.');
         }
     }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
    });
  }

  
}
