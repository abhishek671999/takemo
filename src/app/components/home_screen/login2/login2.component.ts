import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/shared/services/register/login.service';
import { SignupService } from 'src/app/shared/services/register/signup.service';
import { Utility } from 'src/app/shared/site-variable';
import { interval, Subject, PartialObserver, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
    this.timer = interval(1000)
    .pipe(
      takeUntil(this.ispause)
    );

    this.timerObserver = {
   
    next: (_: number) => {  
       if(this.time==0){
        this.ispause.next;
      }
        this.time -= 1;        
    }
  };
  }
  ispause = new Subject();
  public time = 120;
  timer: Observable<number>;
  timerObserver: PartialObserver<number>;

  ngOnit(){
    
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

  secondsToHms(d) {
    d = Number(d);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var mDisplay = m > 0 ? m + (m == 1 ? ": " : " : ") : "00";
    var sDisplay = s > 0 ? s + (s == 1 ? "" : "") : "00";
    return mDisplay + sDisplay; 
}
  goOn() {
    
    this.timer.subscribe(this.timerObserver);
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
      (error) => {
        alert('Invalid user id or password')
        this.freezeEmail = true
      }
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
          console.log('call 2 response')
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
