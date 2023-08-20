import { Component } from '@angular/core';
import { User } from '../user';
import { LoginService } from '../login.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
      loginObj = {
        userName: '',
        passWord: ''
      };
      submitted = false;
      errorMsg = '';
      userModel = new User('mail@gmail.com', 'password')

      constructor(private _loginService: LoginService){}

      onLogin(){
        console.log('UserName: '+ this.loginObj.userName, 'Password: ', this.loginObj.passWord)
      }

      onSubmit(userForm: any){
        console.log(userForm);
        console.log(this.userModel);
        this._loginService.login(this.userModel)
          .subscribe(
            data => console.log('Success!', data),
            error => alert(error.statusText)
          )
      }
}
