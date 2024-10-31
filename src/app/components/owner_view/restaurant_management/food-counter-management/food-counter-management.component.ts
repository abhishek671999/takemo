import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CounterService } from 'src/app/shared/services/inventory/counter.service';

import {FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { svgDeleteIcon, svgEditIcon } from 'src/app/shared/icons/svg-icons';
import { meAPIUtility } from 'src/app/shared/site-variable';
import { ErrorMsgDialogComponent } from 'src/app/components/shared/error-msg-dialog/error-msg-dialog.component';

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
    private meUtility: meAPIUtility,
    private matdialog: MatDialog
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

  counternameFormControl = new FormControl('', [Validators.required]);
  counterIPFormControl = new FormControl('');
  public restaurantId: number

  ngOnInit(){
    this.meUtility.getRestaurant().subscribe(
      (restaurant) => {
        this.restaurantId = restaurant['restaurant_id']
        this.fetchCounters()
      }
    )

  }
  
  fetchCounters(){
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

  editCounter(counter){
      let body = {
        "restaurant_id": this.restaurantId,
        "counter_id": counter.counter_id,
        "counter_name": counter.counter_name,
        "ip": counter.ip
      }
      this.counterService.editRestaurantCounter(body).subscribe(
        data =>{
          counter.counter_name = counter.counter_name,
          counter.ip = counter.ip
          counter.is_edit = false
        },
        error => {
          this.matdialog.open(ErrorMsgDialogComponent, {data: {msg: 'Failed to update counter'}})
          this.ngOnInit()
        }
      )
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
      "counter_name": this.counternameFormControl.value,
      "ip": this.counterIPFormControl.value
    }
    this.counterService.addRestaurantCounter(body).subscribe(
      data => {
        this.counternameFormControl.reset()
        this.counterIPFormControl.reset()
        this.ngOnInit()
      },
      error => {
        console.log(error)
      }
    )
  }
}
