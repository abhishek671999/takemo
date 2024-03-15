import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MeService } from 'src/app/shared/services/register/me.service';
import { meAPIUtility } from 'src/app/shared/site-variable';
import { SuccessMsgDialogComponent } from '../success-msg-dialog/success-msg-dialog.component';
import { atLeastOne } from 'src/app/shared/email.validator';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  constructor(
    private fb: FormBuilder,
    private meService: MeService,
    private router: Router,
    private meUtility: meAPIUtility,
    private dialog: MatDialog
  ) {}
  public profileForm = this.fb.group({
    firstName: ['', [Validators.required]],
    // lastName: ['', [Validators.required]],
    address: ['', [Validators.minLength(4)]],
    mobileNumber: [
      '',
      [Validators.maxLength(13)],
    ],
    email: ['', ],
  },
    { Validators: atLeastOne(Validators.required, ['email', 'mobileNumber']) });
  meData;

  ngOnInit() {
    this.meService.getMyInfo().subscribe(
      (data) => {
        this.meData = data;
        console.log('In profile', this.meData);
        this.updateForm();
        this.meUtility.setMeData(this.meData);
      },
      (error) => {
        console.log('Error in fetching me data');
      }
    );
  }

  updateForm() {
    this.profileForm.setValue({
      firstName: this.meData['first_name'] || '',
      // lastName: this.meData['last_name'] || '',
      address: this.meData['address'] || '',
      mobileNumber: this.meData['mobile'] || '',
      email: this.meData['email'] || '',
    });

    this.meData['email']
      ? this.profileForm.controls['email'].disable()
      : this.profileForm.controls['mobileNumber'].disable();
  }

  submitForm() {
    console.log('Form submmited', this.profileForm);
    let body = {
      name: this.profileForm.value.firstName,
      address: this.profileForm.value.address,
    };
    if (this.meData['email']) {
      body['mobile'] = this.profileForm.value.mobileNumber;
    } else if (this.meData['mobile']) {
      body['email'] = this.profileForm.value.email;
    }
    this.meService.updateUserDetails(body).subscribe(
      (data) => {
        console.log('Data: ', data);
        this.meData['address'] = this.profileForm.value.address || '';
        this.meData['first_name'] = this.profileForm.value.firstName;
        this.meUtility.setMeData(this.meData);
        this.dialog.open(SuccessMsgDialogComponent, {
          data: { msg: 'Profile Updated' },
        });
        this.router.navigate(['home/']);
      },
      (error) => {
        console.log('error', error);
        alert('Error');
      }
    );
  }

  showFieldifNot(val: string) {
    console.log(
      this.profileForm.getRawValue()[val],
      this.profileForm.getRawValue()
    );
    return !Boolean(this.profileForm.getRawValue()[val]);
  }
}
