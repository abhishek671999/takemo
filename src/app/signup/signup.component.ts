import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SignupService } from '../signup.service';
import { RegistrationUser } from '../user';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  ngOnInit(): void{
  }
  
  constructor(private _signupService: SignupService){

  }

  registrationForm = new FormGroup({
    firstname: new FormControl(""),
    lastname: new FormControl(""),
    email: new FormControl(""),
    pwd: new FormControl(""),
    rpwd: new FormControl("")
  });

  regUser = new RegistrationUser(
    this.registrationForm.value.firstname!,
    this.registrationForm.value.lastname!,
    this.registrationForm.value.email!,
    this.registrationForm.value.pwd!,
    this.registrationForm.value.rpwd!
    )

  registrationSubmit(){
    console.log(this.registrationForm.value)
    this._signupService.signup(this.regUser)
  }
}
