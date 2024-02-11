import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SignupService } from '../../../shared/services/register/signup.service';
import { RegistrationUser } from '../../../user';
import { forbiddenNameValidator } from '../../../shared/user-name.validator';
import { passwordValidator } from '../../../shared/password.validator';
import { userNameValidator } from '../../../shared/email.validator';
import { MatDialog } from '@angular/material/dialog';
import { SuccessfulDialogComponent } from '../successful-dialog/successful-dialog.component';
import { Router } from '@angular/router';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  constructor(
    private _fb: FormBuilder,
    private _signupService: SignupService,
    private _matDialog: MatDialog,
    private _router: Router
  ) {}

  regex = new RegExp(
    '^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})|(^[0-9]{10})+$'
  );
  registrationForm = this._fb.group(
    {
      email: [
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(4),
            Validators.pattern(this.regex),
          ],
          asyncValidators: [userNameValidator(this._signupService)],
          updateOn: 'blur',
        },
      ],

      pwd: ['', [Validators.required, Validators.minLength(8)]],
      rpwd: ['', [Validators.required, Validators.minLength(8)]],
    },
    { validators: passwordValidator }
  );

  otpForm = this._fb.group({
    otp: ['', [Validators.required, Validators.minLength(6)]],
  });
  get registerFormControl() {
    return this.registrationForm.controls;
  }

  get otpFormControl() {
    return this.otpForm.controls;
  }

  registrationSubmit() {
    console.log(this.registrationForm.value);
    this._signupService
      .changePassword(this.__token!, this.registrationForm.value.pwd!, true)
      .subscribe(
        (data) => {
          console.log('Success!', data);
          let matDialogRef = this._matDialog.open(SuccessfulDialogComponent, {
            data: { message: 'User Registered. Please login' },
          });
          setTimeout(() => {
            matDialogRef.close();
          }, 3000);
          this._router.navigate(['/']);
        },
        (error) => {
          alert(error.statusText);
          console.log('Error while changing password: ', error.errorText);
          let matDialogRef = this._matDialog.open(ErrorDialogComponent, {
            data: { message: 'Something went wrong. Please try again' },
          });
          setTimeout(() => {
            matDialogRef.close();
          }, 3000);
          this._router.navigate(['/login/signup']);
        }
      );
  }

  __token = null;
  signUpSubmit() {
    console.log('Sign up successful');
    this._signupService
      .validateUser(this.registrationForm.value.email, this.otpForm.value.otp)
      .subscribe(
        (data) => {
          console.log(data);
          this.__token = data['token'];
          this.otpVerified = true;
          this._signupService.fillDummyValue(this.__token!).subscribe(
            (data) => console.log('Dummy value filled: ', data),
            (error) => {
              console.log('Error while filling dummy values: ', error);
              alert(error.error['error']);
            }
          );
        },
        (error) => alert(error.statusText)
      );
  }

  authNotRequested = true;
  authResponse = null;
  authUser() {
    if (this.authNotRequested) {
      console.log('authUser called');
      this._signupService.authUser(this.registrationForm.value.email).subscribe(
        (data) => {
          console.log('sucess: ', data);
          console.log(data['detail']);
          this.authNotRequested = false;
          this.authResponse = data['detail'];
        },
        (error) => {
          console.log('Error in authUser: ', error);
          alert(error);
        }
      );
    }
  }

  otpVerified = false;
  shoulddisplayOtpItem() {
    return this.registerFormControl.email.valid && !this.otpVerified;
  }
}
