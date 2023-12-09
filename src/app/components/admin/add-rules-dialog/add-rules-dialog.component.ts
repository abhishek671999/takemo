import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { RulesService } from 'src/app/shared/services/roles/rules.service';

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

  constructor(private _formBuilder: FormBuilder,
    private _rulesService: RulesService,
    private dialogRef: MatDialogRef<AddRulesDialogComponent>){}
  
  addRuleForm = this._formBuilder.group({
    name: ['', Validators.required],
    start_time: ['', Validators.required],
    end_time: ['', Validators.required],
    max_amount_per_shift: ['', Validators.required],
    checked: new FormControl(true, Validators.required)
  });

  
  getTwentyFourHourTime(amPmString) { 
    var d = new Date("1/1/2013 " + amPmString); 
    return d.getHours() + ':' + d.getMinutes(); 
}


  addRule(){
    let body = {
        "name": this.addRuleForm.value.name,
        "start_time":this.getTwentyFourHourTime(this.addRuleForm.value.start_time),
        "end_time": this.getTwentyFourHourTime(this.addRuleForm.value.end_time),
        "max_amount_per_shift": this.addRuleForm.value.max_amount_per_shift,
        "same_day_end_date": this.addRuleForm.value.checked
    }
    console.log('This is body: ', body)
    this._rulesService.addRule(body).subscribe(
      data => {
        console.log(data)
        this.dialogRef.close({success: 'ok'})
      },
      error => {
       console.log(error)
       this.dialogRef.close({success: 'failed'})
      }
    )
  }

  closeDialog(){
    console.log('  k l')
    this.dialogRef.close()
  }
}
