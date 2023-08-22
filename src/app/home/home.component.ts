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
      // loginObj = {
      //   userName: '',
      //   passWord: ''
      // };

      loginObj = this._fb.group({
        email: ['', [Validators.required, Validators.minLength(4),  Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
        password: ['']
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
