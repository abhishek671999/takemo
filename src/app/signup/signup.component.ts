import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SignupService } from '../signup.service';
import { RegistrationUser } from '../user';
import { forbiddenNameValidator } from '../shared/user-name.validator';
import { passwordValidator } from '../shared/password.validator';
import { emailValidator } from '../shared/email.validator';

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
      asyncValidators: [emailValidator(this._signupService)],
      updateOn: 'blur'
    }],
              
    pwd: ['', [Validators.required, Validators.minLength(8)]],
    rpwd: ['', [Validators.required, Validators.minLength(8)]]
  }, {validators: passwordValidator})
  


  get registerFormControl() {
    return this.registrationForm.controls;
  }

  registrationSubmit(){
    console.log(this.registrationForm.value)
    this._signupService.signup(this.registrationForm.value).subscribe(
      data => console.log('Success!', data),
      error => alert(error.statusText)
      )
  }
}
