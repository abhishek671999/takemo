import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MeService } from 'src/app/shared/services/register/me.service';

@Component({
  selector: 'app-post-login',
  templateUrl: './post-login.component.html',
  styleUrls: ['./post-login.component.css']
})
export class PostLoginComponent {
  constructor(private _meService: MeService, private _router: Router){}

  showSpinner = true
  errorOccured = false
  ngOnInit(){
      console.log('In user component')
    this._meService.getMyInfo().subscribe(
      data => {
        this.showSpinner = false
        console.log(data, data['restaurants'].length, )
        if(data['restaurants'].length > 0){
          this._router.navigate(['owner/pending-orders'])
        }
        else if(data['companies'].length > 0){
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
