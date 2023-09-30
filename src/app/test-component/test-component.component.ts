import { Component } from '@angular/core';
import { SignupService } from '../signup.service';

@Component({
  selector: 'app-test-component',
  templateUrl: './test-component.component.html',
  styleUrls: ['./test-component.component.css']
})
export class TestComponentComponent {
  constructor(private _signupService: SignupService){}

  testFunction(){
    const token = '62444019d16b013775d886284c99caaf19440c95'
    const new_password = 'abhay123'
    this._signupService.changePassword(token, new_password).subscribe(
      data => console.log(data),
      error => console.log(error)
    )
  }

  // testFunction(){
  //   console.log(window.localStorage.getItem('token'))
  // }
  

}
