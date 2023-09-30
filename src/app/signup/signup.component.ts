import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SignupService } from '../signup.service';
import { RegistrationUser } from '../user';
import { forbiddenNameValidator } from '../shared/user-name.validator';
import { passwordValidator } from '../shared/password.validator';
import { userNameValidator } from '../shared/email.validator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  ngOnInit(): void{
  }
  
  constructor(private _fb: FormBuilder, private _signupService: SignupService){

  }
  regex = new RegExp('^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})|(^[0-9]{10})+$')
  registrationForm = this._fb.group({
    email: ['', 
    {
      validators: [Validators.required, Validators.minLength(4),  Validators.pattern(this.regex)],
      asyncValidators: [userNameValidator(this._signupService)],
      updateOn: 'blur'
    }],
              
    pwd: ['', [Validators.required, Validators.minLength(8)]],
    rpwd: ['', [Validators.required, Validators.minLength(8)]]
  }, {validators: passwordValidator})
  
  otpForm = this._fb.group({
    otp: ['', [Validators.required, Validators.minLength(6)]]
  }
  )
  get registerFormControl() {
    return this.registrationForm.controls;
  }

  get otpFormControl() {
    return this.otpForm.controls;
  }

  registrationSubmit(){
    console.log(this.registrationForm.value)
    this._signupService.changePassword(this.__token!, this.registrationForm.value.pwd!, true).subscribe(
      data => console.log('Success!', data),
      error => {
        alert(error.statusText);
        console.log("Error while changing password: ", error.errorText)
      }
      )
  }
  __token = null;
  signUpSubmit(){
    console.log('Sign up successful');
    this._signupService.validateUser(this.registrationForm.value.email, this.otpForm.value.otp).subscribe(
      data => {
        console.log(data);
        this.__token = data['token']
        this.otpVerified = true
        this._signupService.fillDummyValue(this.__token!).subscribe(
          data => console.log('Dummy value filled: ', data),
          error => {
            console.log('Error while filling dummy values: ', error);
            alert(error.error['error'])
          }
        )
      },
      error => alert(error.statusText)
    )
  }


  authNotRequested = true;
  authResponse = null;
  authUser(){
    if (this.authNotRequested){
      console.log('authUser called')
      this._signupService.authUser(this.registrationForm.value.email).subscribe(
      data => {
        console.log("sucess: ", data);
        console.log(data['detail']);
        this.authNotRequested = false;
        this.authResponse = data['detail']
      },
      error => {
        console.log('Error in authUser: ', error)
        alert(error)
      }
    )
    }
  }

  otpVerified = false
  shoulddisplayOtpItem(){
    return this.registerFormControl.email.valid && ! this.otpVerified
  }

}
