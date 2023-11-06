import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-rules-dialog',
  templateUrl: './add-rules-dialog.component.html',
  styleUrls: ['./add-rules-dialog.component.css']
})
export class AddRulesDialogComponent {
//   let body = {
//     "name": "Test",
//     "start_time": "17:40:00",
//     "end_time": "17:45:00",
//     "max_amount_per_shift": 300
// }

  constructor(private _formBuilder: FormBuilder){}
  
  addRuleForm = this._formBuilder.group({
    name: ['', Validators.required],
    start_time: ['', Validators.required],
    end_time: ['', Validators.required],
    max_amount_per_shift: ['', Validators.required]
  });

  addRule(){
    console.log('ADd rule in dialog')
  }
}
