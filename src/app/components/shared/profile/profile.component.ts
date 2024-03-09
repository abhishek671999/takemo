import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MeService } from 'src/app/shared/services/register/me.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  constructor(private fb: FormBuilder, private meService: MeService) { }
  public profileForm = this.fb.group({
    firstName: ['',[Validators.required]],
    lastName: ['',[Validators.required]],
    address: ['',[Validators.required, Validators.minLength(4), Validators.maxLength(25)]],
    mobileNumber: [''],
    email: ['', [Validators.required]],
  });

  ngOnInit() {
    this.meService.getMyInfo().subscribe(data => {
      this.updateForm(data)
    },
      error => {
        console.log('Error in fetching me data')
      })
  }

  updateForm(data) {
    console.log('Updpateing profile')
    this.profileForm.setValue({
      firstName: data['firstName'] || '',
      lastName: data['lastName'] || '',
      address: data['address'] || '',
      mobileNumber: data['mobile'] || '',
      email: data['email'] || ''
    })
  }

  submitForm() {
    console.log('Form submmited', this.profileForm)
  }
}
