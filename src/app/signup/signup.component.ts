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
  registrationForm = this._fb.group({
    firstname: ['', [Validators.required, Validators.minLength(4), forbiddenNameValidator(/admin/)]],
    lastname: ['',  [Validators.required, Validators.minLength(4)]],
    email: ['', [Validators.required, Validators.minLength(4),  Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    pwd: ['', [Validators.required]],
    rpwd: ['', [Validators.required]]
  }, {validators: passwordValidator})
  
  // registrationForm = new FormGroup({
  //   firstname: new FormControl(""),
  //   lastname: new FormControl(""),
  //   email: new FormControl(""),
  //   pwd: new FormControl(""),
  //   rpwd: new FormControl("")
  // });

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
