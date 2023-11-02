import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { userNameValidator } from '../../../shared/email.validator';
import { SignupService } from '../../../shared/services/login/signup.service';
import { PwdrecoveryService } from '../../../shared/services/login/pwdrecovery.service';
import { MatDialog } from '@angular/material/dialog';
import { SuccessfulDialogComponent } from '../successful-dialog/successful-dialog.component';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css'],
})
export class ForgotpasswordComponent {
  constructor(
    private _fb: FormBuilder,
    private _signupService: SignupService,
    private _pwdRecoveryService: PwdrecoveryService,
    private _matDialog: MatDialog,
    private _router: Router
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
            alert(data['success'])
            this.authNotRequested = false;
            this.authResponse = data['detail'];
          },
          (error) => {
            console.log('Error in authUser: ', error);
            alert(error);
            this._router.navigate(['/login/forgot-password'])
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
          let dialogRef = this._matDialog.open(SuccessfulDialogComponent, {data: {message: 'Password changed successfully. Please login'}})
          setTimeout(() => {
            dialogRef.close()
          }, 3000);
          dialogRef.afterClosed().subscribe(
            data => {
              console.log('Success window close')
              this._router.navigate(['/home'])
            }
          )
        },
        (error) => {
          console.log('Error while changing the password', error)
          let dialogRef = this._matDialog.open(ErrorDialogComponent, {data: {message: 'Something went wrong. Please try again'}})
          setTimeout(() => {
            dialogRef.close()
          }, 3000);
        }
      );
    }
}
