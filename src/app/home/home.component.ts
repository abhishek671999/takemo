import { Component } from '@angular/core';
import { User } from '../user';
import { LoginService } from '../login.service';
import { FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

      constructor(private _fb: FormBuilder, private _loginService: LoginService){}
      regex = new RegExp('^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})|(^[0-9]{10})+$')
      loginObj = this._fb.group({
        email: ['', [Validators.required, Validators.minLength(4),  Validators.pattern(this.regex)]],
        password: ['', [Validators.required, Validators.minLength(4)]]
      })

      get loginFormControl(){
        return this.loginObj.controls
      }


      submitted = false;
      errorMsg = '';

      onSubmit(userForm: any){
        console.log(userForm);
        console.log(this.loginObj);
        this._loginService.login(this.loginObj.value)
          .subscribe(
            data => console.log('Success!', data),
            error => alert(error.statusText)
          )
      }
}
