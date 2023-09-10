import { Component } from '@angular/core';
import { SignupService } from '../signup.service';

@Component({
  selector: 'app-test-component',
  templateUrl: './test-component.component.html',
  styleUrls: ['./test-component.component.css']
})
export class TestComponentComponent {
  constructor(private _signupService: SignupService){}

  // testFunction(){
  //   const token = '1f64885d6f6db3ca436276404f4e79032bd013ff'
  //   const new_password = 'abhay123'
  //   this._signupService.changePassword(token, new_password).subscribe(
  //     data => console.log(data),
  //     error => console.log(error)
  //   )
  // }

  testFunction(){
    console.log(window.localStorage.getItem('token'))
  }
  

}
