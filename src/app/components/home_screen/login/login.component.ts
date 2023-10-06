import { Component } from '@angular/core';
import { User } from '../../../user';
import { LoginService } from '../../../login.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  constructor(
    private _fb: FormBuilder,
    private _loginService: LoginService,
    private _router: Router
  ) {}
  regex = new RegExp(
    '^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})|(^[0-9]{10})+$'
  );
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
  errorMsg = 'abhishek';

  onSubmit(userForm: any) {
    console.log(userForm);
    console.log(this.loginObj);
    this._loginService.login(this.loginObj.value).subscribe(
      (data) => {
        console.log('Success!', data);
        window.localStorage.setItem('token', data['key']);
        this._router.navigate(['test']);
      },
      (error) => alert('Invalid user id or password')
    );
  }
}
