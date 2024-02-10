import { Component } from '@angular/core';
import { Router,NavigationStart }  from "@angular/router";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  host: {'some-binding': 'some-value'},
})
export class HomeComponent {
  
}
