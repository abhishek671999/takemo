import { Component } from '@angular/core';
import { LoginService } from '../../../shared/services/register/login.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Utility } from 'src/app/shared/site-variable';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(
    private _fb: FormBuilder,
    private _loginService: LoginService,
    private _router: Router,
    private _utility: Utility
  ) {}

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
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  get loginFormControl() {
    return this.loginObj.controls;
  }

  submitted = false;

  onSubmit(userForm: any) {
    console.log(userForm);
    console.log(this.loginObj);
    this._loginService.login(this.loginObj.value).subscribe(
      (data) => {
        this._loginService.logginStatus = true
        this._utility.setToken(data['key'])
        localStorage.setItem('token', data['key']);
        this._router.navigate(['home']);
      },
      (error) => alert('Invalid user id or password')
    );
  }
}
