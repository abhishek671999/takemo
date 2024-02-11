import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CounterService } from 'src/app/shared/services/inventory/counter.service';

import {FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { svgDeleteIcon } from 'src/app/shared/icons/svg-icons';

@Component({
  selector: 'app-food-counter-management',
  templateUrl: './food-counter-management.component.html',
  styleUrls: ['./food-counter-management.component.css'],
})
export class FoodCounterManagementComponent {

  constructor(
    private counterService: CounterService,
    private dialog: MatDialog,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    ){
      iconRegistry.addSvgIconLiteral(
        'delete',
        sanitizer.bypassSecurityTrustHtml(svgDeleteIcon)
      );
    }
  counterResponse;

  counterFormControl = new FormControl('', [Validators.required]);

  ngOnInit(){

    this.counterService.getRestaurantCounter(sessionStorage.getItem('restaurant_id')).subscribe(
      data => {
        this.counterResponse = data['counters']
      },
      error => {

      }
    )
  }


  deleteCounter(counter){
    
  }

  addCounter(){
    let body = {
      "restaurant_id": sessionStorage.getItem('restaurant_id'),
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
