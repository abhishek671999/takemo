import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { meAPIUtility } from 'src/app/shared/site-variable';

@Component({
  selector: 'app-attendence-home',
  templateUrl: './attendence-home.component.html',
  styleUrls: ['./attendence-home.component.css']
})
export class AttendenceHomeComponent {

  constructor(private meUtility: meAPIUtility, private router: Router){}
  employeePages = [
    {name: 'Attendance' , href: "attendance" },
    {name: 'Employee', href: "employees"},
  ]

  ngOnInit(){
  
  }


}
