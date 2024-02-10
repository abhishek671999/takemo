import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-add-counter-dialog',
  templateUrl: './add-counter-dialog.component.html',
  styleUrls: ['./add-counter-dialog.component.css']
})
export class AddCounterDialogComponent {

  constructor(
    private _fb: FormBuilder
  ){}


}
