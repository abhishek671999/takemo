import { Component } from '@angular/core';
import { SignupService } from 'src/app/signup.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private _signupService: SignupService) {}

  dropdownList = [
    {
      name: 'Profile',
    },
    {
      name: 'Add restaurant',
    },
    {
      name: 'Setting',
    },
    {
      name: 'Logout',
    },
  ];
}
