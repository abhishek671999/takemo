import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { userNameValidator } from '../../../shared/email.validator';
import { SignupService } from '../../../signup.service';
import { PwdrecoveryService } from '../../../pwdrecovery.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css'],
})
export class ForgotpasswordComponent {
  constructor(
    private _fb: FormBuilder,
    private _signupService: SignupService,
    private _pwdRecoveryService: PwdrecoveryService
  ) {}

  regex = new RegExp(
    '^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})|(^[0-9]{10})+$'
  );
  pwdRecoverForm = this._fb.group({
    username: [
      '',
      {
        validators: [
          Validators.required,
          Validators.minLength(4),
          Validators.pattern(this.regex),
        ],
      },
    ],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  otpForm = this._fb.group({
    otp: ['', [Validators.required, Validators.minLength(6)]],
  });

  get pwdRecoverFormControl() {
    return this.pwdRecoverForm.controls;
  }

  otpVerified = false;
  shoulddisplayOtpItem() {
    return this.pwdRecoverFormControl.username.valid && !this.otpVerified;
  }

  authNotRequested = true;
  authResponse = null;
  authUser() {
    if (this.authNotRequested && this.pwdRecoverForm.controls.username.valid) {
      console.log('authUser called');
      this._pwdRecoveryService
        .authUser(this.pwdRecoverForm.value.username)
        .subscribe(
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

  newPwdSubmit() {
    this._pwdRecoveryService
      .updatePwd(
        this.pwdRecoverForm.value.username,
        this.otpForm.value.otp,
        this.pwdRecoverForm.value.newPassword
      )
      .subscribe(
        (data) => {
          console.log(data);
        },
        (error) => alert(error.statusText)
      );
  }
}
