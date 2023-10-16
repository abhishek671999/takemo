import { Component } from '@angular/core';
import { User } from '../../../user';
import { LoginService } from '../../../login.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ContactService } from 'src/app/contact.service';

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

  onSubmit(userForm: any) {
    console.log(userForm);
    console.log(this.loginObj);
    this._loginService.login(this.loginObj.value).subscribe(
      (data) => {
        console.log('Success!', data);
        localStorage.setItem('token', data['key']);
        console.log('Redirecting')
        this._router.navigate(['home']);
      },
      (error) => alert('Invalid user id or password')
    );
  }
}
