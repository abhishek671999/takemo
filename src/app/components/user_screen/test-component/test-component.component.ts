import { Component } from '@angular/core';
import { SignupService } from '../../../shared/services/login/signup.service';

@Component({
  selector: 'app-test-component',
  templateUrl: './test-component.component.html',
  styleUrls: ['./test-component.component.css'],
})
export class TestComponentComponent {
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
