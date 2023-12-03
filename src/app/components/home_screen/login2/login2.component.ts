import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/shared/services/register/login.service';
import { SignupService } from 'src/app/shared/services/register/signup.service';
import { Utility } from 'src/app/shared/site-variable';

@Component({
  selector: 'app-login2',
  templateUrl: './login2.component.html',
  styleUrls: ['./login2.component.css']
})

export class Login2Component {
  constructor(
    private _fb: FormBuilder,
    private _loginService: LoginService,
    private _router: Router,
    private _utility: Utility,
    private _signUpService: SignupService
  ) {
    
  }

  regex = new RegExp(
    '^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})|(^[0-9]{10})+$'
  );
  hide = true;
  loginObj = this._fb.group({
    username: [
      '',
      [
        Validators.required,
        Validators.minLength(4),
        Validators.pattern(this.regex),
      ],
    ],
    otp: ['', 
    [
      Validators.required, 
      Validators.minLength(6)]
    ],
  });

  get loginFormControl() {
    return this.loginObj.controls;
  }

  submitted = false;

  onSubmit(userForm: any) {
    console.log('On submit called')
    console.log(userForm);
    console.log(this.loginObj);
    this._loginService.login(this.loginObj.value).subscribe(
      (data) => {
        console.log('Success!!', data);
        this._utility.setToken(data['key'])
        localStorage.setItem('token', data['key']);
        console.log('Redirecting');
        this._router.navigate(['home']);
      },
      (error) => alert('Invalid user id or password')
    );
  }

 
  logIn(){
    this.loginFormControl.username.enable()
    this._signUpService.validateUser(this.loginObj.value.username, this.loginObj.value.otp).subscribe(
      (data) => {
        console.log('Success!!', data);
        this._utility.setToken(data['token'])
        console.log('Redirecting');
        this._router.navigate(['home']);
      },
      (error) => alert('Invalid user id or password')
    );
  }

  editEmail(){
    this.freezeEmail = false
    this.loginFormControl.username.enable()
  }

  freezeEmail = false
  authUser() {
      console.log('authUser called');
      this._signUpService.authUser(this.loginObj.value.username).subscribe(
        (data) => {
          console.log('sucess: ', data);
          console.log(data['detail']);
          this.freezeEmail = true
          this.loginFormControl.username.disable()
        },
        (error) => {
          console.log('Error in authUser: ', error);
          alert(error);
        }
      );
  }
}
