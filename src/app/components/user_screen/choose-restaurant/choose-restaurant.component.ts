import { Component } from '@angular/core';

@Component({
  selector: 'app-choose-restaurant',
  templateUrl: './choose-restaurant.component.html',
  styleUrls: ['./choose-restaurant.component.css']
})
export class ChooseRestaurantComponent {
  restaurants: any
  showSpinner: true

  onSelect(resturant){
    console.log(resturant)
  }
}
