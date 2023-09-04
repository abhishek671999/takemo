import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { passwordValidator } from '../shared/password.validator';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent {
  constructor(private _fb: FormBuilder){}
  regex = new RegExp('^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})|(^[0-9]{10})+$')
  contactObj = this._fb.group({
    name: ['', [Validators.required]],
    email_or_phone: ['', [Validators.required, Validators.pattern(this.regex)]],
    message: ['']
  })

  onSend(contantForm: any){
    console.log('This is the request'+ contantForm)
  }
}
