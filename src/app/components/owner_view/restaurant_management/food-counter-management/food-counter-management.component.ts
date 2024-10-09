import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CounterService } from 'src/app/shared/services/inventory/counter.service';

import {FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { svgDeleteIcon, svgEditIcon } from 'src/app/shared/icons/svg-icons';
import { sessionWrapper } from 'src/app/shared/site-variable';

@Component({
  selector: 'app-food-counter-management',
  templateUrl: './food-counter-management.component.html',
  styleUrls: ['./food-counter-management.component.css'],
})
export class FoodCounterManagementComponent {

  constructor(
    private counterService: CounterService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private __sessionWrapper: sessionWrapper
    ){
      iconRegistry.addSvgIconLiteral(
        'delete',
        sanitizer.bypassSecurityTrustHtml(svgDeleteIcon)
      );
      iconRegistry.addSvgIconLiteral(
        'edit',
        sanitizer.bypassSecurityTrustHtml(svgEditIcon)
      );
    }
  counterResponse;

  counterFormControl = new FormControl('', [Validators.required]);
  public restaurantId = this.__sessionWrapper.getItem('restaurant_id')

  ngOnInit(){

    this.counterService.getRestaurantCounter(this.restaurantId).subscribe(
      data => {
        this.counterResponse = data['counters']
        this.counterResponse.forEach(element => {
          element['is_edit'] = false
        });
      },
      error => {

      }
    )
  }

  enableEditCounter(counter){
    counter.is_edit = !counter.is_edit
  }

  editCounter(counter, event){
    if(event.target.value == counter.counter_name){
      counter.is_edit = !counter.is_edit
    }else{
      let body = {
        "restaurant_id": this.restaurantId,
        "counter_id": counter.counter_id,
        "counter_name": event.target.value
      }
      this.counterService.editRestaurantCounter(body).subscribe(
        data =>{
          console.log(data)
          counter.counter_name = event.target.value
          counter.is_edit = false
        },
        error => alert('Update failed')
      )
    }
  }

  deleteCounter(counter){
    let body = {
      counter_id: counter.counter_id,
      restaurant_id: this.restaurantId
    }
    this.counterService.deleteCounter(body).subscribe(
      (data: any) => {
        this.ngOnInit()
      },
      (error: any) => {
        alert('Failed to delete counter')
      }
    )
  }

  addCounter(){
    let body = {
      "restaurant_id": this.restaurantId,
      "counter_name": this.counterFormControl.value
    }
    this.counterService.addRestaurantCounter(body).subscribe(
      data => {
        console.log(data)
        this.ngOnInit()
      },
      error => {
        console.log(error)
      }
    )
  }
}
